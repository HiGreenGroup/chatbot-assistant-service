import { createChatCompletion, createEmbeddings, streamChatCompletion } from "./openai-client";
import { KbSearchResult, normalizeEmbedding, searchKnowledgeBase } from "./knowledge-base";
import { buildPageContextInstruction, extractPageContext, getPrioritySources } from "./page-context";
import { appendTurn, ChatTurn, getHistory } from "./session-store";
import { ChatContext, ChatResponse, ChatRole, ChatSource } from "./types";

const BASE_INSTRUCTION = `Eres el Asistente Virtual de EmpleoServicio, una plataforma que conecta candidatos con empresas.
Responde utilizando únicamente la información proporcionada en el contexto recuperado de la Knowledge Base. Si la información necesaria no está disponible en el contexto, indica claramente que no cuentas con esa información y sugiere contactar a asistencia@empleoservicio.com. No inventes datos.
Si un dato del contexto está marcado con "⚠️ verificar", no lo presentes como un hecho confirmado.
Responde siempre en español, de forma clara, breve y amable.`;

const ROLE_INSTRUCTIONS: Record<ChatRole, string> = {
  candidate:
    "El usuario es un candidato que busca información sobre empleos, postulaciones, su perfil y el uso de la plataforma. Responde desde la perspectiva de ayuda para candidatos.",
  company:
    "El usuario representa una empresa y busca información sobre publicación de vacantes, candidatos y servicios de la plataforma. Responde desde la perspectiva de ayuda para empresas.",
  anonymous:
    "El usuario no está autenticado. Responde utilizando la información pública disponible, sin asumir si es candidato o empresa.",
};

function buildUserPrompt(
  message: string,
  results: { title: string; content: string }[],
): string {
  if (results.length === 0) {
    return `Pregunta del usuario: ${message}\n\nContexto recuperado de la Knowledge Base: (sin resultados relevantes)`;
  }

  const context = results
    .map((result, index) => `[${index + 1}] ${result.title}\n${result.content}`)
    .join("\n\n---\n\n");

  return `Pregunta del usuario: ${message}\n\nContexto recuperado de la Knowledge Base:\n\n${context}`;
}

/**
 * Cache LRU de embeddings de preguntas: las preguntas repetidas (muy comunes en
 * un asistente de soporte) se ahorran la llamada a OpenAI.
 */
const QUESTION_EMBEDDING_CACHE_SIZE = 1000;
const questionEmbeddingCache = new Map<string, Float32Array>();

function embeddingCacheKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Embeddings de varios textos, pidiendo a OpenAI solo los que no están en cache y en una sola llamada. */
async function getQuestionEmbeddings(texts: string[]): Promise<Float32Array[]> {
  const keys = texts.map(embeddingCacheKey);
  const missingKeys = [...new Set(keys.filter((key) => !questionEmbeddingCache.has(key)))];

  if (missingKeys.length > 0) {
    const vectors = await createEmbeddings(missingKeys);
    missingKeys.forEach((key, index) => questionEmbeddingCache.set(key, normalizeEmbedding(vectors[index])));
  }

  const embeddings = keys.map((key) => {
    const embedding = questionEmbeddingCache.get(key)!;
    // Reinsertar la mueve al final (más reciente) del orden de inserción del Map.
    questionEmbeddingCache.delete(key);
    questionEmbeddingCache.set(key, embedding);
    return embedding;
  });

  while (questionEmbeddingCache.size > QUESTION_EMBEDDING_CACHE_SIZE) {
    questionEmbeddingCache.delete(questionEmbeddingCache.keys().next().value!);
  }

  return embeddings;
}

const TOP_K = 4;

/**
 * Busca con la pregunta sola y, si hay historial, también con la pregunta
 * anterior + la actual. Así una pregunta de seguimiento ("¿y cómo la
 * reactivo?") encuentra los documentos del tema que se venía hablando, sin
 * perder resultados si el usuario cambió de tema. Por cada chunk queda el
 * mejor puntaje de las dos búsquedas.
 */
async function retrieve(message: string, history: ChatTurn[], context: ChatContext, prioritySources: string[]): Promise<KbSearchResult[]> {
  const previousQuestion = [...history].reverse().find((turn) => turn.role === "user")?.content;
  const queries = previousQuestion ? [message, `${previousQuestion}\n${message}`] : [message];
  const embeddings = await getQuestionEmbeddings(queries);

  const best = new Map<string, KbSearchResult>();
  for (const embedding of embeddings) {
    for (const result of searchKnowledgeBase(embedding, context.role, { prioritySources })) {
      const current = best.get(result.id);
      if (!current || result.score > current.score) best.set(result.id, result);
    }
  }

  return [...best.values()].sort((a, b) => b.score - a.score).slice(0, TOP_K);
}

interface PreparedPrompt {
  contentSystem: string;
  contentUser: string;
  history: ChatTurn[];
  results: KbSearchResult[];
  retrievalMs: number;
}

async function preparePrompt(message: string, context: ChatContext, sessionId: string | undefined): Promise<PreparedPrompt> {
  const startedAt = Date.now();
  const { role } = context;
  const page = extractPageContext(context);
  const history = getHistory(sessionId, context);

  const results = await retrieve(message, history, context, getPrioritySources(page));

  const pageInstruction = buildPageContextInstruction(page, role === "anonymous");
  const contentSystem = [BASE_INSTRUCTION, ROLE_INSTRUCTIONS[role], pageInstruction]
    .filter(Boolean)
    .join("\n\n");

  return {
    contentSystem,
    contentUser: buildUserPrompt(message, results),
    history,
    results,
    retrievalMs: Date.now() - startedAt,
  };
}

function toSources(results: KbSearchResult[]): ChatSource[] {
  return results.map(({ id, title }) => ({ id, title }));
}

export async function answerQuestion(
  message: string,
  context: ChatContext,
  sessionId?: string,
): Promise<ChatResponse> {
  const { contentSystem, contentUser, history, results, retrievalMs } = await preparePrompt(message, context, sessionId);

  const generationStartedAt = Date.now();
  const reply = await createChatCompletion(contentSystem, contentUser, history);
  console.log(`/chat retrieval=${retrievalMs}ms generación=${Date.now() - generationStartedAt}ms historial=${history.length}`);

  appendTurn(sessionId, context, message, reply);
  return { reply, sources: toSources(results) };
}

export type ChatStreamEvent =
  | { type: "sources"; sources: ChatSource[] }
  | { type: "delta"; text: string };

/**
 * Variante en streaming: primero emite las fuentes y luego el texto a medida
 * que el modelo lo genera, para que el usuario empiece a leer de inmediato.
 * El turno se guarda en el historial solo si la respuesta se completó.
 */
export async function* streamAnswer(
  message: string,
  context: ChatContext,
  sessionId?: string,
): AsyncGenerator<ChatStreamEvent> {
  const { contentSystem, contentUser, history, results, retrievalMs } = await preparePrompt(message, context, sessionId);
  yield { type: "sources", sources: toSources(results) };

  const generationStartedAt = Date.now();
  let firstTokenMs: number | null = null;
  let reply = "";

  for await (const text of streamChatCompletion(contentSystem, contentUser, history)) {
    firstTokenMs ??= Date.now() - generationStartedAt;
    reply += text;
    yield { type: "delta", text };
  }

  appendTurn(sessionId, context, message, reply);
  console.log(
    `/chat/stream retrieval=${retrievalMs}ms primer-token=${firstTokenMs ?? "-"}ms generación=${Date.now() - generationStartedAt}ms historial=${history.length}`,
  );
}

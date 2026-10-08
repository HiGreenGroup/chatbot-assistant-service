import { createChatCompletion, createEmbedding } from "./openai-client";
import { searchKnowledgeBase } from "./knowledge-base";
import { buildPageContextInstruction, extractPageContext, getPrioritySources } from "./page-context";
import { ChatContext, ChatResponse, ChatRole } from "./types";

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

export async function answerQuestion(
  message: string,
  context: ChatContext,
): Promise<ChatResponse> {
  const { role } = context;
  const page = extractPageContext(context);

  const questionEmbedding = await createEmbedding(message);
  const results = searchKnowledgeBase(questionEmbedding, role, {
    prioritySources: getPrioritySources(page),
  });

  const pageInstruction = buildPageContextInstruction(page, role === "anonymous");
  const contentSystem = [BASE_INSTRUCTION, ROLE_INSTRUCTIONS[role], pageInstruction]
    .filter(Boolean)
    .join("\n\n");
  const contentUser = buildUserPrompt(message, results);

  const reply = await createChatCompletion(contentSystem, contentUser);

  return {
    reply,
    sources: results.map(({ id, title }) => ({ id, title })),
  };
}


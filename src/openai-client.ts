import OpenAI from "openai";
import { config } from "./config";
import { ChatTurn } from "./session-store";

interface ClientEntry {
    label: string;
    client: OpenAI;
}

const clients: ClientEntry[] = [{ label: "principal", client: new OpenAI({ apiKey: config.openaiApiKey }) }];

if (config.openaiApiKeyFallback && config.openaiApiKeyFallback !== config.openaiApiKey) {
    clients.push({ label: "fallback", client: new OpenAI({ apiKey: config.openaiApiKeyFallback }) });
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function shouldTryFallback(error: unknown): boolean {
    if (error instanceof OpenAI.APIError) {
        if (error.status === 401 || error.status === 402 || error.status === 403 || error.status === 429) {
            return true;
        }
        const code = String(error.code ?? "").toLowerCase();
        if (code.includes("insufficient_quota") || code.includes("billing") || code.includes("rate_limit") || code.includes("quota")) {
            return true;
        }
    }
    if (error instanceof OpenAI.APIConnectionError || error instanceof OpenAI.InternalServerError) {
        return true;
    }
    return false;
}

async function executeWithFallback<T>(operation: (client: OpenAI) => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let index = 0; index < clients.length; index++) {
        const { client } = clients[index];
        try {
            return await operation(client);
        } catch (error) {
            lastError = error;
            const hasFallback = index < clients.length - 1;
            if (!hasFallback || !shouldTryFallback(error)) {
                throw error;
            }
        }
    }

    throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** Genera embeddings para varios textos en una sola llamada (la API acepta hasta 2048 entradas). */
export async function createEmbeddings(texts: string[]): Promise<number[][]> {
    try {
        const response = await executeWithFallback((client) =>
            client.embeddings.create({ model: config.embeddingModel, input: texts }),
        );
        return response.data.sort((a, b) => a.index - b.index).map((item) => item.embedding);
    } catch (error) {
        throw new Error(`Error al generar embeddings: ${getErrorMessage(error)}`);
    }
}

const CHAT_PARAMS = {
    temperature: 0.2,
    max_tokens: 700,
};

function buildMessages(contentSystem: string, contentUser: string, history: ChatTurn[]) {
    return [
        { role: "system" as const, content: contentSystem },
        // Turnos anteriores de la conversación, sin el contexto de la KB que se usó en cada uno.
        ...history.map((turn) => ({ role: turn.role, content: turn.content })),
        { role: "user" as const, content: contentUser },
    ];
}

/**
 * Igual que createChatCompletion pero entrega el texto a medida que se genera.
 * El fallback de clave solo aplica al abrir el stream: si falla a mitad de
 * respuesta ya se enviaron fragmentos al usuario y no se reintenta.
 */
export async function* streamChatCompletion(contentSystem: string, contentUser: string, history: ChatTurn[] = []): AsyncGenerator<string> {
    let stream;
    try {
        stream = await executeWithFallback((client) =>
            client.chat.completions.create({
                model: config.chatModel,
                messages: buildMessages(contentSystem, contentUser, history),
                ...CHAT_PARAMS,
                stream: true,
            }),
        );
    } catch (error) {
        throw new Error(`Error en la generación de respuesta de chat: ${getErrorMessage(error)}`);
    }

    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) yield delta;
    }
}

export async function createChatCompletion(contentSystem: string, contentUser: string, history: ChatTurn[] = []): Promise<string> {
    try {
        const completion = await executeWithFallback((client) =>
            client.chat.completions.create({
                model: config.chatModel,
                messages: buildMessages(contentSystem, contentUser, history),
                ...CHAT_PARAMS,
            }),
        );

        const choice = completion.choices[0];
        const text = choice?.message?.content;

        if (!text?.trim()) {
            throw new Error(`OpenAI devolvió una respuesta vacía (finish_reason=${choice?.finish_reason ?? "desconocido"})`);
        }

        return text.trim();
    } catch (error) {
        throw new Error(`Error en la generación de respuesta de chat: ${getErrorMessage(error)}`);
    }
}

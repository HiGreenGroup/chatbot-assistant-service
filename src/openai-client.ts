import OpenAI from "openai";
import { config } from "./config";

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

export async function createEmbedding(text: string): Promise<number[]> {
    try {
        const response = await executeWithFallback((client) =>
            client.embeddings.create({ model: config.embeddingModel, input: text }),
        );
        return response.data[0].embedding;
    } catch (error) {
        throw new Error(`Error al generar embedding: ${getErrorMessage(error)}`);
    }
}

export async function createChatCompletion(contentSystem: string, contentUser: string): Promise<string> {
    try {
        const completion = await executeWithFallback((client) =>
            client.chat.completions.create({
                model: config.chatModel,
                messages: [
                    { role: "system", content: contentSystem },
                    { role: "user", content: contentUser },
                ],
                temperature: 0.2,
                max_tokens: 700,
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

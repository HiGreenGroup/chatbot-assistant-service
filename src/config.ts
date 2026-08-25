import "dotenv/config";

function parseOrigins(raw: string | undefined): string[] {
    if (!raw) {
        return ["http://localhost:3000", "http://localhost:3001"];
    }
    return raw.split(",").map((origin) => origin.trim()).filter(Boolean);
}

export const config = {
    port: Number(process.env.PORT ?? 4011),
    openaiApiKey: process.env.OPENAI_API_KEY?.trim(),
    openaiApiKeyFallback: process.env.OPENAI_API_KEY_FALLBACK?.trim(),
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
    chatModel: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
    allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
};

if (!config.openaiApiKey) {
    throw new Error("Falta la variable de entorno OPENAI_API_KEY");
}

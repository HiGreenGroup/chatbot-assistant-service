import { z } from "zod";

export const CHAT_ROLES = ["candidate", "company", "anonymous"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

/**
 * Campo de contexto opcional y tolerante: si llega con un tipo inválido se
 * descarta (undefined) en vez de rechazar el request, para que un cambio en el
 * frontend nunca rompa el chat.
 */
const optionalContextString = z.string().nullish().catch(undefined);

export const ChatRequestSchema = z.object({
    message: z.string().trim().min(1, "message no puede estar vacío"),
    // Tolerante: un sessionId inválido solo desactiva el historial, no rechaza el mensaje.
    sessionId: z.string().trim().min(1).max(128).optional().catch(undefined),
    context: z.object({
        role: z.enum(CHAT_ROLES),
        userId: optionalContextString,
        pathname: optionalContextString,
        pageLabel: optionalContextString,
        jobId: optionalContextString,
        candidateId: optionalContextString,
    }),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatContext = ChatRequest["context"];

export interface ChatSource {
    id: string;
    title: string;
}

export interface ChatResponse {
    reply: string;
    sources: ChatSource[];
}

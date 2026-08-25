import { z } from "zod";

export const CHAT_ROLES = ["candidate", "company", "anonymous"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

export const ChatRequestSchema = z.object({
    message: z.string().trim().min(1, "message no puede estar vacío"),
    sessionId: z.string().optional(),
    context: z.object({
        role: z.enum(CHAT_ROLES),
        userId: z.string().optional(),
    }),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export interface ChatSource {
    id: string;
    title: string;
}

export interface ChatResponse {
    reply: string;
    sources: ChatSource[];
}

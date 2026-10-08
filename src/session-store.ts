import { ChatContext } from "./types";

/**
 * Historial de conversación en memoria, por sessionId. Se pierde al reiniciar
 * el servicio (en un deploy las conversaciones abiertas empiezan de cero, lo
 * cual es aceptable para un asistente de ayuda).
 */
export interface ChatTurn {
    role: "user" | "assistant";
    content: string;
}

interface Session {
    /** Dueño de la sesión: si cambia el rol o el usuario, el historial se descarta. */
    owner: string;
    turns: ChatTurn[];
    lastActivity: number;
}

/** Turnos guardados por sesión (5 preguntas + 5 respuestas). */
const MAX_TURNS = 10;
/** Las respuestas largas se recortan al guardarlas, para acotar los tokens de cada request. */
const MAX_ASSISTANT_CHARS = 1500;
const SESSION_TTL_MS = 30 * 60 * 1000;
/** Tope de sesiones en memoria; al superarlo se descarta la de actividad más antigua. */
const MAX_SESSIONS = 10_000;

const sessions = new Map<string, Session>();

function ownerOf(context: ChatContext): string {
    return `${context.role}:${context.userId ?? ""}`;
}

export function getHistory(sessionId: string | undefined, context: ChatContext): ChatTurn[] {
    if (!sessionId) return [];

    const session = sessions.get(sessionId);
    if (!session) return [];

    if (Date.now() - session.lastActivity > SESSION_TTL_MS || session.owner !== ownerOf(context)) {
        sessions.delete(sessionId);
        return [];
    }

    // Copia: quien lo usa no debe ver los turnos que se agreguen después.
    return [...session.turns];
}

export function appendTurn(sessionId: string | undefined, context: ChatContext, question: string, answer: string): void {
    if (!sessionId) return;

    const owner = ownerOf(context);
    const existing = sessions.get(sessionId);
    const previous = existing && existing.owner === owner && Date.now() - existing.lastActivity <= SESSION_TTL_MS ? existing.turns : [];

    const trimmedAnswer = answer.length > MAX_ASSISTANT_CHARS ? `${answer.slice(0, MAX_ASSISTANT_CHARS)}…` : answer;
    const turns = [...previous, { role: "user" as const, content: question }, { role: "assistant" as const, content: trimmedAnswer }];

    // Reinsertar mueve la sesión al final del Map (más reciente), así el primero es siempre el más antiguo.
    sessions.delete(sessionId);
    sessions.set(sessionId, { owner, turns: turns.slice(-MAX_TURNS), lastActivity: Date.now() });

    if (sessions.size > MAX_SESSIONS) {
        sessions.delete(sessions.keys().next().value!);
    }
}

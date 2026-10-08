import { ChatContext } from "./types";

/**
 * Contexto de pantalla que manda el widget del frontend (ver
 * integracion-asistente-contexto-pagina.md). Todos los valores vienen del
 * navegador sin firmar: se usan solo como pista para el prompt y el retrieval,
 * nunca para autorizar nada.
 */
export interface PageContext {
    pathname?: string;
    pageLabel?: string;
    jobId?: string;
    candidateId?: string;
}

const MAX_LABEL_LENGTH = 120;
const MAX_PATHNAME_LENGTH = 200;
const MAX_ID_LENGTH = 64;

/**
 * Documentos de la KB (nombre de archivo sin .md) que se priorizan según la
 * ruta actual. Se mapea por `pathname` y no por `pageLabel` porque la ruta
 * siempre viene y no depende de cómo se redacte la etiqueta. Rutas que no
 * coinciden con ningún patrón simplemente no priorizan nada.
 */
const PAGE_DOC_PATTERNS: { pattern: RegExp; sources: string[] }[] = [
    { pattern: /^\/company\/jobs\/[^/]+\/manage$/, sources: ["05-gestionar-candidatos", "04-gestionar-vacantes"] },
    { pattern: /^\/company\/jobs\/[^/]+\/tests$/, sources: ["06-tests-ia"] },
    { pattern: /^\/company\/jobs(\/[^/]+(\/(edit|detail))?)?$/, sources: ["04-gestionar-vacantes"] },
    { pattern: /^\/company\/publish$/, sources: ["03-publicar-vacante"] },
    { pattern: /^\/company\/candidates\/[^/]+\/tests$/, sources: ["06-tests-ia"] },
    { pattern: /^\/company\/candidates\/compare$/, sources: ["05-gestionar-candidatos", "06-tests-ia"] },
    { pattern: /^\/company\/candidates\/[^/]+$/, sources: ["05-gestionar-candidatos"] },
    { pattern: /^\/company\/tests$/, sources: ["06-tests-ia"] },
    { pattern: /^\/company\/(plans|check-out)$/, sources: ["02-planes-y-precios"] },
    { pattern: /^\/company(\/(profile|employees))?$/, sources: ["01-registro-y-onboarding"] },
    { pattern: /^\/user(\/.*)?$/, sources: ["candidatos"] },
];

/** Normaliza un string del contexto: una sola línea, sin espacios extra y con largo acotado. */
function sanitize(value: string | null | undefined, maxLength: number): string | undefined {
    if (!value) return undefined;
    const clean = value.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
    return clean ? clean.slice(0, maxLength) : undefined;
}

export function extractPageContext(context: ChatContext): PageContext {
    return {
        pathname: sanitize(context.pathname, MAX_PATHNAME_LENGTH),
        pageLabel: sanitize(context.pageLabel, MAX_LABEL_LENGTH),
        jobId: sanitize(context.jobId, MAX_ID_LENGTH),
        candidateId: sanitize(context.candidateId, MAX_ID_LENGTH),
    };
}

export function getPrioritySources(page: PageContext): string[] {
    if (!page.pathname) return [];
    const path = page.pathname.replace(/\/+$/, "") || "/";
    return PAGE_DOC_PATTERNS.find(({ pattern }) => pattern.test(path))?.sources ?? [];
}

/**
 * Instrucción para el prompt de sistema describiendo en qué pantalla está el
 * usuario. Devuelve null si no hay contexto de pantalla (ruta no mapeada o
 * pathname null), en cuyo caso se responde igual que antes.
 */
export function buildPageContextInstruction(page: PageContext, isAnonymous: boolean): string | null {
    const screen = page.pageLabel ? `la pantalla "${page.pageLabel}"` : page.pathname ? `la ruta "${page.pathname}"` : null;
    if (!screen) return null;

    const entities: string[] = [];
    if (page.jobId) entities.push(isAnonymous ? `vacante pública id ${page.jobId}` : `vacante id ${page.jobId}`);
    if (page.candidateId) entities.push(`candidato id ${page.candidateId}`);
    const entityText = entities.length > 0 ? ` (${entities.join(", ")})` : "";

    const lines = [
        `Contexto de la conversación: el usuario está actualmente en ${screen}${entityText} de la plataforma.`,
        "Usa este contexto para interpretar referencias como \"esta vacante\", \"este candidato\" o \"esta página\" sin pedirle al usuario que repita dónde está.",
    ];

    if (entities.length > 0) {
        lines.push(
            "No tienes acceso a los datos reales de esa vacante o candidato (estado, postulantes, resultados): explica los pasos generales según la Knowledge Base y no inventes detalles específicos. No menciones los IDs internos al usuario.",
        );
    }

    return lines.join("\n");
}

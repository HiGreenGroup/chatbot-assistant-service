import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createEmbedding } from "./openai-client";
import { ChatRole } from "./types";

interface KbChunk {
    id: string;
    title: string;
    content: string;
    role: ChatRole | "all";
    /** Nombre del archivo de origen sin extensión, ej. "04-gestionar-vacantes". */
    source: string;
    hash: string;
}

interface KbChunkWithEmbedding extends KbChunk {
    embedding: number[];
}

type EmbeddingsCache = Record<string, { hash: string; embedding: number[] }>;

export interface KbSearchResult {
    id: string;
    title: string;
    content: string;
    score: number;
}

const KB_DIR = path.join(process.cwd(), "knowledge-base");
const CACHE_FILE = path.join(KB_DIR, ".cache", "embeddings.json");

const FILE_ROLE_MAP: Record<string, KbChunk["role"]> = {
    "general.md": "all",
    "candidatos.md": "candidate",
    "empresas.md": "company",
    "01-registro-y-onboarding.md": "company",
    "02-planes-y-precios.md": "company",
    "03-publicar-vacante.md": "company",
    "04-gestionar-vacantes.md": "company",
    "05-gestionar-candidatos.md": "company",
    "06-tests-ia.md": "company",
    "07-preguntas-frecuentes.md": "company",
    "README.md": "company",
};

const SIMILARITY_THRESHOLD = 0.15;

/** Bonus de similitud para chunks de los documentos relevantes a la pantalla actual. */
const PRIORITY_SOURCE_BOOST = 0.08;

let chunks: KbChunkWithEmbedding[] = [];

interface RawSection {
    title: string;
    content: string;
}

/**
 * Divide un markdown en secciones. Usa los encabezados `##`; el texto entre el
 * `#` principal y el primer `##` (ej. una tabla de precios) se conserva como
 * sección propia. Si el archivo no tiene `##` pero sí preguntas en negrita
 * (formato FAQ: una línea `**¿...?**` seguida de la respuesta), divide por pregunta.
 */
function splitSections(raw: string): RawSection[] {
    const docTitle = raw.match(/^#\s+(.+)$/m)?.[1].trim();
    const body = raw.replace(/^#\s+.+$/m, "");

    if (/^##\s+/m.test(body)) {
        const [preamble, ...sections] = body.split(/\n(?=##\s+)/g);
        const result: RawSection[] = [];

        if (docTitle && preamble.trim()) {
            result.push({ title: docTitle, content: `# ${docTitle}\n\n${preamble.trim()}` });
        }

        for (const section of sections) {
            const title = section.match(/^##\s+(.+)$/m)?.[1].trim() ?? section.slice(0, 40).trim();
            result.push({ title, content: section.trim() });
        }

        return result;
    }

    const questions = body.split(/\n(?=\*\*[^\n]+\*\*\s*\n)/g).filter((part) => part.trim().startsWith("**"));
    if (questions.length > 0) {
        return questions.map((part) => ({
            title: part.trim().match(/^\*\*(.+?)\*\*/)?.[1].trim() ?? part.slice(0, 40).trim(),
            content: part.trim(),
        }));
    }

    return docTitle && body.trim() ? [{ title: docTitle, content: raw.trim() }] : [];
}

function parseMarkdown(fileName: string, role: KbChunk["role"], raw: string): KbChunk[] {
    const baseId = fileName.replace(/\.md$/, "");

    return splitSections(raw).map(({ title, content }) => {
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        return {
            id: `${baseId}-${slug}`,
            title,
            content,
            role,
            source: baseId,
            hash: crypto.createHash("sha256").update(content).digest("hex"),
        };
    });
}

function loadChunksFromDisk(): KbChunk[] {
    if (!fs.existsSync(KB_DIR)) {
        throw new Error(`No se encontró el directorio de knowledge base: ${KB_DIR}`);
    }

    const files = fs.readdirSync(KB_DIR).filter((file) => file.endsWith(".md"));
    const parsed: KbChunk[] = [];

    for (const file of files) {
        const role = FILE_ROLE_MAP[file] ?? "all";
        const raw = fs.readFileSync(path.join(KB_DIR, file), "utf-8");
        parsed.push(...parseMarkdown(file, role, raw));
    }

    return parsed;
}

function readCache(): EmbeddingsCache {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        }
    } catch (error) {
        console.warn(`No se pudo leer el cache de embeddings: ${(error as Error).message}`);
    }
    return {};
}

function writeCache(cache: EmbeddingsCache): void {
    try {
        fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf-8");
    } catch (error) {
        console.warn(`No se pudo escribir el cache de embeddings: ${(error as Error).message}`);
    }
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function initKnowledgeBase(): Promise<void> {
    const parsedChunks = loadChunksFromDisk();
    const cache = readCache();
    let cacheDirty = false;
    const embedded: KbChunkWithEmbedding[] = [];

    for (const chunk of parsedChunks) {
        const cached = cache[chunk.id];

        if (cached && cached.hash === chunk.hash) {
            embedded.push({ ...chunk, embedding: cached.embedding });
            continue;
        }

        const embedding = await createEmbedding(`${chunk.title}\n${chunk.content}`);
        embedded.push({ ...chunk, embedding });
        cache[chunk.id] = { hash: chunk.hash, embedding };
        cacheDirty = true;
    }

    chunks = embedded;

    if (cacheDirty) {
        writeCache(cache);
    }

    console.log(`Knowledge base cargada: ${chunks.length} chunks`);
}

export interface KbSearchOptions {
    topK?: number;
    /** Documentos (nombre sin .md) a priorizar, ej. según la pantalla en la que está el usuario. */
    prioritySources?: string[];
}

export function searchKnowledgeBase(queryEmbedding: number[], role: ChatRole, options: KbSearchOptions = {}): KbSearchResult[] {
    const { topK = 4, prioritySources = [] } = options;
    const priority = new Set(prioritySources);
    const candidates = chunks.filter((chunk) => role === "anonymous" || chunk.role === "all" || chunk.role === role);

    return candidates
        .map((chunk) => {
            const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
            return {
                id: chunk.id,
                title: chunk.title,
                content: chunk.content,
                similarity,
                score: priority.has(chunk.source) ? similarity + PRIORITY_SOURCE_BOOST : similarity,
            };
        })
        // El umbral se aplica a la similitud real, para que el bonus no cuele chunks irrelevantes.
        .filter((result) => result.similarity >= SIMILARITY_THRESHOLD)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(({ similarity: _similarity, ...result }) => result);
}

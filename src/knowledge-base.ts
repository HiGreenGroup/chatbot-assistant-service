import crypto from "crypto";
import fs from "fs";
import path from "path";
import { config } from "./config";
import { createEmbeddings } from "./openai-client";
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
    /** Embedding normalizado (norma 1): la similitud coseno se reduce a un producto punto. */
    embedding: Float32Array;
}

/**
 * Cache en disco de embeddings por chunk. Se guardan como Float32 en base64
 * (~4x más chico que JSON numérico) y se invalidan si cambia el modelo.
 */
interface EmbeddingsCache {
    version: 2;
    model: string;
    entries: Record<string, { hash: string; embedding: string }>;
}

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
    "08-panel-y-navegacion.md": "company",
    "09-match-score.md": "company",
    "10-entrevistas-y-calendario.md": "company",
    "11-emails-y-notificaciones.md": "company",
    "12-reportes-y-exportacion.md": "company",
    "13-equipo-y-permisos.md": "company",
    "14-integraciones.md": "company",
    "15-seguridad-y-privacidad.md": "company",
    "16-contratacion-masiva-y-ferias.md": "company",
    "17-soporte-y-ayuda.md": "company",
    "README.md": "company",
};

const SIMILARITY_THRESHOLD = 0.15;

/** Bonus de similitud para chunks de los documentos relevantes a la pantalla actual. */
const PRIORITY_SOURCE_BOOST = 0.08;

/** Chunks por llamada al generar embeddings en el arranque. */
const EMBEDDING_BATCH_SIZE = 100;

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

function emptyCache(): EmbeddingsCache {
    return { version: 2, model: config.embeddingModel, entries: {} };
}

function readCache(): EmbeddingsCache {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const parsed = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
            // Formatos anteriores o de otro modelo de embeddings se descartan y se regeneran.
            if (parsed?.version === 2 && parsed.model === config.embeddingModel) {
                return parsed as EmbeddingsCache;
            }
        }
    } catch (error) {
        console.warn(`No se pudo leer el cache de embeddings: ${(error as Error).message}`);
    }
    return emptyCache();
}

function writeCache(cache: EmbeddingsCache): void {
    try {
        fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf-8");
    } catch (error) {
        console.warn(`No se pudo escribir el cache de embeddings: ${(error as Error).message}`);
    }
}

function encodeEmbedding(vector: Float32Array): string {
    return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength).toString("base64");
}

function decodeEmbedding(encoded: string): Float32Array {
    const buffer = Buffer.from(encoded, "base64");
    // Copia a un ArrayBuffer propio: el de Buffer puede no estar alineado a 4 bytes.
    return new Float32Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
}

export function normalizeEmbedding(vector: ArrayLike<number>): Float32Array {
    const normalized = Float32Array.from(vector);
    let norm = 0;
    for (let i = 0; i < normalized.length; i++) norm += normalized[i] * normalized[i];
    norm = Math.sqrt(norm);
    if (norm > 0) {
        for (let i = 0; i < normalized.length; i++) normalized[i] /= norm;
    }
    return normalized;
}

function dot(a: Float32Array, b: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
}

export async function initKnowledgeBase(): Promise<void> {
    const parsedChunks = loadChunksFromDisk();
    const cache = readCache();
    const nextCache = emptyCache();
    const embeddings = new Map<string, Float32Array>();
    const missing: KbChunk[] = [];

    for (const chunk of parsedChunks) {
        const cached = cache.entries[chunk.id];
        if (cached && cached.hash === chunk.hash) {
            embeddings.set(chunk.id, decodeEmbedding(cached.embedding));
            nextCache.entries[chunk.id] = cached;
        } else {
            missing.push(chunk);
        }
    }

    for (let start = 0; start < missing.length; start += EMBEDDING_BATCH_SIZE) {
        const batch = missing.slice(start, start + EMBEDDING_BATCH_SIZE);
        const vectors = await createEmbeddings(batch.map((chunk) => `${chunk.title}\n${chunk.content}`));

        batch.forEach((chunk, index) => {
            const embedding = normalizeEmbedding(vectors[index]);
            embeddings.set(chunk.id, embedding);
            nextCache.entries[chunk.id] = { hash: chunk.hash, embedding: encodeEmbedding(embedding) };
        });

        console.log(`Embeddings generados: ${Math.min(start + EMBEDDING_BATCH_SIZE, missing.length)}/${missing.length}`);
    }

    chunks = parsedChunks.map((chunk) => ({ ...chunk, embedding: embeddings.get(chunk.id)! }));

    // Se reescribe si hubo chunks nuevos o si quedaron entradas de chunks que ya no existen.
    if (missing.length > 0 || Object.keys(cache.entries).length !== Object.keys(nextCache.entries).length) {
        writeCache(nextCache);
    }

    console.log(`Knowledge base cargada: ${chunks.length} chunks (${missing.length} embeddings nuevos)`);
}

export interface KbSearchOptions {
    topK?: number;
    /** Documentos (nombre sin .md) a priorizar, ej. según la pantalla en la que está el usuario. */
    prioritySources?: string[];
}

/** `queryEmbedding` debe venir normalizado (ver normalizeEmbedding). */
export function searchKnowledgeBase(queryEmbedding: Float32Array, role: ChatRole, options: KbSearchOptions = {}): KbSearchResult[] {
    const { topK = 4, prioritySources = [] } = options;
    const priority = new Set(prioritySources);
    const results: KbSearchResult[] = [];

    for (const chunk of chunks) {
        if (role !== "anonymous" && chunk.role !== "all" && chunk.role !== role) continue;

        const similarity = dot(queryEmbedding, chunk.embedding);
        // El umbral se aplica a la similitud real, para que el bonus no cuele chunks irrelevantes.
        if (similarity < SIMILARITY_THRESHOLD) continue;

        const score = priority.has(chunk.source) ? similarity + PRIORITY_SOURCE_BOOST : similarity;
        results.push({ id: chunk.id, title: chunk.title, content: chunk.content, score });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

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
};

const SIMILARITY_THRESHOLD = 0.15;

let chunks: KbChunkWithEmbedding[] = [];

function parseMarkdown(fileName: string, role: KbChunk["role"], raw: string): KbChunk[] {
    const sections = raw.split(/\n(?=##\s+)/g).filter((section) => section.trim().startsWith("##"));
    const baseId = fileName.replace(/\.md$/, "");

    return sections.map((section) => {
        const titleMatch = section.match(/^##\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : section.slice(0, 40).trim();
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const content = section.trim();

        return {
            id: `${baseId}-${slug}`,
            title,
            content,
            role,
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

export function searchKnowledgeBase(queryEmbedding: number[], role: ChatRole, topK = 4): KbSearchResult[] {
    const candidates = chunks.filter((chunk) => role === "anonymous" || chunk.role === "all" || chunk.role === role);

    return candidates
        .map((chunk) => ({
            id: chunk.id,
            title: chunk.title,
            content: chunk.content,
            score: cosineSimilarity(queryEmbedding, chunk.embedding),
        }))
        .filter((result) => result.score >= SIMILARITY_THRESHOLD)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

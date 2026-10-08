import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { config } from "./config";
import { initKnowledgeBase } from "./knowledge-base";
import { answerQuestion, streamAnswer } from "./chat-service";
import { ChatRequestSchema } from "./types";

async function main() {
    console.log("Cargando Knowledge Base y generando embeddings...");
    await initKnowledgeBase();

    const app = express();

    app.use(
        cors({
            origin: config.allowedOrigins,
            methods: ["GET", "POST"],
        }),
    );
    app.use(express.json({ limit: "1mb" }));

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.post("/chat", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = ChatRequestSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({ error: "Solicitud inválida", details: parsed.error.flatten() });
                return;
            }

            const { message, sessionId, context } = parsed.data;
            const result = await answerQuestion(message, context, sessionId);

            res.json(result);
        } catch (error) {
            next(error);
        }
    });

    // Misma entrada que /chat, pero responde con Server-Sent Events:
    // event "sources" ({ sources }), luego N eventos "delta" ({ text }), y al final "done" o "error".
    app.post("/chat/stream", async (req: Request, res: Response) => {
        const parsed = ChatRequestSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: "Solicitud inválida", details: parsed.error.flatten() });
            return;
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            // Evita que nginx acumule la respuesta en buffer y la entregue toda junta al final.
            "X-Accel-Buffering": "no",
        });

        let clientClosed = false;
        res.on("close", () => {
            clientClosed = true;
        });

        const send = (event: string, data: unknown) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        try {
            const { message, sessionId, context } = parsed.data;
            for await (const event of streamAnswer(message, context, sessionId)) {
                // Salir del for-await cierra el stream de OpenAI y deja de consumir tokens.
                if (clientClosed) break;
                if (event.type === "sources") send("sources", { sources: event.sources });
                else send("delta", { text: event.text });
            }
            if (!clientClosed) send("done", {});
        } catch (error) {
            console.error("Error procesando /chat/stream:", error);
            if (!clientClosed) send("error", { error: "Ocurrió un error al procesar la pregunta" });
        } finally {
            res.end();
        }
    });

    app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
        console.error("Error procesando /chat:", error);
        res.status(500).json({ error: "Ocurrió un error al procesar la pregunta" });
    });

    app.listen(config.port, () => {
        console.log(`chatbot-assistant-service escuchando en el puerto ${config.port}`);
    });
}

main().catch((error) => {
    console.error("Error al iniciar el servicio:", error);
    process.exit(1);
});

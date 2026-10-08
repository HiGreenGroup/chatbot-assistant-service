import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { config } from "./config";
import { initKnowledgeBase } from "./knowledge-base";
import { answerQuestion } from "./chat-service";
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

            const { message, context } = parsed.data;
            const result = await answerQuestion(message, context);

            res.json(result);
        } catch (error) {
            next(error);
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

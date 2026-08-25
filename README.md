# chatbot-assistant-service

Microservicio independiente: chatbot con RAG sobre una Knowledge Base en markdown, usando OpenAI. No depende de ningún otro microservicio de la plataforma EmpleoServicio; solo necesita una API key de OpenAI.

## Uso

```bash
npm install
cp .env.example .env   # completar OPENAI_API_KEY
npm run dev             # desarrollo (recarga automática)
npm run build && npm start   # producción
```

El servicio expone:

- `POST /chat` — recibe `{ message, sessionId?, context: { role, userId? } }` y responde `{ reply, sources }`. Ver el brief del proyecto para el contrato completo.
- `GET /health` — chequeo de salud.

## Knowledge Base

El contenido vive en `knowledge-base/*.md`. Cada archivo se asocia a un rol mediante `FILE_ROLE_MAP` en `src/knowledge-base.ts`:

- `general.md` → visible para todos los roles.
- `candidatos.md` → visible para `candidate` (y `anonymous`).
- `empresas.md` → visible para `company` (y `anonymous`).

Cada sección `## Encabezado` de un archivo se convierte en un chunk independiente que se embebe con OpenAI. Los embeddings se cachean en `knowledge-base/.cache/embeddings.json` (por hash de contenido), así que solo se recalculan los chunks que cambiaron. Para agregar o editar contenido, simplemente edita los `.md` y reinicia el servicio.

## Variables de entorno

Ver `.env.example`. `OPENAI_API_KEY` es obligatoria; el resto tiene valores por defecto razonables.

## Despliegue

Es un servicio Node/Express autocontenido — se puede desplegar en cualquier lugar (contenedor, PaaS, VM) de forma independiente al resto de los microservicios de EmpleoServicio. Configura `ALLOWED_ORIGINS` con el/los dominio(s) del frontend en producción.

En el frontend, apunta `NEXT_PUBLIC_ASSISTANT_API_URL` a la URL pública de este servicio.

### Docker

La imagen es multi-stage (`dockerfile`): compila TypeScript, instala solo dependencias de producción en la imagen final, corre como usuario no-root, y expone un healthcheck en `/health`.

```bash
docker build -t chatbot-assistant-service .
docker run -d --name chatbot-assistant-service --restart always \
  -p 4011:4011 \
  -e OPENAI_API_KEY=sk-... \
  -e ALLOWED_ORIGINS=https://empleoservicio.com \
  chatbot-assistant-service
```

### CI/CD con GitHub Actions

`.github/workflows/docker.yml` hace, en cada push/PR a `main` o `develop`:

1. **build** — instala dependencias, corre `npm run build` (valida que compile), y en push a `main`/`develop` construye y publica la imagen en GitHub Container Registry (`ghcr.io/<owner>/<repo>`), taggeada por rama, por SHA corto, y como `latest` solo en `main`. En Pull Requests solo construye (no publica), como validación de CI.
2. **deploy** — solo corre en push a `main`, y solo si el secreto `SSH_HOST` está configurado (si no, el job simplemente se salta, sin romper el pipeline). Se conecta por SSH al servidor y hace `docker pull` + `docker run` de la imagen `:latest`.

Para activar el paso de deploy, configura en **Settings → Secrets and variables → Actions** del repo:

**Secrets:**
- `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` — acceso SSH al servidor destino (`SSH_PORT` opcional, default 22).
- `OPENAI_API_KEY`, `OPENAI_API_KEY_FALLBACK` (opcional) — se inyectan como variables de entorno del contenedor en el servidor.

**Variables (opcionales, tienen default):**
- `CHATBOT_PORT` — puerto host/contenedor a usar (default `4011`).
- `ALLOWED_ORIGINS` — orígenes CORS permitidos en producción.

No hace falta configurar credenciales de registro: la publicación a GHCR usa el `GITHUB_TOKEN` que Actions provee automáticamente. El repo debe tener habilitado "Read and write permissions" para `GITHUB_TOKEN` en Settings → Actions → General (o dejar el `permissions: packages: write` del workflow, que ya lo declara a nivel de job).

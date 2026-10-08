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

- `POST /chat` — recibe `{ message, sessionId?, context: { role, userId?, pathname?, pageLabel?, jobId?, candidateId? } }` y responde `{ reply, sources }`. Los campos de pantalla se usan para dar contexto al modelo y priorizar documentos de la Knowledge Base (ver `Manual Integracion Pantalla EmpleoServicio.md` y `src/page-context.ts`).
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

### CI con GitHub Actions

`.github/workflows/docker.yml` hace, en cada push/PR a `main` o `develop`:

- Instala dependencias y corre `npm run build` (valida que compile).
- En push a `main`/`develop` (no en PRs), construye y publica la imagen en GitHub Container Registry: `ghcr.io/<owner>/<repo>` en minúsculas, taggeada por rama, por SHA corto, y como `latest` solo en `main`.

No hace falta configurar ningún secreto de registro: usa el `GITHUB_TOKEN` que Actions provee automáticamente (con `permissions: packages: write` a nivel de job). El repo debe tener habilitado "Read and write permissions" para `GITHUB_TOKEN` en Settings → Actions → General → Workflow permissions.

El despliegue en el servidor (`docker pull` + `docker compose up`) se hace manualmente — ver la sección de ambientes más abajo.

## Ambientes (local, beta, producción)

Cada ambiente tiene su propia instancia del chatbot, con su propio `ALLOWED_ORIGINS`:

| Ambiente | Imagen | Rama que la publica | Puerto (host) | Frontend permitido |
|---|---|---|---|---|
| Local | — (`npm run dev`) | — | 4011 | `http://localhost:3000`, `http://localhost:3001` |
| Beta | `ghcr.io/higreengroup/chatbot-assistant-service:develop` | `develop` | 4012 | dominio de beta |
| Producción | `ghcr.io/higreengroup/chatbot-assistant-service:main` | `main` | 4011 | dominio de producción |

En el frontend de cada ambiente, `NEXT_PUBLIC_ASSISTANT_API_URL` apunta a la URL pública del chatbot de ese mismo ambiente (en local: `http://localhost:4011`).

### Local

```bash
cp .env.example .env   # completar OPENAI_API_KEY
npm run dev
```

### Beta y producción

Cada ambiente es una carpeta en el servidor con una copia de `deploy/docker-compose.yml` y su propio `.env` al lado (plantilla en `deploy/.env.example`). Por ejemplo:

```
chatbot-beta/
  docker-compose.yml
  .env        # COMPOSE_PROJECT_NAME=chatbot-beta, IMAGE_TAG=develop, HOST_PORT=4012, ...
chatbot-prod/
  docker-compose.yml
  .env        # COMPOSE_PROJECT_NAME=chatbot-prod, IMAGE_TAG=main, HOST_PORT=4011, ...
```

Para desplegar o actualizar, desde la carpeta del ambiente:

```bash
docker compose pull && docker compose up -d
```

Docker Compose lee el `.env` automáticamente: lo usa para la imagen, el puerto y el nombre de proyecto, y lo pasa completo al contenedor. `COMPOSE_PROJECT_NAME` distinto por ambiente mantiene separados contenedores y volúmenes, así que ambos pueden correr en el mismo servidor. Si el paquete de GHCR es privado, antes hay que hacer `docker login ghcr.io` con un token con permiso `read:packages`. Los `.env` reales están en `.gitignore` y no se suben al repo.

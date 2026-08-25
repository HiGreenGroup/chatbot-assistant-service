# dockerfile

# ---- deps: install full deps once, cached by lockfile ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: compile TypeScript ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime: prod deps only + compiled output ----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY knowledge-base ./knowledge-base

# El servicio escribe el cache de embeddings en knowledge-base/.cache en tiempo de ejecución
RUN mkdir -p knowledge-base/.cache && chown -R app:app knowledge-base

USER app

EXPOSE 4011

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- "http://localhost:${PORT:-4011}/health" || exit 1

CMD ["node", "dist/index.js"]

# ── Stage 1: Builder ─────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY services/order-service/package*.json ./
RUN npm ci

COPY services/order-service/tsconfig.json ./
COPY services/order-service/src/ ./src/

RUN npm run build

# ── Stage 2: Production ──────────────────────────
FROM node:24-alpine AS production

WORKDIR /app

COPY services/order-service/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY proto/ ./proto/  

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 50052

CMD ["node", "dist/index.js"]
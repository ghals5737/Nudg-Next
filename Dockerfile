# syntax=docker/dockerfile:1.7

# ── 1) 의존성 설치 ──────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── 2) 빌드 ─────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 클라이언트는 코드 안에서 상대경로 /api 로 호출하도록 고정 — NEXT_PUBLIC_API_URL build-arg 불필요.
# 서버 전용 env(API_URL 등) 는 런타임에 컨테이너 env 로 주입.

RUN npm run build

# ── 3) 런타임 ───────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 비루트 사용자
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]

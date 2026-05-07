# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM cgr.dev/chainguard/node:latest-dev AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# ==========================================
# STAGE 2: Builder
# ==========================================
FROM cgr.dev/chainguard/node:latest-dev AS builder

WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_N8N_BASE_URL=https://n8n-hook.paxstecnologia.com
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=5531983625590
ARG NEXT_PUBLIC_WHATSAPP_SUPPORT=5511999999999
ARG NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_N8N_BASE_URL=$NEXT_PUBLIC_N8N_BASE_URL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_WHATSAPP_SUPPORT=$NEXT_PUBLIC_WHATSAPP_SUPPORT \
    NEXT_PUBLIC_SPLINE_SCENE_URL=$NEXT_PUBLIC_SPLINE_SCENE_URL \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

COPY package.json package-lock.json* ./
COPY next.config.js tsconfig.json ./
COPY postcss.config.mjs ./
COPY src ./src
COPY public ./public

RUN npm run build

# ==========================================
# STAGE 3: Runner (Produção)
# ==========================================
FROM cgr.dev/chainguard/node:latest AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["server.js"]

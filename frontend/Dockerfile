# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM cgr.dev/chainguard/node:latest-dev AS deps

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci && npm cache clean --force

# ==========================================
# STAGE 2: Builder
# ==========================================
FROM cgr.dev/chainguard/node:latest-dev AS builder

WORKDIR /app

# Build args - passados pelo EasyPanel (sem default = obrigatório passar)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_N8N_WEBHOOK_URL
ARG NEXT_PUBLIC_WEBHOOK_CONECTAR
ARG NEXT_PUBLIC_WEBHOOK_VERIFICAR
ARG NEXT_PUBLIC_WEBHOOK_DELETAR
ARG NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO
ARG NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS
ARG NEXT_PUBLIC_WEBHOOK_CADASTRO
# Variáveis com defaults estáveis (podem ser sobrescritas pelo EasyPanel)
ARG NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://nyrvyuaiqmhznvwmimpz.supabase.co/storage/v1/object/public
ARG NEXT_PUBLIC_LOGO_PATH=imagem/gerente%20(2).png
ARG NEXT_PUBLIC_N8N_BASE_URL=https://n8n-hook.paxstecnologia.com
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=5531983625590
ARG NEXT_PUBLIC_WHATSAPP_SUPPORT=5511999999999
ARG NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode

# Definir como ENV para o Next.js ter acesso durante o build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NEXT_PUBLIC_SUPABASE_STORAGE_URL=$NEXT_PUBLIC_SUPABASE_STORAGE_URL \
    NEXT_PUBLIC_LOGO_PATH=$NEXT_PUBLIC_LOGO_PATH \
    NEXT_PUBLIC_N8N_BASE_URL=$NEXT_PUBLIC_N8N_BASE_URL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_WHATSAPP_SUPPORT=$NEXT_PUBLIC_WHATSAPP_SUPPORT \
    NEXT_PUBLIC_SPLINE_SCENE_URL=$NEXT_PUBLIC_SPLINE_SCENE_URL \
    NEXT_PUBLIC_N8N_WEBHOOK_URL=$NEXT_PUBLIC_N8N_WEBHOOK_URL \
    NEXT_PUBLIC_WEBHOOK_CONECTAR=$NEXT_PUBLIC_WEBHOOK_CONECTAR \
    NEXT_PUBLIC_WEBHOOK_VERIFICAR=$NEXT_PUBLIC_WEBHOOK_VERIFICAR \
    NEXT_PUBLIC_WEBHOOK_DELETAR=$NEXT_PUBLIC_WEBHOOK_DELETAR \
    NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO=$NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO \
    NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS=$NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS \
    NEXT_PUBLIC_WEBHOOK_CADASTRO=$NEXT_PUBLIC_WEBHOOK_CADASTRO \
    NEXT_TELEMETRY_DISABLED=1

# Copiar dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivos de configuração
COPY package.json package-lock.json* ./
COPY next.config.js next.config.ts tsconfig.json ./
COPY postcss.config.mjs ./

# Copiar código fonte
COPY src ./src
COPY public ./public

# Build da aplicação
RUN npm run build

# ==========================================
# STAGE 3: Runner (Produção)
# ==========================================
FROM cgr.dev/chainguard/node:latest AS runner

WORKDIR /app

# Configurações de produção
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Variáveis públicas (NEXT_PUBLIC_ são baked no build, este bloco é apenas documentação)
ENV NEXT_PUBLIC_SUPABASE_URL="" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="" \
    NEXT_PUBLIC_SITE_URL="" \
    NEXT_PUBLIC_API_URL="" \
    NEXT_PUBLIC_BACKEND_URL="" \
    NEXT_PUBLIC_SUPABASE_STORAGE_URL="" \
    NEXT_PUBLIC_LOGO_PATH="" \
    NEXT_PUBLIC_N8N_BASE_URL="" \
    NEXT_PUBLIC_WHATSAPP_NUMBER="" \
    NEXT_PUBLIC_WHATSAPP_SUPPORT="" \
    NEXT_PUBLIC_SPLINE_SCENE_URL="" \
    NEXT_PUBLIC_N8N_WEBHOOK_URL="" \
    NEXT_PUBLIC_WEBHOOK_CONECTAR="" \
    NEXT_PUBLIC_WEBHOOK_VERIFICAR="" \
    NEXT_PUBLIC_WEBHOOK_DELETAR="" \
    NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO="" \
    NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS="" \
    NEXT_PUBLIC_WEBHOOK_CADASTRO=""

# Criar usuário não-root para segurança (Chainguard já roda como non-root)
# Copiar apenas os arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Iniciar aplicação Next.js (Chainguard já tem ENTRYPOINT=node)
CMD ["server.js"]

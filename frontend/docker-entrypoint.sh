#!/bin/sh
set -e

# Script para injetar variáveis de ambiente em runtime no Next.js standalone

echo "🚀 Iniciando aplicação Next.js..."
echo "📝 Configurando variáveis de ambiente..."

# Exportar variáveis de ambiente para o processo Node.js
export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

# Variáveis do Supabase
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"

# Variáveis de URL
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}"

# Variáveis de Webhook
export NEXT_PUBLIC_N8N_WEBHOOK_URL="${NEXT_PUBLIC_N8N_WEBHOOK_URL:-}"
export NEXT_PUBLIC_WEBHOOK_CONECTAR="${NEXT_PUBLIC_WEBHOOK_CONECTAR:-}"
export NEXT_PUBLIC_WEBHOOK_VERIFICAR="${NEXT_PUBLIC_WEBHOOK_VERIFICAR:-}"
export NEXT_PUBLIC_WEBHOOK_DELETAR="${NEXT_PUBLIC_WEBHOOK_DELETAR:-}"

echo "✅ Variáveis configuradas!"
echo "🌐 Servidor rodando em: http://${HOSTNAME}:${PORT}"

# Executar o servidor Next.js
exec node server.js

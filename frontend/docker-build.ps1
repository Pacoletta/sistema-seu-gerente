# ============================================
# Script para Build e Push do Docker
# Versão: Build-Time Environment Variables
# ============================================

# Configurações
$IMAGE_NAME = "pacoleta/saas-condominio"
$VERSION = "latest"
$PLATFORM = "linux/amd64"

Write-Host "🚀 Iniciando build da imagem Docker..." -ForegroundColor Cyan
Write-Host "📦 Imagem: $IMAGE_NAME:$VERSION" -ForegroundColor Yellow
Write-Host "🖥️  Plataforma: $PLATFORM" -ForegroundColor Yellow
Write-Host "⚙️  Modo: Build-Time Environment Variables" -ForegroundColor Yellow
Write-Host ""

# Carregar variáveis do .env
Write-Host "📄 Carregando variáveis do arquivo .env..." -ForegroundColor Cyan
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Build da imagem COM variáveis de ambiente
docker build `
  --platform $PLATFORM `
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL `
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY `
  --build-arg NEXT_PUBLIC_SITE_URL=$env:NEXT_PUBLIC_SITE_URL `
  --build-arg NEXT_PUBLIC_API_URL=$env:NEXT_PUBLIC_API_URL `
  --build-arg NEXT_PUBLIC_N8N_WEBHOOK_URL=$env:NEXT_PUBLIC_N8N_WEBHOOK_URL `
  --build-arg NEXT_PUBLIC_WEBHOOK_CONECTAR=$env:NEXT_PUBLIC_WEBHOOK_CONECTAR `
  --build-arg NEXT_PUBLIC_WEBHOOK_VERIFICAR=$env:NEXT_PUBLIC_WEBHOOK_VERIFICAR `
  --build-arg NEXT_PUBLIC_WEBHOOK_DELETAR=$env:NEXT_PUBLIC_WEBHOOK_DELETAR `
  --build-arg NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO=$env:NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO `
  --build-arg NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS=$env:NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS `
  --build-arg NEXT_PUBLIC_WEBHOOK_CADASTRO=$env:NEXT_PUBLIC_WEBHOOK_CADASTRO `
  -t ${IMAGE_NAME}:${VERSION} `
  -f Dockerfile `
  .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    # Perguntar se quer fazer push
    $push = Read-Host "Deseja fazer push para o Docker Hub? (s/n)"
    
    if ($push -eq "s" -or $push -eq "S") {
        Write-Host "🔐 Fazendo login no Docker Hub..." -ForegroundColor Cyan
        docker login
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "📤 Enviando imagem para o Docker Hub..." -ForegroundColor Cyan
            docker push ${IMAGE_NAME}:${VERSION}
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Push concluído! Imagem disponível em: ${IMAGE_NAME}:${VERSION}" -ForegroundColor Green
            } else {
                Write-Host "❌ Erro ao fazer push da imagem" -ForegroundColor Red
            }
        }
    }
    
    # Perguntar se quer testar localmente
    $test = Read-Host "Deseja testar a imagem localmente? (s/n)"
    
    if ($test -eq "s" -or $test -eq "S") {
        Write-Host "🧪 Iniciando container de teste..." -ForegroundColor Cyan
        Write-Host "⚠️  IMPORTANTE: Configure as variáveis de ambiente no Easypanel!" -ForegroundColor Yellow
        
        # Carregar variáveis do .env para teste local
        Get-Content .env | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
        
        docker run -d -p 3000:3000 `
          -e NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL `
          -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY `
          -e NEXT_PUBLIC_SITE_URL=$env:NEXT_PUBLIC_SITE_URL `
          -e NEXT_PUBLIC_API_URL=$env:NEXT_PUBLIC_API_URL `
          -e NEXT_PUBLIC_N8N_WEBHOOK_URL=$env:NEXT_PUBLIC_N8N_WEBHOOK_URL `
          -e NEXT_PUBLIC_WEBHOOK_CONECTAR=$env:NEXT_PUBLIC_WEBHOOK_CONECTAR `
          -e NEXT_PUBLIC_WEBHOOK_VERIFICAR=$env:NEXT_PUBLIC_WEBHOOK_VERIFICAR `
          -e NEXT_PUBLIC_WEBHOOK_DELETAR=$env:NEXT_PUBLIC_WEBHOOK_DELETAR `
          -e NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO=$env:NEXT_PUBLIC_WEBHOOK_CADASTRO_COMPLETO `
          -e NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS=$env:NEXT_PUBLIC_WEBHOOK_ENVIAR_TODOS `
          -e NEXT_PUBLIC_WEBHOOK_CADASTRO=$env:NEXT_PUBLIC_WEBHOOK_CADASTRO `
          --name seu-gerente-test ${IMAGE_NAME}:${VERSION}
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Container iniciado! Acesse: http://localhost:3000" -ForegroundColor Green
            Write-Host "📋 Para ver logs: docker logs -f seu-gerente-test" -ForegroundColor Yellow
            Write-Host "🛑 Para parar: docker stop seu-gerente-test && docker rm seu-gerente-test" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ Erro no build da imagem" -ForegroundColor Red
    exit 1
}

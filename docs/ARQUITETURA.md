# Arquitetura Backend — Sistema Seu Gerente

## Estrutura de Camadas

```
backend/
├── src/
│   ├── SeuGerente.Api/              # Camada de Apresentação (HTTP)
│   ├── SeuGerente.Application/      # Casos de Uso do Sistema
│   ├── SeuGerente.Domain/           # Regras de Negócio Puras
│   ├── SeuGerente.Infrastructure/   # Implementação Técnica
│   └── SeuGerente.Service/          # Background Jobs (Hangfire)
└── SeuGerente.sln
```

---

## Responsabilidades das Camadas

### SeuGerente.Api

**Propósito**: Entrada e saída HTTP

**Contém**:

- Controllers (Endpoints REST)
- Webhooks (Mercado Pago)
- Middlewares (Exceptions, CorrelationId)
- Configuração (Swagger, JWT, CORS, Hangfire)
- Program.cs (startup)

**Dependências**:

- SeuGerente.Application
- SeuGerente.Infrastructure
- SeuGerente.Service

**Não contém**:

- Regras de negócio
- Acesso direto ao banco
- Integrações externas

---

### SeuGerente.Application

**Propósito**: Orquestração dos casos de uso

**Contém**:

- DTOs (Data Transfer Objects)
- Interfaces de serviços (IAuthService, IMercadoPagoService, IWhatsAppService, IEmailService)
- Validadores (FluentValidation)
- Mapeamento manual de entidades para DTOs (sem AutoMapper)

**Dependências**:

- SeuGerente.Domain

**Não contém**:

- HttpClient
- DbContext
- Variáveis de ambiente
- Implementações concretas

---

### SeuGerente.Domain

**Propósito**: Core do negócio independente de tecnologia

**Contém**:

- Entidades (Cadastro, Morador, Pagamento, Despesa, Receita, Configuracao, Melhoria, Sugestao, Assinatura, Parceiro)
- Enums (StatusPagamento)
- Interfaces de repositórios (contratos)
- Domain Exceptions

**Dependências**:

- Nenhuma (camada mais interna)

**Não contém**:

- EF Core
- HttpClient
- IConfiguration
- Qualquer biblioteca externa

---

### SeuGerente.Infrastructure

**Propósito**: Implementação de serviços externos e persistência

**Contém**:

- DbContext (ApplicationDbContext)
- Migrations do EF Core
- Repositórios concretos
- Serviços externos:
  - MercadoPagoService (pagamentos PIX)
  - WhatsAppService (Evolution API)
  - EmailService (Resend.com)
  - OpenAiService (reconhecimento de despesas)
  - MinioStorageService (armazenamento de arquivos)
- AuthService e TokenService
- Configuração de DI (DependencyInjection.cs)

**Dependências**:

- SeuGerente.Application
- SeuGerente.Domain
- Entity Framework Core 8
- Npgsql (PostgreSQL)
- BCrypt.Net-Next
- Resend HTTP client

**Não contém**:

- Regras de negócio
- Jobs agendados (em SeuGerente.Service)

---

### SeuGerente.Service

**Propósito**: Processamento em background e jobs agendados

**Contém**:

- CobrancasJob (envio diário de cobranças às 9h — cron configurável)
- AtualizarVencidosJob (atualização de status de pagamentos)
- DependencyInjection.cs (registro dos jobs no Hangfire)

**Dependências**:

- SeuGerente.Application
- SeuGerente.Domain
- Hangfire.Core

**Não contém**:

- Controllers
- DbContext direto
- HttpClient direto

---

## Fluxo de Dados

```
HTTP Request
    ↓
Api (Controller)
    ↓
Application (Service / Caso de Uso)
    ↓
Infrastructure (Repositório / Serviço Externo)
    ↓
Database / API Externa
```

---

## Princípios Aplicados

### Clean Architecture

- Dependências apontam para dentro (Domain não conhece nada externo)
- Application define contratos (interfaces)
- Infrastructure implementa contratos
- Domain não depende de nenhuma camada

### SOLID

- **S**ingle Responsibility: cada camada tem uma responsabilidade
- **O**pen/Closed: extensível via interfaces
- **D**ependency Inversion: dependência de abstrações, não implementações

---

## Pacotes NuGet Principais

### SeuGerente.Api

- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Swashbuckle.AspNetCore`
- `Serilog.AspNetCore`
- `DotNetEnv`

### SeuGerente.Application

- `FluentValidation`

### SeuGerente.Infrastructure

- `Microsoft.EntityFrameworkCore` 8.x
- `Npgsql.EntityFrameworkCore.PostgreSQL`
- `Hangfire.PostgreSql`
- `BCrypt.Net-Next`
- `Minio`
- `QuestPDF`

### SeuGerente.Service

- `Hangfire.Core`

---

## Como Executar

### 1. Banco de dados local (Docker)

```bash
docker compose -f database/docker-compose.yml up -d
```

### 2. Aplicar migrations

```bash
cd backend/src/SeuGerente.Api
dotnet ef database update --project ../SeuGerente.Infrastructure
```

### 3. Executar API

```bash
cd backend/src/SeuGerente.Api
dotnet run
```

API disponível em `http://localhost:5000`  
Swagger em `http://localhost:5000/swagger`

---

## Observações

- **Sem AutoMapper**: todo mapeamento é manual (método `ToDto()` ou mapeamento inline nos services)
- **Sem Supabase**: auth, storage e banco são próprios (.NET + PostgreSQL + MinIO)
- **Email via Resend.com**: MailKit foi removido
- **Logs**: Serilog com saída para console e arquivo rotativo (`logs/`)
- **Config**: `GetConfigValue()` em Program.cs — lê appsettings → env var automática → env var alternativa

# Sistema Seu Gerente — Guia de Contexto para Claude

## Objetivo do Sistema

SaaS de gestão condominial. Síndicos e administradores de condomínio usam o sistema para gerenciar moradores, despesas, receitas, cobranças, relatórios e comunicação via WhatsApp/email.

---

## Stack Tecnológica

### Backend
- **Runtime**: .NET 8 / ASP.NET Core 8
- **Linguagem**: C#
- **ORM**: Entity Framework Core 8 + Npgsql (PostgreSQL)
- **Banco**: PostgreSQL 16 (local via Docker, produção via servidor dedicado)
- **Auth**: JWT próprio (HS256, BCrypt para senhas) — sem Supabase
- **Jobs**: Hangfire + Hangfire.PostgreSql
- **Email**: Resend.com (primário)
- **WhatsApp**: Evolution API (https://api.paxstecnologia.com)
- **Pagamentos**: Mercado Pago
- **IA**: OpenAI gpt-4 (reconhecimento de despesas por imagem)
- **PDF**: QuestPDF
- **Logs**: Serilog (console + arquivo rotativo)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19 + TypeScript
- **Estilo**: Tailwind CSS 4
- **Gráficos**: Recharts
- **Animações**: Framer Motion
- **HTTP**: Fetch nativo via `src/services/httpClient.ts`
- **Auth**: JWT em cookie `auth_token` (sem Supabase)

---

## Arquitetura do Backend — Clean Architecture

```
API → Application → Domain
Infrastructure → Application / Domain
```

### Camadas

| Camada | Projeto | Responsabilidade |
|--------|---------|-----------------|
| API | `SeuGerente.Api` | Controllers, Middlewares, Program.cs, Swagger |
| Application | `SeuGerente.Application` | Services, DTOs, Interfaces, Validators |
| Domain | `SeuGerente.Domain` | Entities, Enums, Interfaces de repositório |
| Infrastructure | `SeuGerente.Infrastructure` | DbContext, Repositories, Serviços externos, Auth |
| Service | `SeuGerente.Service` | Jobs Hangfire |

**Regra absoluta**: Domain não depende de ninguém. Controllers nunca acessam repositórios diretamente.

### Estrutura de pastas

```
backend/
└── src/
    ├── SeuGerente.Api/
    │   ├── Controllers/
    │   ├── Middlewares/
    │   └── Program.cs
    ├── SeuGerente.Application/
    │   ├── DTOs/
    │   ├── Interfaces/
    │   ├── Services/
    │   ├── Validators/
    │   └── Mappings/
    ├── SeuGerente.Domain/
    │   ├── Entities/
    │   ├── Enums/
    │   └── Interfaces/
    ├── SeuGerente.Infrastructure/
    │   ├── Auth/           ← AuthService, TokenService
    │   ├── Persistence/    ← ApplicationDbContext
    │   ├── Repositories/
    │   ├── ExternalServices/
    │   └── Migrations/
    └── SeuGerente.Service/
        └── Jobs/
```

---

## Padrões de Backend

### O que DEVE ser feito
- Mapeamento manual — **sem AutoMapper**
- Interfaces no Domain, implementações na Infrastructure
- EF Core com `IEntityTypeConfiguration<T>` (ainda em adoção)
- Queries read-only com `AsNoTracking()`
- FluentValidation para Commands/inputs
- Logs estruturados sem dados sensíveis
- Rate limiting em endpoints sensíveis
- BCrypt para senhas (BCrypt.Net-Next)

### O que NÃO deve ser feito
- Regra de negócio em Controller
- Domain dependendo de Infrastructure ou framework web
- Expor stacktrace na resposta da API
- Logar senhas, tokens ou payload sensível completo
- Múltiplos `SaveChangesAsync` sem necessidade no mesmo handler
- Supabase SDK — foi removido completamente

### Resposta padronizada da API
Todos os endpoints de erro devem retornar:
```json
{ "message": "Descrição do erro" }
```

### Auth (JWT próprio)
- **Geração**: `TokenService.GenerateAccessToken(usuarioId, email)`
- **Validação**: JWT Bearer em `Program.cs` com `JWT_SECRET_KEY`
- **Issuer/Audience**: `SeuGerente` / `SeuGerente`
- **Expiração**: 60 min (access) + 7 dias (refresh, em memória por ora)
- **Senhas**: BCrypt com work factor padrão (10)
- **Claim de usuário**: `ClaimTypes.NameIdentifier` = `Guid` do `Cadastro.Id`

### Entidade principal de usuário: `Cadastro`
- `Id` (Guid) é o `usuario_id` em todas as tabelas
- `Email` + `SenhaHash` são as credenciais
- Status: `pendente`, `ativo`, `inativo`

### Configuração de variáveis
- `GetConfigValue()` em Program.cs: lê appsettings → env var automática → env var alternativa
- `appsettings.Development.json`: todas as configs locais com valores reais
- `appsettings.Production.json`: valores vazios — tudo vem de env vars

---

## Arquitetura do Frontend

### Estrutura de rotas

```
frontend/src/app/
├── layout.tsx              ← Root layout (sem autenticação)
├── login/                  ← Tela de login única (usuário + admin)
├── (app)/                  ← Rotas autenticadas de usuário
│   ├── layout.tsx          ← Sidebar + layout autenticado
│   ├── dashboard/
│   ├── moradores/
│   ├── despesas/
│   ├── receitas/
│   ├── melhorias/
│   ├── configuracao/
│   └── relatorio/
├── (admin)/                ← Rotas administrativas
│   ├── layout.tsx
│   └── admin/
└── (public)/               ← Rotas públicas (landing, pagamento, etc.)
```

### Padrões de Frontend

- **Server Components por padrão** — `'use client'` só quando necessário (eventos, useState, hooks)
- **Chamadas ao backend**: `src/services/httpClient.ts` → `request()` helper
- **Auth**: token JWT em cookie `auth_token` (lido pelo httpClient e pelo middleware)
- **Sem Supabase** — toda auth passa pelo backend .NET
- **Estado local**: `useState` / `useReducer`
- **Sem biblioteca de estado global** sem necessidade clara
- **Rotas admin**: sempre sob `(admin)/admin/`
- **Login único**: uma rota `/login` para todos os perfis

### Segurança no Frontend
- Nunca expor JWT em `localStorage`
- Cookie `auth_token` para o token de acesso
- Chamadas autenticadas incluem `Authorization: Bearer {token}` via httpClient
- Middleware valida token antes de permitir acesso a rotas protegidas

### Estrutura de serviços
```
frontend/src/
├── services/
│   ├── api.ts          ← Endpoints organizados por domínio
│   └── httpClient.ts   ← request() helper, lê cookie auth_token
├── lib/
│   └── utils.ts        ← Funções utilitárias
└── middleware.ts        ← Proteção de rotas
```

---

## Desenvolvimento Local

### Pré-requisitos
- Docker Desktop
- .NET 8 SDK
- Node.js 20+

### Subir o banco de dados
```bash
docker compose -f database/docker-compose.yml up -d
```
PostgreSQL disponível em `localhost:5432`
- Database: `seugerente`
- User: `seugerente`
- Password: `seugerente123`

### Rodar o backend
```bash
cd backend/src/SeuGerente.Api
dotnet run
```
API disponível em `http://localhost:5000`
Swagger em `http://localhost:5000/swagger`

### Rodar o frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend disponível em `http://localhost:3000`

### Primeira execução (migrations)
Na primeira vez, o EF Core aplica todas as migrations automaticamente ao iniciar a API (ou rode manualmente):
```bash
cd backend/src/SeuGerente.Api
dotnet ef database update --project ../SeuGerente.Infrastructure
```

---

## Variáveis de Ambiente

### Backend (`backend/src/SeuGerente.Api/.env`)
Arquivo `.env` carregado automaticamente pelo `DotNetEnv` no startup. Usar `__` como separador de seção:
```env
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=seugerente;Username=seugerente;Password=seugerente123
JwtSettings__SecretKey=seu-gerente-local-jwt-secret-minimo-32-chars
JwtSettings__Issuer=SeuGerente
JwtSettings__Audience=SeuGerente
Minio__Endpoint=seu-gerente-minio.negczk.easypanel.host
Minio__AccessKey=seu-gerente
Minio__SecretKey=...
Minio__Bucket=contas-de-casa
Minio__UseSsl=true
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Produção (EasyPanel — variáveis de ambiente com `__`)
Obrigatórias:
- `ConnectionStrings__DefaultConnection` — connection string PostgreSQL
- `JwtSettings__SecretKey` — chave JWT (mínimo 32 chars)
- `FrontendUrl` — URL do frontend
- `Hangfire__DashboardPassword` — senha do dashboard Hangfire
- `Minio__Endpoint`, `Minio__AccessKey`, `Minio__SecretKey`, `Minio__Bucket`, `Minio__UseSsl`

---

## Entidades Principais

| Entidade | Tabela | Descrição |
|----------|--------|-----------|
| `Cadastro` | `cadastro` | Usuário principal (síndico/admin do condomínio) |
| `Administrativo` | `administrativo` | Usuário admin do sistema (superadmin) |
| `Morador` | `moradores` | Moradores de cada condomínio |
| `Despesa` | `despesas` | Despesas do condomínio |
| `Receita` | `receitas` | Receitas do condomínio |
| `Pagamento` | `pagamentos` | Pagamentos de moradores |
| `Configuracao` | `configuracao` | Configurações do condomínio |
| `Melhoria` | `melhorias` | Projetos de melhoria |
| `Sugestao` | `sugestoes` | Sugestões de moradores |
| `Assinatura` | `assinaturas` | Assinatura/plano do usuário |
| `Parceiro` | `parceiros` | Parceiros indicadores |

Todas as entidades de condomínio usam `usuario_id` (= `Cadastro.Id`) como chave de isolamento multi-tenant.

---

## Regras Importantes

1. **Multi-tenant por `usuario_id`**: Nunca retornar dados de outro usuário. Sempre filtrar por `UsuarioId` extraído do JWT.
2. **Senhas**: Sempre BCrypt. Nunca comparar senha em texto puro.
3. **Migrations**: Sempre criar migration nova ao alterar entidade — nunca editar migration existente.
4. **Supabase**: Completamente removido. Não adicionar de volta nenhum pacote `supabase-*`.
5. **Logs**: `_logger.LogError` para erros; nunca logar `loginDto.Password`, tokens ou dados sensíveis.
6. **DTOs**: Nunca retornar entidade Domain diretamente da API — sempre usar DTO.
7. **CORS**: Configurado em Program.cs, controlado por `FRONTEND_URL` e `CORS_ORIGINS`.

---

## Módulos Funcionais

1. **Auth** — Login, registro, refresh token, logout, me
2. **Cadastro** — Perfil e dados do condomínio do usuário
3. **Moradores** — CRUD de moradores
4. **Despesas** — CRUD + reconhecimento por IA + comprovantes
5. **Receitas** — CRUD de receitas
6. **Pagamentos** — Registro de pagamentos, integração Mercado Pago
7. **Cobranças** — PIX automático via Hangfire
8. **Configuração** — Configurações do condomínio e email
9. **Melhorias/Sugestões** — Sistema de propostas
10. **Relatórios** — Dashboard com gráficos
11. **WhatsApp** — Integração Evolution API
12. **Parceiros** — Programa de indicação com comissões
13. **Admin** — Painel administrativo do sistema

---

## Fluxo de Desenvolvimento

Antes de criar qualquer coisa:
1. Pesquisar código existente (entidade, repositório, serviço, controller, rota)
2. Verificar se há DTO, interface ou validator correspondente
3. Implementar na camada correta
4. Nunca duplicar sem verificar antes

Antes de fazer deploy:
1. `dotnet build` sem erros
2. `npm run build` sem erros
3. `npm run lint` sem erros

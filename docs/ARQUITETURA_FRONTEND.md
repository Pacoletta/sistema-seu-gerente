# Arquitetura Frontend — Sistema Seu Gerente

Documentação da arquitetura do frontend baseada em Next.js 16 App Router.

---

## Estrutura de Pastas

```
frontend/
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx               # Root layout (sem autenticação)
    │   ├── login/                   # Login único (usuário + admin)
    │   ├── (app)/                   # Rotas autenticadas de usuário
    │   │   ├── layout.tsx           # Sidebar + layout autenticado
    │   │   ├── dashboard/
    │   │   ├── moradores/
    │   │   ├── despesas/
    │   │   ├── receitas/
    │   │   ├── melhorias/
    │   │   ├── configuracao/
    │   │   └── relatorio/
    │   ├── (admin)/                 # Rotas administrativas
    │   │   ├── layout.tsx
    │   │   └── admin/
    │   └── (public)/                # Rotas públicas
    │       ├── page.tsx             # Landing page
    │       ├── cancel/
    │       └── success/
    ├── services/
    │   ├── api.ts                   # Endpoints organizados por domínio
    │   └── httpClient.ts            # request() helper, lê cookie auth_token
    ├── components/
    │   ├── ui/                      # Componentes básicos reutilizáveis
    │   ├── layout/                  # Header, Sidebar, containers
    │   └── forms/                   # Inputs e botões customizados
    ├── hooks/                       # Custom hooks
    ├── lib/
    │   └── utils.ts                 # Funções utilitárias
    ├── types/                       # TypeScript types e interfaces
    └── middleware.ts                # Proteção de rotas por cookie auth_token
```

---

## Grupos de Rotas

### `(app)/` — Rotas autenticadas do usuário

- Dashboard, moradores, despesas, receitas, melhorias, configuração, relatório
- Layout com sidebar e verificação de autenticação
- Requer cookie `auth_token` válido

### `(admin)/` — Rotas administrativas

- Painel do administrador do sistema (superadmin)
- Sempre sob `(admin)/admin/`
- Requer role `admin` no JWT

### `(public)/` — Rotas públicas

- Landing page
- Páginas de callback de pagamento (success, cancel)
- Não requer autenticação

### `login/` — Login único

- Uma única rota `/login` para todos os perfis (usuário e admin)
- Redireciona para o painel correto após autenticação

---

## Camada de Serviços

### `httpClient.ts` — request() helper

- Lê o cookie `auth_token` e injeta `Authorization: Bearer {token}` em todas as requisições autenticadas
- Base URL configurada via `NEXT_PUBLIC_BACKEND_URL`
- Trata erros HTTP e redireciona para `/login` em 401

### `api.ts` — Endpoints por domínio

Organiza as chamadas ao backend .NET por módulo:

```typescript
export const moradorService = {
  getAll: () => request<MoradorDTO[]>("/api/moradores"),
  create: (data: CreateMoradorDTO) =>
    request<MoradorDTO>("/api/moradores", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // ...
};
```

---

## Middleware

`middleware.ts` protege rotas autenticadas verificando o cookie `auth_token`:

```
Requisição para rota protegida
    ↓
middleware.ts verifica cookie auth_token
    ├── Presente → permite acesso
    └── Ausente → redireciona para /login
```

---

## Fluxo de Autenticação

```
1. POST /api/auth/login → backend retorna { accessToken, refreshToken, ... }
2. Frontend salva accessToken em cookie auth_token
3. Toda requisição autenticada envia: Authorization: Bearer {accessToken}
4. accessToken expira (60min) → POST /api/auth/refresh com refreshToken
5. POST /api/auth/logout → frontend limpa cookie auth_token
```

---

## Tecnologias

| Tecnologia              | Uso                      |
| ----------------------- | ------------------------ |
| Next.js 16 (App Router) | Framework                |
| React 19                | UI                       |
| TypeScript 5            | Tipagem                  |
| Tailwind CSS 4          | Estilos                  |
| Framer Motion           | Animações                |
| Recharts                | Gráficos                 |
| Radix UI                | Componentes base         |
| Fetch nativo            | HTTP (via httpClient.ts) |

**Sem Supabase** — toda autenticação e dados passam pelo backend .NET.

---

## Padrões

### Server vs Client Components

**Server Component (padrão)** — sem `'use client'`:

```tsx
export default async function MoradoresPage() {
  const moradores = await moradorService.getAll();
  return <MoradoresList moradores={moradores} />;
}
```

**Client Component** — somente quando necessário (eventos, useState, hooks):

```tsx
"use client";
import { useState } from "react";

export function MoradorForm() {
  const [nome, setNome] = useState("");
  // ...
}
```

### Segurança

- JWT nunca em `localStorage` — sempre em cookie `auth_token`
- `NEXT_PUBLIC_` só para valores que podem ser expostos ao cliente
- Validação real de dados sempre no backend — frontend valida apenas UX

### Nomenclatura

| Tipo       | Convenção             | Exemplo             |
| ---------- | --------------------- | ------------------- |
| Componente | PascalCase            | `MoradorCard.tsx`   |
| Hook       | camelCase + `use`     | `useAuth.ts`        |
| Service    | camelCase + `Service` | `moradorService.ts` |
| Tipo       | PascalCase            | `MoradorDTO`        |
| Pasta      | kebab-case            | `reset-password/`   |

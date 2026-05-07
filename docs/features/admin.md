# Admin

Painel administrativo do sistema. Gerencia usuários, assinaturas, administradores e finanças do SaaS.

**Base URLs:** `/api/admin`  
**Auth:** JWT de usuário com role admin + middleware `[RequireAdmin]`

---

## Autenticação Admin

### POST `/api/admin/login`

Autentica administrador do sistema.

**Auth:** Público

**Request:**

```json
{
  "email": "admin@sistemaseugerente.com",
  "senha": "AdminSenh@123"
}
```

**Response 200:**

```json
{
  "accessToken": "eyJhbGci...",
  "admin": {
    "id": "guid",
    "email": "admin@sistemaseugerente.com",
    "nome": "Administrador"
  }
}
```

### POST `/api/admin/set-password`

Define ou atualiza senha de um administrador.

**Auth:** Público (uso interno)

**Request:**

```json
{
  "email": "admin@sistemaseugerente.com",
  "novaSenha": "NovaSenh@123"
}
```

---

## Dashboard

### GET `/api/admin/check-admin`

Verifica se o usuário autenticado é admin.

**Response 200:** `{ "isAdmin": true, "email": "admin@..." }`

### GET `/api/admin/dashboard`

Retorna resumo geral do sistema.

**Response 200:**

```json
{
  "totalUsuarios": 142,
  "usuariosAtivos": 128,
  "mrr": 12416.0,
  "novosEsseMes": 8
}
```

### GET `/api/admin/stats`

Estatísticas detalhadas do sistema.

### GET `/api/admin/financeiro`

Resumo financeiro do mês atual (receitas do SaaS).

---

## Usuários

### GET `/api/admin/usuarios`

Lista todos os usuários com paginação.

**Query params:** `?page=1&pageSize=50`

**Response 200:**

```json
{
  "items": [{ "id": "guid", "nome": "...", "email": "...", "status": "ativo" }],
  "total": 142,
  "page": 1,
  "pageSize": 50
}
```

### GET `/api/admin/usuarios-recentes`

Lista usuários mais recentes.

**Query params:** `?limit=10`

---

## Assinaturas

### GET `/api/admin/assinaturas`

Lista todas as assinaturas com filtros.

**Query params:** `?page=1&pageSize=50&status=ativo`

### GET `/api/admin/assinaturas/stats`

Estatísticas de assinaturas.

**Response 200:**

```json
{
  "totalAtivas": 128,
  "totalInativas": 14,
  "mrrTotal": 12416.0,
  "churnEsseMes": 3
}
```

### PATCH `/api/admin/assinaturas/{id}/status`

Altera status de uma assinatura.

**Request:** `{ "status": "ativo" }`

### POST `/api/admin/assinaturas/{id}/renovar`

Renova assinatura manualmente por N meses.

**Request:** `{ "meses": 3 }`

### POST `/api/admin/assinaturas`

Cria assinatura manual para um usuário.

---

## Administradores

### GET `/api/admin/administradores`

Lista todos os admins do sistema.

### POST `/api/admin/administradores`

Cria novo administrador.

**Request:** `{ "nome": "...", "email": "...", "senha": "..." }`

### PATCH `/api/admin/administradores/{id}/status`

Ativa ou desativa um administrador.

### PATCH `/api/admin/administradores/{id}/senha`

Atualiza senha de um administrador.

### DELETE `/api/admin/administradores/{id}`

Remove um administrador.

---

## Despesas do Sistema

Controle financeiro interno do SaaS (custos operacionais).

### GET `/api/admin/despesas-sistema`

Lista despesas operacionais do sistema.

### POST `/api/admin/despesas-sistema`

Cadastra nova despesa do sistema.

**Request:** `{ "descricao": "Servidor EasyPanel", "valor": 120.00, "data": "2026-05-01" }`

### PATCH `/api/admin/despesas-sistema/{id}/pagar`

Marca despesa como paga.

### DELETE `/api/admin/despesas-sistema/{id}`

Remove despesa do sistema.

---

## Logs

### GET `/api/admin/logs`

Lista logs do sistema com filtros.

**Query params:** `?page=1&pageSize=50&nivel=error&categoria=auth&dataInicio=2026-05-01&dataFim=2026-05-31`

### DELETE `/api/admin/logs/limpar`

Remove logs antigos.

**Query params:** `?dias=90` (remove logs com mais de 90 dias)

---

## Cobranças em Lote

### POST `/api/admin/enviar-cobrancas`

Dispara cobranças para todos os usuários ativos do sistema.

**Response 200:** `{ "processados": 128, "enviados": 120, "erros": 8 }`

# Cadastro

Perfil e dados do condomínio do usuário (síndico). Entidade principal de multi-tenancy.

**Base URL:** `/api/cadastro`  
**Auth:** `Bearer {accessToken}` exceto onde indicado

---

## Endpoints

### GET `/api/cadastro/me`
Retorna os dados completos do usuário autenticado.

**Response 200:**
```json
{
  "id": "guid",
  "nome": "João Silva",
  "email": "joao@condominio.com",
  "nomeCondominio": "Residencial das Flores",
  "cnpjCpf": "12.345.678/0001-99",
  "whatsapp": "31999999999",
  "quantidadeApartamentos": 40,
  "status": "ativo",
  "createdAt": "2026-01-15T10:00:00Z"
}
```

**Erros:** `404` — cadastro não encontrado

---

### GET `/api/cadastro/status`
Retorna o status da assinatura do usuário.

**Response 200:**
```json
{
  "status": "ativo",
  "plano": "mensal",
  "vencimento": "2026-06-01T00:00:00Z"
}
```

**Erros:** `404` — cadastro não encontrado

---

### POST `/api/cadastro`
Cria o cadastro inicial do condomínio. Chamado no fluxo de onboarding após registro.

**Auth:** Público (AllowAnonymous)

**Request:**
```json
{
  "user_id": "guid",
  "email": "joao@condominio.com",
  "nome": "João Silva",
  "cnpj_cpf": "12.345.678/0001-99",
  "whatsapp": "31999999999",
  "nome_condominio": "Residencial das Flores",
  "quantidade_apartamentos": 40,
  "indicacao": "PARCEIRO123"
}
```

> Nota: campos em snake_case (legado do Supabase). `indicacao` é opcional — código do parceiro que indicou.

**Response 200:** `{ "success": true }`  
**Erros:** `400` — formato inválido de `user_id`

---

### POST `/api/cadastro/ativar`
Ativa a assinatura do usuário após pagamento confirmado.

**Auth:** `Bearer {accessToken}`

**Response 200:** `{ "message": "Assinatura ativada com sucesso", "status": "ativo" }`

---

### GET `/api/cadastro`
Busca cadastro por email (uso interno/admin).

**Query params:** `?email=joao@condominio.com`  
**Response 200:** objeto CadastroDTO  
**Erros:** `404` — não encontrado

---

### GET `/api/cadastro/debug/list`
Lista IDs e emails de todos os cadastros (diagnóstico).

**Auth:** Público (AllowAnonymous — uso interno apenas)

**Response 200:** lista simplificada de cadastros

---

## Entidade

| Campo | Tipo | Descrição |
|---|---|---|
| `Id` | Guid | Chave primária — usado como `usuario_id` em todo o sistema |
| `Nome` | string | Nome do síndico |
| `Email` | string | Login do usuário |
| `SenhaHash` | string | Hash BCrypt da senha |
| `NomeCondominio` | string | Nome do condomínio |
| `CnpjCpf` | string | Documento do condomínio |
| `Whatsapp` | string | WhatsApp de contato |
| `QuantidadeApartamentos` | int | Total de unidades |
| `Status` | enum | `pendente` / `ativo` / `inativo` |
| `CreatedAt` | DateTime | Data de cadastro |

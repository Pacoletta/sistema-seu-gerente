# Auth

Autenticação de usuários via JWT próprio (HS256). Sem Supabase.

**Base URL:** `/api/auth`  
**Auth:** Endpoints públicos, exceto `GET /me` e `POST /logout`

---

## Endpoints

### POST `/api/auth/login`

Autentica usuário e retorna tokens JWT.

**Request:**

```json
{
  "email": "sindico@condominio.com",
  "password": "MinhaSenh@123"
}
```

**Response 200:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "uuid-refresh-token",
  "expiresIn": 3600,
  "usuarioId": "guid",
  "email": "sindico@condominio.com",
  "nome": "João Silva",
  "role": "usuario"
}
```

**Erros:**

- `401` — credenciais inválidas
- `403` — usuário inativo

---

### POST `/api/auth/register`

Cria novo usuário (síndico/administrador de condomínio).

**Request:**

```json
{
  "email": "novo@condominio.com",
  "password": "MinhaSenh@123",
  "nome": "Maria Souza",
  "codigoIndicacao": "PARCEIRO123"
}
```

**Response 200:** mesmo formato do login  
**Erros:** `409` — email já cadastrado

---

### POST `/api/auth/refresh`

Renova o access token usando o refresh token.

**Request:**

```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response 200:** mesmo formato do login  
**Erros:** `401` — refresh token inválido ou expirado

---

### GET `/api/auth/me`

Retorna dados do usuário autenticado (extraídos do próprio JWT, sem consulta ao banco).

**Auth:** `Bearer {accessToken}`

**Response 200:**

```json
{
  "id": "guid",
  "email": "sindico@condominio.com",
  "nome": "João Silva",
  "role": "usuario"
}
```

---

### POST `/api/auth/logout`

Invalida a sessão atual (client-side deve limpar o cookie `auth_token`).

**Auth:** `Bearer {accessToken}`  
**Response 200:** `{ "success": true }`

---

## Fluxo de Auth

```
1. POST /login → recebe accessToken + refreshToken
2. Frontend salva accessToken em cookie auth_token
3. Toda requisição envia: Authorization: Bearer {accessToken}
4. Quando accessToken expira (60min) → POST /refresh com refreshToken
5. POST /logout → cliente limpa cookie auth_token
```

---

## Implementação

- **Geração de token:** `TokenService.GenerateAccessToken(usuarioId, email)` — `Infrastructure/Auth/`
- **Hash de senha:** BCrypt.Net-Next (work factor 10)
- **Claim principal:** `ClaimTypes.NameIdentifier` = `Cadastro.Id` (Guid)
- **Expiração:** access = 60min, refresh = 7 dias (em memória)

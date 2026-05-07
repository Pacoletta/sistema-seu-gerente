# Moradores

Gestão de moradores de cada condomínio. Isolamento multi-tenant por `usuario_id`.

**Base URL:** `/api/moradores`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### GET `/api/moradores`

Lista todos os moradores do condomínio autenticado.

**Response 200:**

```json
[
  {
    "id": "guid",
    "numero": "101",
    "nome": "Carlos Pereira",
    "email": "carlos@email.com",
    "telefone": "31999999999",
    "whatsApp": "31999999999",
    "tipo": "morador",
    "usuarioId": "guid",
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-03-01T10:00:00Z"
  }
]
```

---

### GET `/api/moradores/{id}`

Retorna um morador pelo ID.

**Response 200:** objeto MoradorDTO  
**Erros:** `404` — morador não encontrado

---

### POST `/api/moradores`

Cadastra novo morador.

**Request:**

```json
{
  "numero": "101",
  "nome": "Carlos Pereira",
  "email": "carlos@email.com",
  "telefone": "31999999999",
  "whatsApp": "31999999999",
  "tipo": "morador"
}
```

**Response 201:** morador criado

---

### PUT `/api/moradores/{id}`

Atualiza dados de um morador.

**Request:** mesmos campos do POST  
**Response 204:** sem corpo  
**Erros:** `404` — não encontrado

---

### DELETE `/api/moradores/{id}`

Remove um morador.

**Response 204:** sem corpo  
**Erros:** `404` — não encontrado

---

## Campos

| Campo      | Tipo   | Descrição                                  |
| ---------- | ------ | ------------------------------------------ |
| `numero`   | string | Número do apartamento (ex: "101", "B302")  |
| `nome`     | string | Nome do morador                            |
| `email`    | string | Email para notificações                    |
| `telefone` | string | Telefone de contato                        |
| `whatsApp` | string | Número WhatsApp (pode diferir do telefone) |
| `tipo`     | string | `morador` (padrão) ou `proprietario`       |

---

## Regras de Negócio

- `usuario_id` é sempre extraído do JWT — nunca do body da requisição
- `numero` identifica a unidade nos relatórios e cálculos de rateio
- Moradores sem `telefone`/`whatsApp` não recebem notificações por esses canais

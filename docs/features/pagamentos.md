# Pagamentos

Registro de pagamentos de moradores e geração de cobranças mensais.

**Base URL:** `/api/pagamentos`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### GET `/api/pagamentos`
Lista todos os pagamentos do condomínio autenticado.

**Response 200:**
```json
[
  {
    "id": "guid",
    "moradorId": "guid",
    "mesAno": "2026-05",
    "valor": 450.00,
    "status": "pago",
    "caixinha": 50.00,
    "dataPagamento": "2026-05-05T14:30:00Z",
    "dataVencimento": "2026-05-10T00:00:00Z",
    "urlComprovante": null,
    "mercadoPagoId": null,
    "usuarioId": "guid",
    "morador": {
      "id": "guid",
      "numero": "101",
      "nome": "Carlos Pereira"
    },
    "createdAt": "2026-05-01T00:00:00Z"
  }
]
```

---

### GET `/api/pagamentos/mes/{mesAno}`
Lista pagamentos de um mês específico.

**Path param:** `mesAno` no formato `YYYY-MM` (ex: `2026-05`)

**Response 200:** lista de PagamentoDTO do mês

---

### GET `/api/pagamentos/{id}`
Retorna um pagamento pelo ID.

**Response 200:** objeto PagamentoDTO  
**Erros:** `404` — não encontrado

---

### POST `/api/pagamentos`
Registra novo pagamento manualmente.

**Request:**
```json
{
  "moradorId": "guid",
  "mesAno": "2026-05",
  "valor": 450.00,
  "caixinha": 50.00,
  "dataVencimento": "2026-05-10T00:00:00Z"
}
```

**Response 201:** pagamento criado  
**Erros:** `400` — morador não encontrado

---

### PUT `/api/pagamentos/{id}`
Atualiza dados de um pagamento (campos arbitrários).

**Request:**
```json
{
  "valor": 480.00,
  "caixinha": 60.00,
  "dataVencimento": "2026-05-15T00:00:00Z",
  "dataPagamento": "2026-05-07T10:00:00Z",
  "status": "pago",
  "urlComprovante": "https://minio.../recibo.pdf",
  "mercadoPagoId": "mp-id",
  "mesAno": "2026-05",
  "moradorId": "guid"
}
```

**Response 204:** sem corpo

---

### PUT `/api/pagamentos/{id}/status`
Atualiza apenas o status e URL do comprovante de um pagamento.

**Request:**
```json
{
  "status": "pago",
  "urlComprovante": "https://minio.../recibo.pdf"
}
```

**Response 204:** sem corpo

---

### POST `/api/pagamentos/gerar-mensais`
Gera registros de pagamento para todos os moradores ativos no mês.

**Request:**
```json
{
  "mesAno": "2026-05",
  "valorBase": 450.00,
  "dataVencimento": "2026-05-10T00:00:00Z"
}
```

**Response 200:** lista de PagamentoDTO criados

---

### DELETE `/api/pagamentos/{id}`
Remove um pagamento.

**Response 204:** sem corpo

---

## Upload de Comprovante de Pagamento

### POST `/api/comprovantes/upload/receitas`
Upload de comprovante vinculado a um pagamento recebido.

**Form fields:** `file`, `pagamento_id`, `user_id`  
**Response 200:** `{ "publicUrl": "..." }`

---

## Status de Pagamento

| Status | Descrição |
|---|---|
| `pendente` | Gerado mas não pago |
| `pago` | Confirmado pelo síndico |
| `atrasado` | Passou da data sem pagamento |
| `cancelado` | Cancelado manualmente |

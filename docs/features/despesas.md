# Despesas

Gestão de despesas do condomínio com suporte a reconhecimento por IA e upload de comprovantes.

**Base URL:** `/api/despesas`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### GET `/api/despesas`
Lista todas as despesas do condomínio autenticado.

**Response 200:**
```json
[
  {
    "id": "guid",
    "data": "2026-05-01T00:00:00Z",
    "descricao": "Manutenção elevador",
    "categoria": "Manutenção",
    "valor": 850.00,
    "valoresPorAp": [21.25, 21.25, 21.25, 21.25],
    "tipoDivisao": "igual",
    "comprovanteUrl": "https://minio.../contas-de-casa/despesas/arquivo.pdf",
    "enviado": null,
    "melhoriaId": null,
    "origem": null,
    "status": null,
    "usuarioId": "guid",
    "createdAt": "2026-05-01T10:00:00Z",
    "updatedAt": null
  }
]
```

---

### GET `/api/despesas/mes/{mesAno}`
Lista despesas de um mês específico.

**Path param:** `mesAno` no formato `YYYY-MM` (ex: `2026-05`)

**Response 200:** lista de DespesaDTO do mês

---

### GET `/api/despesas/{id}`
Retorna uma despesa pelo ID.

**Response 200:** objeto DespesaDTO  
**Erros:** `404` — despesa não encontrada

---

### POST `/api/despesas`
Cadastra nova despesa.

**Request:**
```json
{
  "data": "2026-05-01T00:00:00Z",
  "descricao": "Manutenção elevador",
  "categoria": "Manutenção",
  "valor": 850.00,
  "valoresPorAp": [21.25, 21.25, 21.25, 21.25],
  "tipoDivisao": "igual",
  "comprovanteUrl": "https://minio.../arquivo.pdf",
  "melhoriaId": null,
  "origem": null,
  "status": null
}
```

> `tipoDivisao`: `"igual"` (rateio igualitário) ou `"personalizado"` (usar `valoresPorAp`). Padrão: `"igual"`.

**Response 201:** despesa criada

---

### PUT `/api/despesas/{id}`
Atualiza uma despesa existente.

**Request:** mesmos campos do POST (todos opcionais)  
**Response 204:** sem corpo  
**Erros:** `404` — não encontrada

---

### DELETE `/api/despesas/{id}`
Remove uma despesa.

**Response 204:** sem corpo  
**Erros:** `404` — não encontrada

---

## Reconhecimento por IA

### POST `/api/ai/reconhecer-despesa`
Envia imagem de comprovante para o OpenAI GPT-4 e retorna dados estruturados da despesa.

**Auth:** `Bearer {accessToken}`

**Request:**
```json
{
  "imagemUrl": "https://minio.../temp/1234567_comprovante.jpg"
}
```

**Response 200:**
```json
{
  "descricao": "Serviço de dedetização",
  "categoria": "Higiene",
  "valor": 320.00,
  "data": "2026-05-03",
  "fornecedor": "DedetizaCerta Ltda"
}
```

---

## Upload de Comprovantes

### POST `/api/comprovantes/upload/despesas`
Faz upload de comprovante vinculado a uma despesa.

**Content-Type:** `multipart/form-data`

**Form fields:**
- `file` — arquivo (PDF, JPG, PNG)
- `despesa_id` — ID da despesa
- `user_id` — ID do usuário

**Response 200:**
```json
{ "publicUrl": "https://minio.../contas-de-casa/despesas/1234567_comprovante.pdf" }
```

### POST `/api/comprovantes/upload/temp`
Upload temporário para pré-reconhecimento por IA (antes de criar a despesa).

**Form fields:** `file`, `user_id`  
**Response 200:** `{ "publicUrl": "..." }`

### DELETE `/api/comprovantes/{*filePath}`
Remove arquivo do storage MinIO.

**Query param:** `?bucket=despesas`  
**Response 204:** sem corpo

---

## Fluxo com IA

```
1. POST /comprovantes/upload/temp → obter URL temporária
2. POST /ai/reconhecer-despesa { imagemUrl } → dados pré-preenchidos
3. Usuário confirma/corrige os dados
4. POST /comprovantes/upload/despesas → upload definitivo vinculado à despesa
5. POST /despesas com comprovanteUrl preenchido
```

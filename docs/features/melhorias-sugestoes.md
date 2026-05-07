# Melhorias e Sugestões

Sistema de propostas de melhorias e sugestões de moradores para o condomínio.

**Base URLs:** `/api/melhorias` e `/api/sugestoes`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Melhorias

Projetos e obras de melhoria propostos pela administração do condomínio.

### GET `/api/melhorias`

Lista todas as melhorias do condomínio.

**Response 200:**

```json
[
  {
    "id": "guid",
    "titulo": "Reforma da piscina",
    "descricao": "Reforma completa incluindo azulejos e bomba",
    "status": "em_andamento",
    "orcamento": 15000.0,
    "dataInicio": "2026-04-01",
    "dataConclusao": null,
    "usuarioId": "guid"
  }
]
```

### GET `/api/melhorias/{id}`

Retorna uma melhoria pelo ID.

### POST `/api/melhorias`

Cadastra nova melhoria.

**Request:**

```json
{
  "titulo": "Reforma da piscina",
  "descricao": "Reforma completa incluindo azulejos e bomba",
  "status": "planejado",
  "orcamento": 15000.0,
  "dataInicio": "2026-04-01"
}
```

**Response 201:** melhoria criada

### PUT `/api/melhorias/{id}`

Atualiza uma melhoria.

**Response 204:** sem corpo

### DELETE `/api/melhorias/{id}`

Remove uma melhoria.

**Response 204:** sem corpo

---

## Sugestões

Sugestões enviadas pelos moradores à administração.

### GET `/api/sugestoes`

Lista todas as sugestões do condomínio.

**Response 200:**

```json
[
  {
    "id": "guid",
    "titulo": "Instalar câmeras no estacionamento",
    "descricao": "Aumentar segurança no subsolo",
    "status": "pendente",
    "moradorNome": "Carlos Pereira",
    "apartamento": "101",
    "usuarioId": "guid",
    "createdAt": "2026-05-01T10:00:00Z"
  }
]
```

### GET `/api/sugestoes/{id}`

Retorna uma sugestão pelo ID.

### POST `/api/sugestoes`

Registra nova sugestão.

**Request:**

```json
{
  "titulo": "Instalar câmeras no estacionamento",
  "descricao": "Aumentar segurança no subsolo",
  "moradorNome": "Carlos Pereira",
  "apartamento": "101"
}
```

**Response 201:** sugestão criada

### PUT `/api/sugestoes/{id}`

Atualiza status de uma sugestão (ex: aprovada, rejeitada).

**Response 204:** sem corpo

### DELETE `/api/sugestoes/{id}`

Remove uma sugestão.

**Response 204:** sem corpo

---

## Status

| Status         | Melhorias | Sugestões |
| -------------- | --------- | --------- |
| `planejado`    | ✓         | —         |
| `em_andamento` | ✓         | —         |
| `concluido`    | ✓         | —         |
| `cancelado`    | ✓         | —         |
| `pendente`     | —         | ✓         |
| `aprovado`     | —         | ✓         |
| `rejeitado`    | —         | ✓         |

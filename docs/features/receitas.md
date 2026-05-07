# Receitas

Gestão de receitas do condomínio (entradas financeiras além das cobranças de moradores).

**Base URL:** `/api/receitas`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### GET `/api/receitas`

Lista todas as receitas do condomínio autenticado.

**Response 200:**

```json
[
  {
    "id": "guid",
    "descricao": "Aluguel salão de festas",
    "categoria": "Aluguel",
    "valor": 500.0,
    "data": "2026-05-10",
    "usuarioId": "guid"
  }
]
```

---

### GET `/api/receitas/{id}`

Retorna uma receita pelo ID.

**Response 200:** objeto ReceitaDTO  
**Erros:** `404` — receita não encontrada

---

### POST `/api/receitas`

Cadastra nova receita.

**Request:**

```json
{
  "descricao": "Aluguel salão de festas",
  "categoria": "Aluguel",
  "valor": 500.0,
  "data": "2026-05-10"
}
```

**Response 201:** receita criada

---

### PUT `/api/receitas/{id}`

Atualiza uma receita existente.

**Request:** mesmos campos do POST (todos opcionais)  
**Response 204:** sem corpo  
**Erros:** `404` — não encontrada

---

### DELETE `/api/receitas/{id}`

Remove uma receita.

**Response 204:** sem corpo  
**Erros:** `404` — não encontrada

---

## Entidade

| Campo       | Tipo     | Descrição                                |
| ----------- | -------- | ---------------------------------------- |
| `Id`        | Guid     | Chave primária                           |
| `Descricao` | string   | Descrição da receita                     |
| `Categoria` | string   | Categoria (Aluguel, Multa, Doação, etc.) |
| `Valor`     | decimal  | Valor em reais                           |
| `Data`      | DateTime | Data de competência                      |
| `UsuarioId` | Guid     | FK para Cadastro (multi-tenant)          |

# Parceiros

Programa de indicação com geração de código, rastreio de conversões e solicitação de saques.

**Base URL:** `/api/parceiro`  
**Auth:** JWT próprio com claim `parceiro_id` (separado do JWT de usuário)

---

## Endpoints

### POST `/api/parceiro/cadastro`

Registra novo parceiro e gera código de indicação único.

**Auth:** Público

**Request:**

```json
{
  "nome": "Ana Oliveira",
  "email": "ana@parceiro.com",
  "telefone": "11988887777",
  "cpf": "123.456.789-00",
  "chavePix": "ana@parceiro.com"
}
```

**Response 200:**

```json
{
  "accessToken": "eyJhbGci...",
  "parceiro": {
    "id": "guid",
    "nome": "Ana Oliveira",
    "codigoIndicacao": "ANA2026",
    "comissaoPendente": 0.0,
    "comissaoPaga": 0.0
  }
}
```

---

### POST `/api/parceiro/login`

Autentica parceiro.

**Auth:** Público

**Request:**

```json
{
  "email": "ana@parceiro.com",
  "senha": "MinhaSenh@123"
}
```

**Response 200:** mesmo formato do cadastro

---

### GET `/api/parceiro/me`

Retorna perfil e saldo do parceiro autenticado.

**Auth:** `Bearer {parceiroToken}`

**Response 200:**

```json
{
  "id": "guid",
  "nome": "Ana Oliveira",
  "email": "ana@parceiro.com",
  "codigoIndicacao": "ANA2026",
  "comissaoPendente": 150.0,
  "comissaoPaga": 300.0,
  "totalIndicacoes": 8
}
```

---

### GET `/api/parceiro/indicacoes`

Lista todas as indicações feitas pelo parceiro.

**Response 200:**

```json
[
  {
    "id": "guid",
    "nomeCondominio": "Residencial das Flores",
    "email": "sindico@condominio.com",
    "status": "ativo",
    "createdAt": "2026-03-15T10:00:00Z"
  }
]
```

---

### GET `/api/parceiro/assinaturas`

Lista pagamentos de assinatura gerados pelas indicações do parceiro.

**Response 200:**

```json
[
  {
    "condominioNome": "Residencial das Flores",
    "valor": 97.0,
    "comissao": 19.4,
    "data": "2026-05-01T00:00:00Z",
    "status": "pago"
  }
]
```

---

### POST `/api/parceiro/registrar-indicacao`

Registra manualmente uma nova indicação.

**Request:**

```json
{
  "emailIndicado": "novo@condominio.com",
  "nomeCondominio": "Condomínio Sol Nascente"
}
```

**Response 200:** `{ "message": "Indicação registrada com sucesso" }`

---

### GET `/api/parceiro/saques`

Lista solicitações de saque do parceiro.

**Response 200:**

```json
[
  {
    "id": "guid",
    "valor": 150.0,
    "status": "pendente",
    "chavePix": "ana@parceiro.com",
    "solicitadoEm": "2026-05-05T10:00:00Z"
  }
]
```

---

### POST `/api/parceiro/saques`

Solicita saque do saldo disponível.

**Request:**

```json
{
  "valor": 150.0
}
```

**Response 200:** `{ "saqueId": "guid", "message": "Saque solicitado com sucesso" }`  
**Erros:** `400` — saldo insuficiente

---

## Fluxo de Indicação

```
1. Parceiro compartilha link com código: /cadastro?ref=ANA2026
2. Novo usuário se cadastra via POST /api/auth/register { codigoIndicacao: "ANA2026" }
3. Sistema registra a indicação no cadastro do usuário
4. A cada pagamento de assinatura, comissão (20%) é creditada ao parceiro
5. Parceiro solicita saque via POST /api/parceiro/saques
```

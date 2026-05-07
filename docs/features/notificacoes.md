# Notificações

Envio de cobranças e relatórios via WhatsApp (Evolution API) e email (Resend).

**Base URL:** `/api/notificacoes`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## WhatsApp

### POST `/api/notificacoes/whatsapp/cobranca`

Envia mensagem de cobrança para um morador via WhatsApp.

**Request:**

```json
{
  "moradorId": "guid",
  "telefone": "31999999999",
  "nome": "Carlos Pereira",
  "apartamento": "101",
  "valor": 450.0,
  "mes": "Maio/2026",
  "vencimento": "2026-05-10"
}
```

**Response 200:** `{ "enviado": true }`  
**Erros:** `400` — WhatsApp desconectado, `422` — telefone inválido

---

### POST `/api/notificacoes/whatsapp/cobranca-lote`

Envia cobrança para múltiplos moradores de uma vez.

**Request:**

```json
{
  "moradores": [
    {
      "telefone": "31999999999",
      "nome": "Carlos",
      "valor": 450.0,
      "mes": "Maio/2026"
    }
  ]
}
```

**Response 200:**

```json
{ "enviados": 28, "erros": 2, "detalhes": [] }
```

---

### POST `/api/notificacoes/whatsapp/enviar-relatorio`

Envia PDF do relatório mensal via WhatsApp.

**Request:**

```json
{
  "telefone": "31999999999",
  "pdfBase64": "JVBERi0xLjQK...",
  "nomeArquivo": "relatorio-maio-2026.pdf",
  "mensagem": "Relatório do mês de Maio"
}
```

**Fluxo interno:**

```
1. Upload do PDF no MinIO (bucket temp-whatsapp)
2. Envio da URL pública para a Evolution API
3. Deleção do arquivo 10 segundos após envio
```

**Response 200:** `{ "enviado": true }`

---

### GET `/api/notificacoes/whatsapp/status`

Verifica se a instância WhatsApp está conectada.

**Response 200:**

```json
{ "conectado": true, "instancia": "sistemaseugerente" }
```

---

## Email

### POST `/api/notificacoes/email/cobranca`

Envia email de cobrança para um morador.

**Request:**

```json
{
  "moradorId": "guid",
  "email": "carlos@email.com",
  "nome": "Carlos Pereira",
  "apartamento": "101",
  "valor": 450.0,
  "mes": "Maio/2026",
  "vencimento": "2026-05-10"
}
```

**Response 200:** `{ "enviado": true }`

---

### POST `/api/notificacoes/email/cobranca-lote`

Envia cobrança por email para múltiplos moradores.

**Request:**

```json
{
  "moradores": [
    {
      "email": "carlos@email.com",
      "nome": "Carlos",
      "valor": 450.0,
      "mes": "Maio/2026"
    }
  ]
}
```

**Response 200:** `{ "enviados": 30, "erros": 1 }`

---

### POST `/api/notificacoes/email/enviar-relatorio`

Envia relatório PDF por email.

**Request:**

```json
{
  "email": "sindico@condominio.com",
  "pdfBase64": "JVBERi0xLjQK...",
  "nomeArquivo": "relatorio-maio-2026.pdf",
  "assunto": "Relatório Mensal - Maio 2026"
}
```

**Response 200:** `{ "enviado": true }`

---

## Infraestrutura

| Serviço            | Provedor      | Config                                                                        |
| ------------------ | ------------- | ----------------------------------------------------------------------------- |
| WhatsApp           | Evolution API | `EvolutionApi__BaseUrl`, `EvolutionApi__ApiKey`, `EvolutionApi__InstanceName` |
| Email              | Resend.com    | `Resend__ApiKey`                                                              |
| Storage temporário | MinIO         | bucket `temp-whatsapp`, deleção em 10s                                        |

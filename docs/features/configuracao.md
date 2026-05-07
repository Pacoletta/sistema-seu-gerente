# Configuração

Configurações do condomínio: dados gerais e configuração de email para envio de notificações.

**Base URL:** `/api/configuracao`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### GET `/api/configuracao`
Retorna as configurações do condomínio autenticado.

**Response 200:**
```json
{
  "id": "guid",
  "nomeCondominio": "Residencial das Flores",
  "endereco": "Rua das Flores, 100",
  "cidade": "Belo Horizonte",
  "estado": "MG",
  "cep": "30000-000",
  "diaVencimento": 10,
  "valorCondominio": 450.00,
  "pixCobranca": "chave@pix.com",
  "pixNomeBeneficiario": "Residencial das Flores",
  "mesReferenciaCobranca": "atual",
  "usuarioId": "guid"
}
```

**Erros:** `404` — configuração não encontrada

---

### PUT `/api/configuracao`
Cria ou atualiza as configurações do condomínio (upsert).

**Request:**
```json
{
  "nomeCondominio": "Residencial das Flores",
  "endereco": "Rua das Flores, 100",
  "cidade": "Belo Horizonte",
  "estado": "MG",
  "cep": "30000-000",
  "diaVencimento": 10,
  "valorCondominio": 450.00,
  "pixCobranca": "chave@pix.com",
  "pixNomeBeneficiario": "Residencial das Flores",
  "mesReferenciaCobranca": "atual"
}
```

> `mesReferenciaCobranca`: `"atual"` ou `"anterior"` — define qual mês usar como referência nas cobranças automáticas.

**Response 200:** configuração atualizada

---

### GET `/api/configuracao/email`
Retorna a configuração de email do condomínio.

**Response 200:**
```json
{
  "id": "guid",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUser": "condominio@gmail.com",
  "fromName": "Residencial das Flores",
  "fromEmail": "condominio@gmail.com",
  "ativo": true,
  "usuarioId": "guid"
}
```

---

### PUT `/api/configuracao/email`
Cria ou atualiza a configuração de email (upsert).

**Request:**
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUser": "condominio@gmail.com",
  "smtpPassword": "app-password-aqui",
  "fromName": "Residencial das Flores",
  "fromEmail": "condominio@gmail.com",
  "ativo": true
}
```

**Response 200:** configuração de email atualizada

---

### POST `/api/configuracao/teste-envio`
Dispara envio do relatório e cobrança mensal para todos os moradores cadastrados (email + WhatsApp). Gera o PDF completo com despesas do mês e envia individualmente.

**Response 200:**
```json
{
  "message": "Teste enviado com sucesso",
  "enviadosEmail": 32,
  "enviadosWhatsApp": 28,
  "falhas": 2,
  "totalMoradores": 40
}
```

**Erros:**
- `400` — configuração não encontrada ou nenhum morador cadastrado
- `500` — erro ao gerar PDF

---

## Configuração Pública

### GET `/api/configpublica`
Retorna configurações públicas consumidas pelo frontend (sem auth).

**Response 200:**
```json
{
  "mercadopago_public_key": "APP_USR-...",
  "webhooks": {
    "chat_suporte": "https://n8n-hook.paxstecnologia.com/webhook/chatsuporte",
    "chat_landing": "https://n8n-hook.paxstecnologia.com/webhook/chatlanding",
    "enviar_pdf": "https://n8n-hook.paxstecnologia.com/webhook/enviarpdf",
    "conectar": "https://n8n-hook.paxstecnologia.com/webhook/conectar",
    "verificar": "https://n8n-hook.paxstecnologia.com/webhook/verificar",
    "deletar": "https://n8n-hook.paxstecnologia.com/webhook/deletar",
    "cadastro": "https://n8n-hook.paxstecnologia.com/webhook/whatsapp-email",
    "enviar_todos": "https://n8n-hook.paxstecnologia.com/webhook/whatsapp-email",
    "chat": "https://n8n-hook.paxstecnologia.com/webhook/chat"
  },
  "business": {
    "site_url": "https://sistemaseugerente.com.br",
    "whatsapp": "5531983625590",
    "whatsapp_support": "5511999999999"
  },
  "storage": {
    "base_url": "",
    "logo_path": "/logo.png",
    "logo_url": "/logo.png"
  }
}
```

> A base URL dos webhooks é configurada via `Webhooks__N8N__BaseUrl` (padrão: `https://n8n-hook.paxstecnologia.com`).

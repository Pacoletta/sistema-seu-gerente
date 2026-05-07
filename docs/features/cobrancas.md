# Cobranças PIX

Geração de cobranças PIX via Mercado Pago e automação de cobranças mensais via Hangfire.

**Base URL:** `/api/cobrancapix`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### POST `/api/cobrancapix/gerar`
Gera cobrança PIX com QR Code para o condomínio autenticado. Envia email automaticamente ao usuário após geração.

**Response 200:**
```json
{
  "success": true,
  "paymentId": "mp-payment-id",
  "qrCode": "00020126...",
  "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "valor": 29.90,
  "message": "Cobrança PIX gerada com sucesso! Verifique seu email."
}
```

**Erros:** `500` — falha na integração Mercado Pago

---

### GET `/api/cobrancapix/verificar/{paymentId}`
Verifica o status de um pagamento PIX no Mercado Pago e atualiza o cadastro se aprovado.

**Path param:** `paymentId` — ID retornado na geração

**Response 200:**
```json
{ "message": "Verificação de pagamento processada" }
```

---

### POST `/api/cobrancapix/processar-todas`
Força o processamento manual de cobranças para todos os cadastros ativos. Normalmente executado automaticamente pelo Hangfire.

**Response 200:**
```json
{ "message": "Cobranças processadas com sucesso" }
```

---

## Automação via Hangfire

As cobranças mensais são disparadas automaticamente pelo job `CobrancasJob`:

| Configuração | Valor padrão |
|---|---|
| Cron | `0 9 * * *` (todo dia às 9h) |
| Config | `Hangfire__CobrancasJobCron` |
| Dashboard | `/hangfire` (senha em `Hangfire__DashboardPassword`) |

**Fluxo do job:**
```
1. Busca todos os cadastros com status "ativo"
2. Para cada cadastro: gera PIX via Mercado Pago
3. Envia email com QR Code para o usuário
4. Registra pagamento com status "pendente"
```

---

## Webhook de Confirmação

O Mercado Pago notifica confirmações via webhook:

**POST `/api/webhook/mercadopago`** — recebe notificação IPN  
O sistema verifica o pagamento e atualiza o status do cadastro para `ativo`.

---

## Configuração

Variáveis de ambiente necessárias:
```env
MercadoPago__AccessToken=APP_USR-...
MercadoPago__PublicKey=APP_USR-...
```

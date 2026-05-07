# Webhooks

Endpoints que recebem notificações de sistemas externos.

**Base URL:** `/api/webhook`  
**Auth:** Público — validação por payload e chave secreta de cada integração

---

## Mercado Pago

### POST `/api/webhook/mercadopago`

Recebe notificações IPN (Instant Payment Notification) do Mercado Pago.

Chamado automaticamente pelo Mercado Pago quando um pagamento PIX é confirmado, cancelado ou expirado.

**Request (enviado pelo Mercado Pago):**

```json
{
  "id": "12345678",
  "live_mode": true,
  "type": "payment",
  "date_created": "2026-05-06T14:22:00Z",
  "application_id": "123456",
  "user_id": "654321",
  "version": 1,
  "api_version": "v1",
  "action": "payment.updated",
  "data": {
    "id": "mp-payment-id"
  }
}
```

**Processamento interno:**

```
1. Recebe notificação do Mercado Pago
2. Consulta detalhes do pagamento via API MP
3. Se status == "approved": atualiza pagamento para "pago"
4. Registra log da notificação
```

**Response 200:** `{ "received": true }`

---

### GET `/api/webhook/health`

Verifica se o endpoint de webhook está ativo.

**Response 200:** `{ "status": "ok" }`

---

## Configuração no EasyPanel/Produção

A URL de webhook do Mercado Pago deve ser configurada no painel MP:

```
https://api.sistemaseugerente.com.br/api/webhook/mercadopago
```

Em desenvolvimento, usar **ngrok** ou **Cloudflare Tunnel** para expor o localhost:

```bash
ngrok http 5000
# URL gerada: https://abc123.ngrok.io
# Configurar no MP: https://abc123.ngrok.io/api/webhook/mercadopago
```

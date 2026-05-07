# Assinaturas

Processamento de pagamento e gerenciamento de assinatura do usuário no SaaS.

**Base URL:** `/api/assinatura`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### POST `/api/assinatura/processar`

Processa pagamento de assinatura via Mercado Pago e ativa a assinatura do usuário.

> **Status atual:** integração com Mercado Pago em desenvolvimento. O endpoint já ativa a assinatura (`status = ativo`) e retorna resposta simulada de aprovação.

**Request:**

```json
{
  "amount": 97.0,
  "paymentMethodId": "credit_card",
  "token": "mp-card-token",
  "planId": "plano-mensal",
  "email": "sindico@condominio.com",
  "cardHolder": {
    "name": "Carlos Pereira",
    "identification": {
      "type": "CPF",
      "number": "123.456.789-00"
    }
  }
}
```

**Response 200:**

```json
{
  "success": true,
  "payment": {
    "id": "guid",
    "status": "approved",
    "statusDetail": "accredited",
    "amount": 97.0,
    "transactionAmount": 97.0,
    "paymentMethodId": "credit_card",
    "description": "Assinatura Premium - Seu Gerente",
    "merchantOrderId": "guid"
  },
  "subscription": {
    "id": "guid",
    "status": "active",
    "planId": "plano-mensal",
    "startDate": "2026-05-06T00:00:00Z",
    "nextBillingDate": "2026-06-06T00:00:00Z"
  }
}
```

**Efeito colateral:** chama `CadastroService.AtivarAssinaturaAsync(usuarioId)` — atualiza `Cadastro.Status = "ativo"`.

---

### GET `/api/assinatura/cartoes-salvos`

Lista cartões de crédito salvos do usuário no Mercado Pago.

> **Status atual:** retorna lista vazia. Integração com Mercado Pago (Customer Cards API) pendente.

**Query param:** `?userId={guid}` (ignorado — usuário extraído do JWT)

**Response 200:**

```json
{
  "cards": []
}
```

---

## Fluxo de Assinatura

```
1. Usuário se cadastra → status "pendente"
2. Usuário acessa tela de pagamento → POST /api/assinatura/processar
3. Mercado Pago aprova → status muda para "ativo"
4. Cobranças mensais automáticas via Hangfire (job CobrancaPixJob)
5. Pagamento confirmado via webhook → POST /api/webhook/mercadopago
```

---

## Implementação

- **Service:** `CadastroService.AtivarAssinaturaAsync()` — `Application/Services/`
- **Entidade:** `Cadastro.Status` — valores: `pendente`, `ativo`, `inativo`
- **Pagamentos recorrentes:** gerenciados pelo `CobrancaPixJob` (Hangfire, cron `0 9 * * *`)
- **Webhook de confirmação:** `WebhookController` — `POST /api/webhook/mercadopago`

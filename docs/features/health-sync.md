# Health & Sync

Endpoints utilitários de verificação de saúde da API e manutenção de dados.

---

## Health

### GET `/api/health`

Verifica se a API está operacional.

**Auth:** Público

**Response 200:**

```json
{
  "status": "healthy",
  "timestamp": "2026-05-06T12:00:00Z",
  "version": "1.0.0",
  "service": "Sistema Seu Gerente API (.NET)"
}
```

Usado por EasyPanel/Docker para health checks e monitoramento.

---

## Sync

Utilitários de manutenção para migração e diagnóstico do banco de dados.

**Base URL:** `/api/sync`  
**Auth:** Público (uso interno — expor apenas em ambiente controlado)

---

### GET `/api/sync/usuarios/sem-senha`

Lista usuários que não possuem senha definida. Útil para identificar contas migradas de sistema legado sem senha configurada.

**Response 200:**

```json
{
  "total": 3,
  "usuarios": [
    {
      "id": "guid",
      "email": "usuario@email.com",
      "nome": "Carlos Pereira",
      "status": "pendente",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

> **Atenção:** endpoint sem autenticação — não expor publicamente em produção.

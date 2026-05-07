# Storage (MinIO)

Armazenamento de arquivos via MinIO S3-compatible. Substitui o Supabase Storage.

**Base URL:** `/api/comprovantes`  
**Auth:** `Bearer {accessToken}` obrigatório em todos os endpoints

---

## Endpoints

### POST `/api/comprovantes/upload/despesas`

Upload de comprovante de despesa.

**Content-Type:** `multipart/form-data`

| Campo        | Tipo   | Descrição                         |
| ------------ | ------ | --------------------------------- |
| `file`       | File   | Arquivo (PDF, JPG, PNG, max 10MB) |
| `despesa_id` | string | ID da despesa vinculada           |
| `user_id`    | string | ID do usuário (extraído do JWT)   |

**Response 200:**

```json
{
  "publicUrl": "https://seu-gerente-minio.negczk.easypanel.host/contas-de-casa/despesas/1746528000_nota-fiscal.pdf"
}
```

---

### POST `/api/comprovantes/upload/temp`

Upload temporário para reconhecimento por IA (antes de criar a despesa).

| Campo     | Tipo   | Descrição             |
| --------- | ------ | --------------------- |
| `file`    | File   | Imagem do comprovante |
| `user_id` | string | ID do usuário         |

**Response 200:**

```json
{
  "publicUrl": "https://seu-gerente-minio.negczk.easypanel.host/contas-de-casa/temp/1746528000_comprovante.jpg"
}
```

---

### POST `/api/comprovantes/upload/receitas`

Upload de comprovante de pagamento recebido de morador.

| Campo          | Tipo   | Descrição                 |
| -------------- | ------ | ------------------------- |
| `file`         | File   | Comprovante de pagamento  |
| `pagamento_id` | string | ID do pagamento vinculado |
| `user_id`      | string | ID do usuário             |

**Response 200:** `{ "publicUrl": "..." }`

---

### DELETE `/api/comprovantes/{*filePath}`

Remove arquivo do MinIO.

**Path:** caminho do objeto após o bucket (ex: `despesas/1746528000_nota.pdf`)  
**Query param:** `?bucket=despesas`

**Response 204:** sem corpo

---

## Estrutura de Pastas no MinIO

```
contas-de-casa/           ← bucket raiz (Minio__Bucket)
├── despesas/             ← comprovantes de despesas
├── receitas/             ← comprovantes de pagamentos
├── temp/                 ← uploads temporários (IA)
└── temp-whatsapp/        ← PDFs para envio via WhatsApp (deletados em 10s)
```

---

## Configuração Local (Docker)

```bash
# Subir MinIO local
docker compose -f database/docker-compose.yml up -d

# Acessar console web
http://localhost:9001
# Login: seu-gerente / Pacoleta@1234567890
```

Atualizar `.env` para usar MinIO local:

```env
Minio__Endpoint=localhost:9000
Minio__UseSsl=false
```

---

## Configuração Produção (EasyPanel)

```env
Minio__Endpoint=seu-gerente-minio.negczk.easypanel.host
Minio__AccessKey=seu-gerente
Minio__SecretKey=...
Minio__Bucket=contas-de-casa
Minio__UseSsl=true
```

---

## Implementação

- **Serviço:** `MinioStorageService` — `Infrastructure/ExternalServices/`
- **Interface:** `IStorageService` — `Application/Interfaces/`
- **SDK:** `Minio 6.0.4`
- **Bucket:** criado automaticamente na primeira execução com política de leitura pública
- **URL pública:** `https://{endpoint}/{bucket}/{pasta}/{timestamp}_{arquivo}`

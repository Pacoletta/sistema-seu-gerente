# Schema do Banco de Dados — Sistema Seu Gerente

## Visão Geral

PostgreSQL 16. Todas as tabelas de condomínio usam `usuario_id` (FK para `cadastro.id`) como chave de isolamento multi-tenant. Gerenciado via Entity Framework Core 8 com Npgsql.

---

## Tabelas

### cadastro

Usuário principal do sistema — síndico ou administrador de condomínio.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| nome | varchar(100) | NO | Nome do responsável |
| email | varchar(100) | NO | Email de login (único) |
| senha_hash | text | YES | Hash BCrypt da senha |
| whatsapp | varchar(30) | YES | WhatsApp do responsável |
| nome_condominio | text | YES | Nome do condomínio |
| cnpj_cpf | text | YES | CNPJ ou CPF |
| quantidade_apartamentos | integer | YES | Quantidade de apartamentos |
| status | text | YES | `pendente`, `ativo`, `inativo` |
| mercadopago_subscription_id | text | YES | ID da assinatura no Mercado Pago |
| mercadopago_preference_id | text | YES | ID da preferência no Mercado Pago |
| mercadopago_payment_id | text | YES | ID do pagamento no Mercado Pago |
| data_pagamento | text | YES | Data do último pagamento |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### administrativo

Usuários administradores do sistema (superadmin). Acesso ao painel admin.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| nome | varchar(100) | NO | Nome do admin |
| email | varchar(100) | NO | Email de login (único) |
| senha_hash | text | NO | Hash BCrypt da senha |
| role | text | YES | Papel no sistema |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### moradores

Moradores de cada condomínio.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| numero | text | NO | Número do apartamento (ex: "101", "B302") |
| nome | text | NO | Nome do morador |
| email | text | YES | Email para notificações |
| telefone | text | YES | Telefone de contato |
| whats_app | text | YES | WhatsApp (pode diferir do telefone) |
| tipo | text | NO | `morador` ou `proprietario` |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### despesas

Despesas do condomínio com suporte a rateio por apartamento.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| descricao | text | NO | Descrição da despesa |
| categoria | text | YES | Categoria (ex: "Manutenção") |
| valor | numeric(12,2) | NO | Valor total |
| data | date | NO | Data da despesa |
| tipo_divisao | text | NO | `igual` ou `personalizado` |
| valores_por_ap | numeric[] | YES | Array com valores por apartamento |
| comprovante_url | text | YES | URL do comprovante no MinIO |
| status | text | YES | Status da despesa |
| enviado | text | YES | Flag de envio no relatório |
| melhoria_id | uuid | YES (FK → melhorias) | Vinculado a uma melhoria |
| origem | varchar(20) | YES | Origem: `despesa` (padrão) |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### receitas

Receitas do condomínio (valores extras além das cotas mensais).

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| descricao | text | NO | Descrição da receita |
| categoria | text | YES | Categoria |
| valor | numeric(12,2) | NO | Valor |
| data | date | NO | Data da receita |
| comprovante_url | text | YES | URL do comprovante |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### pagamentos

Pagamentos mensais dos moradores (cota condominial).

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| morador_id | uuid | YES (FK → moradores) | Morador vinculado |
| mes_ano | text | YES | Mês de referência (YYYY-MM) |
| valor | numeric(10,2) | NO | Valor total |
| caixinha | numeric(18,2) | YES | Valor da caixinha |
| data_vencimento | date | NO | Data de vencimento |
| data_pagamento | date | YES | Data de pagamento efetivo |
| status | text | NO | `pendente`, `pago`, `vencido` |
| mercado_pago_id | text | YES | ID do pagamento no Mercado Pago |
| url_comprovante | text | YES | URL do comprovante |
| created_at | timestamptz | NO | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### configuracao

Configurações gerais do condomínio.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| nome_condominio | text | YES | Nome do condomínio |
| endereco | text | YES | Endereço |
| cidade | text | YES | Cidade |
| estado | varchar(2) | YES | Estado (UF) |
| cep | varchar(9) | YES | CEP |
| dia_vencimento | integer | YES | Dia de vencimento das cotas |
| valor_condominio | numeric(10,2) | YES | Valor da cota mensal |
| pix_cobranca | text | YES | Chave PIX para cobranças |
| pix_nome_beneficiario | text | YES | Nome do beneficiário PIX |
| mes_referencia_cobranca | text | YES | `atual` ou `anterior` |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### configuracao_email

Configuração de email SMTP para envios automáticos.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| smtp_host | varchar(255) | NO | Host SMTP |
| smtp_port | integer | NO | Porta SMTP |
| smtp_user | varchar(255) | NO | Usuário SMTP |
| smtp_password | text | NO | Senha de app |
| from_name | varchar(255) | YES | Nome do remetente |
| from_email | varchar(255) | YES | Email do remetente |
| ativo | boolean | YES | Configuração ativa |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### configuracao_whatsapp

Configuração de instância WhatsApp via Evolution API.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| numero_whatsapp | varchar(20) | NO | Número do WhatsApp |
| nome_instancia | varchar(100) | NO | Nome da instância na Evolution API |
| status | varchar(20) | YES | Status da conexão |
| qrcode | text | YES | QR Code para conexão |
| conectado_em | timestamptz | YES | Data de conexão |
| ativo | boolean | YES | Configuração ativa |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### melhorias

Projetos de melhoria do condomínio.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| titulo | varchar(255) | NO | Título da melhoria |
| descricao | text | NO | Descrição detalhada |
| status | varchar(20) | NO | `planejada`, `em_andamento`, `concluida` |
| prioridade | varchar(10) | NO | `baixa`, `media`, `alta` |
| categoria | varchar(50) | YES | Categoria |
| custo_estimado | numeric(10,2) | YES | Custo estimado |
| custo_real | numeric(10,2) | YES | Custo real |
| data_inicio | date | YES | Data de início |
| data_fim_prevista | date | YES | Data prevista de conclusão |
| data_fim_real | date | YES | Data real de conclusão |
| responsavel | varchar(255) | YES | Responsável |
| observacoes | text | YES | Observações |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### sugestoes

Sugestões de moradores para melhorias no condomínio.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| usuario_id | uuid | NO (FK → cadastro) | Isolamento multi-tenant |
| titulo | varchar(255) | NO | Título da sugestão |
| descricao | text | NO | Descrição detalhada |
| categoria | varchar(50) | YES | Categoria |
| observacoes | text | YES | Observações |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### assinaturas

Registro de assinaturas/pagamentos do plano SaaS de cada condomínio.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| cadastro_id | uuid | NO (FK → cadastro) | Usuário vinculado |
| status | text | NO | Status da assinatura |
| mercado_pago_payment_id | text | YES | ID do pagamento no Mercado Pago |
| valor | numeric(10,2) | YES | Valor cobrado |
| data_pagamento | date | YES | Data do pagamento |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

### parceiros

Parceiros indicadores com controle de comissão.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | uuid | NO (PK) | Identificador único |
| nome | text | NO | Nome do parceiro |
| email | text | NO | Email do parceiro |
| codigo_indicacao | text | NO | Código único de indicação |
| comissao_percentual | numeric(5,2) | YES | Percentual de comissão |
| ativo | boolean | YES | Parceiro ativo |
| created_at | timestamptz | YES | Data de criação |
| updated_at | timestamptz | YES | Data de atualização |

---

## Convenções

- **PK**: `id` (uuid) em todas as tabelas
- **Multi-tenant**: `usuario_id` (FK → `cadastro.id`) em todas as tabelas de condomínio
- **Timestamps**: `created_at` e `updated_at` com timezone (`timestamptz`)
- **Naming**: snake_case em todas as colunas
- **Migrations**: gerenciadas pelo EF Core — nunca editar migration existente, sempre criar nova
- **Gerenciamento**: Entity Framework Core 8 + Npgsql

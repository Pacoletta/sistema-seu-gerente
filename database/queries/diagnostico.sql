-- ============================================================
-- DIAGNÓSTICO — Queries para debug e operações
-- Use no psql, DBeaver ou qualquer cliente PostgreSQL
-- ============================================================


-- ------------------------------------------------------------
-- USUÁRIOS
-- ------------------------------------------------------------

-- Usuários sem senha_hash (legado, precisam redefinir senha)
SELECT id, email, nome, status, created_at
FROM cadastro
WHERE senha_hash IS NULL OR senha_hash = ''
ORDER BY created_at DESC;

-- Usuários por status
SELECT status, COUNT(*) AS total
FROM cadastro
GROUP BY status
ORDER BY total DESC;

-- Usuários ativos recentes (últimos 30 dias)
SELECT id, email, nome, status, created_at
FROM cadastro
WHERE status = 'ativo'
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;


-- ------------------------------------------------------------
-- PAGAMENTOS
-- ------------------------------------------------------------

-- Pagamentos vencidos (status pendente, data_vencimento no passado)
SELECT
    p.id,
    m.nome  AS morador,
    m.numero AS apartamento,
    p.mes_ano,
    p.valor,
    p.data_vencimento,
    c.email AS condominio
FROM pagamentos p
JOIN moradores m ON m.id = p.morador_id
JOIN cadastro c ON c.id = p.usuario_id
WHERE p.status = 'pendente'
  AND p.data_vencimento < NOW()
ORDER BY p.data_vencimento ASC;

-- Totais por status no mês atual
SELECT
    status,
    COUNT(*)        AS quantidade,
    SUM(valor)      AS total
FROM pagamentos
WHERE mes_ano = TO_CHAR(NOW(), 'YYYY-MM')
GROUP BY status;

-- Histórico de pagamentos de um morador (substitua o UUID)
-- SELECT * FROM pagamentos WHERE morador_id = '<UUID>' ORDER BY mes_ano DESC;


-- ------------------------------------------------------------
-- ASSINATURAS
-- ------------------------------------------------------------

-- Assinaturas vencidas (data_vencimento ultrapassada e status ativo)
SELECT
    a.id,
    c.email,
    c.nome,
    a.plano,
    a.valor,
    a.data_vencimento,
    a.status
FROM assinaturas a
JOIN cadastro c ON c.id = a.cadastro_id
WHERE a.status = 'ativo'
  AND a.data_vencimento < NOW()
ORDER BY a.data_vencimento ASC;

-- Assinaturas por status
SELECT status, COUNT(*) AS total, SUM(valor) AS receita_mensal
FROM assinaturas
GROUP BY status;


-- ------------------------------------------------------------
-- COBRANÇAS (PIX Mercado Pago)
-- ------------------------------------------------------------

-- Cobranças geradas hoje
SELECT
    c.email,
    c.nome,
    c.status          AS status_cadastro,
    c.mercadopago_payment_id AS payment_id,
    c.updated_at
FROM cadastro c
WHERE DATE(c.updated_at AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE
  AND c.mercadopago_payment_id IS NOT NULL
ORDER BY c.updated_at DESC;


-- ------------------------------------------------------------
-- PARCEIROS
-- ------------------------------------------------------------

-- Parceiros ativos com saldo disponível
SELECT nome, email, codigo_indicacao, saldo_disponivel, total_indicacoes, indicacoes_ativas
FROM parceiros
WHERE ativo = true AND saldo_disponivel > 0
ORDER BY saldo_disponivel DESC;

-- Indicações por parceiro
SELECT
    p.nome     AS parceiro,
    p.codigo_indicacao,
    COUNT(i.id) AS total_indicacoes,
    COUNT(CASE WHEN i.status = 'convertido' THEN 1 END) AS convertidas,
    SUM(i.comissao) AS comissao_total
FROM parceiros p
LEFT JOIN indicacoes i ON i.parceiro_id = p.id
GROUP BY p.id, p.nome, p.codigo_indicacao
ORDER BY total_indicacoes DESC;

-- Saques pendentes de parceiros
SELECT
    sp.id,
    p.nome AS parceiro,
    sp.valor,
    sp.data_solicitacao,
    sp.metodo_pagamento,
    sp.dados_pagamento
FROM saques_parceiros sp
JOIN parceiros p ON p.id = sp.parceiro_id
WHERE sp.status = 'pendente'
ORDER BY sp.data_solicitacao ASC;


-- ------------------------------------------------------------
-- LOGS DO SISTEMA
-- ------------------------------------------------------------

-- Erros recentes
SELECT data, nivel, categoria, mensagem, email
FROM logs_sistema
WHERE nivel IN ('Error', 'Critical')
ORDER BY data DESC
LIMIT 50;

-- Erros das últimas 24h por categoria
SELECT categoria, COUNT(*) AS total
FROM logs_sistema
WHERE nivel IN ('Error', 'Critical')
  AND data >= NOW() - INTERVAL '24 hours'
GROUP BY categoria
ORDER BY total DESC;


-- ------------------------------------------------------------
-- VISÃO GERAL DO BANCO
-- ------------------------------------------------------------

-- Contagem de registros por tabela
SELECT
    'cadastro'           AS tabela, COUNT(*) FROM cadastro         UNION ALL
SELECT 'moradores',                           COUNT(*) FROM moradores         UNION ALL
SELECT 'despesas',                            COUNT(*) FROM despesas          UNION ALL
SELECT 'pagamentos',                          COUNT(*) FROM pagamentos        UNION ALL
SELECT 'receitas',                            COUNT(*) FROM receitas          UNION ALL
SELECT 'configuracao',                        COUNT(*) FROM configuracao      UNION ALL
SELECT 'assinaturas',                         COUNT(*) FROM assinaturas       UNION ALL
SELECT 'parceiros',                           COUNT(*) FROM parceiros         UNION ALL
SELECT 'indicacoes',                          COUNT(*) FROM indicacoes        UNION ALL
SELECT 'administrativo',                      COUNT(*) FROM administrativo    UNION ALL
SELECT 'logs_sistema',                        COUNT(*) FROM logs_sistema
ORDER BY tabela;

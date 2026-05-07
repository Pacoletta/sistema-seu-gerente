-- ============================================================
-- ADMIN — Queries do painel administrativo
-- Dados para dashboards, relatórios e operações do superadmin
-- ============================================================


-- ------------------------------------------------------------
-- DASHBOARD RESUMO
-- ------------------------------------------------------------

-- KPIs principais do sistema
SELECT
    (SELECT COUNT(*) FROM cadastro WHERE status = 'ativo')    AS usuarios_ativos,
    (SELECT COUNT(*) FROM cadastro WHERE status = 'pendente') AS usuarios_pendentes,
    (SELECT COUNT(*) FROM cadastro WHERE status = 'inativo')  AS usuarios_inativos,
    (SELECT COUNT(*) FROM assinaturas WHERE status = 'ativo') AS assinaturas_ativas,
    (SELECT SUM(valor) FROM assinaturas WHERE status = 'ativo') AS mrr,
    (SELECT COUNT(*) FROM parceiros WHERE ativo = true)       AS parceiros_ativos;

-- Novos cadastros por mês (últimos 6 meses)
SELECT
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS mes,
    COUNT(*) AS novos_usuarios
FROM cadastro
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes;


-- ------------------------------------------------------------
-- GESTÃO DE USUÁRIOS
-- ------------------------------------------------------------

-- Listagem completa com status de assinatura
SELECT
    c.id,
    c.email,
    c.nome,
    c.nome_condominio,
    c.quantidade_apartamentos,
    c.status,
    a.plano,
    a.valor        AS valor_assinatura,
    a.data_vencimento,
    a.status       AS status_assinatura,
    c.created_at
FROM cadastro c
LEFT JOIN assinaturas a ON a.cadastro_id = c.id AND a.status = 'ativo'
ORDER BY c.created_at DESC;

-- Usuários ativos há mais de 30 dias sem nenhuma despesa lançada
SELECT c.id, c.email, c.nome, c.created_at
FROM cadastro c
WHERE c.status = 'ativo'
  AND NOT EXISTS (
      SELECT 1 FROM despesas d WHERE d.usuario_id = c.id
  )
  AND c.created_at < NOW() - INTERVAL '30 days'
ORDER BY c.created_at;

-- Atividade por usuário (contagem de moradores e despesas)
SELECT
    c.email,
    c.nome,
    c.status,
    COUNT(DISTINCT m.id) AS moradores,
    COUNT(DISTINCT d.id) AS despesas,
    COUNT(DISTINCT p.id) AS pagamentos,
    c.created_at
FROM cadastro c
LEFT JOIN moradores m ON m.usuario_id = c.id
LEFT JOIN despesas  d ON d.usuario_id = c.id
LEFT JOIN pagamentos p ON p.usuario_id = c.id
GROUP BY c.id, c.email, c.nome, c.status, c.created_at
ORDER BY c.created_at DESC;


-- ------------------------------------------------------------
-- RECEITA DO SISTEMA
-- ------------------------------------------------------------

-- MRR atual (receita mensal recorrente)
SELECT
    plano,
    COUNT(*)   AS assinantes,
    SUM(valor) AS receita_mensal
FROM assinaturas
WHERE status = 'ativo'
GROUP BY plano;

-- Receita por mês (histórico de assinaturas pagas)
SELECT
    TO_CHAR(DATE_TRUNC('month', data_inicio), 'YYYY-MM') AS mes,
    COUNT(*) AS novas_assinaturas,
    SUM(valor) AS receita
FROM assinaturas
WHERE status IN ('ativo', 'cancelado')
GROUP BY DATE_TRUNC('month', data_inicio)
ORDER BY mes DESC
LIMIT 12;

-- Despesas do sistema (custos operacionais)
SELECT
    categoria,
    SUM(valor) AS total,
    COUNT(*) AS lancamentos
FROM despesas_sistema
WHERE EXTRACT(YEAR FROM data_lancamento) = EXTRACT(YEAR FROM NOW())
GROUP BY categoria
ORDER BY total DESC;


-- ------------------------------------------------------------
-- PROGRAMA DE PARCEIROS
-- ------------------------------------------------------------

-- Ranking de parceiros por conversões
SELECT
    p.nome,
    p.email,
    p.codigo_indicacao,
    p.indicacoes_ativas,
    p.total_indicacoes,
    p.total_ganhos,
    p.saldo_disponivel,
    p.saldo_pendente
FROM parceiros p
WHERE p.ativo = true
ORDER BY p.total_indicacoes DESC;

-- Comissões a pagar (saques aprovados aguardando pagamento)
SELECT
    sp.id,
    par.nome     AS parceiro,
    par.chave_pix,
    sp.valor,
    sp.data_solicitacao,
    sp.metodo_pagamento
FROM saques_parceiros sp
JOIN parceiros par ON par.id = sp.parceiro_id
WHERE sp.status = 'aprovado'
ORDER BY sp.data_solicitacao ASC;

-- Taxa de conversão por parceiro
SELECT
    p.nome,
    p.codigo_indicacao,
    COUNT(i.id)                                                  AS total_indicacoes,
    COUNT(CASE WHEN i.status = 'convertido' THEN 1 END)         AS convertidas,
    ROUND(
        COUNT(CASE WHEN i.status = 'convertido' THEN 1 END)::numeric
        / NULLIF(COUNT(i.id), 0) * 100, 1
    ) AS taxa_conversao_pct
FROM parceiros p
LEFT JOIN indicacoes i ON i.parceiro_id = p.id
GROUP BY p.id, p.nome, p.codigo_indicacao
ORDER BY taxa_conversao_pct DESC NULLS LAST;


-- ------------------------------------------------------------
-- OPERAÇÕES — Ações administrativas manuais
-- CUIDADO: queries de UPDATE/DELETE — revise antes de executar
-- ------------------------------------------------------------

-- Ativar usuário manualmente (substitua o email)
-- UPDATE cadastro SET status = 'ativo', updated_at = NOW()
-- WHERE email = 'email@exemplo.com';

-- Inativar usuário manualmente
-- UPDATE cadastro SET status = 'inativo', updated_at = NOW()
-- WHERE email = 'email@exemplo.com';

-- Registrar assinatura manualmente após pagamento confirmado
-- INSERT INTO assinaturas (id, cadastro_id, plano, valor, status, data_inicio, data_vencimento, forma_pagamento, created_at)
-- SELECT gen_random_uuid(), id, 'Básico', 29.90, 'ativo', NOW(), NOW() + INTERVAL '30 days', 'manual', NOW()
-- FROM cadastro WHERE email = 'email@exemplo.com';

-- Aprovar saque de parceiro
-- UPDATE saques_parceiros SET status = 'pago', data_pagamento = NOW(), updated_at = NOW()
-- WHERE id = '<UUID>';

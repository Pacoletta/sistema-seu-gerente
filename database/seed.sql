-- ============================================================
-- SEED — Dados iniciais obrigatórios
-- Execute UMA VEZ após aplicar as migrations:
--   dotnet ef database update --project ../SeuGerente.Infrastructure
-- ============================================================

-- ============================================================
-- 1. ADMIN PADRÃO DO SISTEMA
-- Gere o senha_hash com BCrypt antes de inserir:
--   Em C#: BCrypt.Net.BCrypt.HashPassword("SuaSenhaAqui")
--   Online: https://bcrypt.online (work factor 10)
--
-- Substitua <BCRYPT_HASH_AQUI> pelo hash gerado.
-- ============================================================
INSERT INTO administrativo (id, email, nome, senha_hash, ativo, created_at)
VALUES (
    gen_random_uuid(),
    'admin@sistemaseugerente.com.br',
    'Administrador',
    '<BCRYPT_HASH_AQUI>',
    true,
    NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. CONFIGURAÇÕES GLOBAIS DO SISTEMA
-- Valores usados pelo painel admin e jobs
-- ============================================================
INSERT INTO configuracao_sistema (id, chave, valor, descricao, created_at)
VALUES
    (gen_random_uuid(), 'plano_valor', '29.90',    'Valor mensal da assinatura SaaS',          NOW()),
    (gen_random_uuid(), 'plano_nome',  'Básico',   'Nome do plano atual',                       NOW()),
    (gen_random_uuid(), 'trial_dias',  '7',         'Dias de trial para novos cadastros',        NOW())
ON CONFLICT (chave) DO NOTHING;

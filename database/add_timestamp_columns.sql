-- Adiciona colunas created_at e updated_at nas tabelas existentes que não as possuem
-- Execute no PostgreSQL via psql ou ferramenta de admin

ALTER TABLE moradores
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;

ALTER TABLE despesas
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;

ALTER TABLE pagamentos
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;

ALTER TABLE configuracao
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;

-- Verificar resultado
SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('moradores', 'despesas', 'pagamentos', 'configuracao')
    AND column_name IN ('created_at', 'updated_at')
ORDER BY table_name, column_name;

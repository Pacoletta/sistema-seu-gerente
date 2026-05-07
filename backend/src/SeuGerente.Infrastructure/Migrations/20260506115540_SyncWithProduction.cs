using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncWithProduction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Usa IF NOT EXISTS para ser idempotente: funciona em dev (local) e em produção
            // onde muitas dessas colunas/tabelas já existem

            migrationBuilder.Sql("ALTER TABLE moradores ADD COLUMN IF NOT EXISTS whatsapp text;");
            migrationBuilder.Sql("ALTER TABLE pagamentos ADD COLUMN IF NOT EXISTS morador_nome text;");
            migrationBuilder.Sql("ALTER TABLE pagamentos ADD COLUMN IF NOT EXISTS morador_email text;");
            migrationBuilder.Sql("ALTER TABLE pagamentos ADD COLUMN IF NOT EXISTS morador_numero text;");
            migrationBuilder.Sql("ALTER TABLE despesas ADD COLUMN IF NOT EXISTS melhoria_titulo text;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS valor_pago numeric;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS status_pagamento character varying DEFAULT 'pendente';");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS data_pagamento date;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS dias_atraso integer DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS ultima_notificacao_atraso timestamp without time zone;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS cliente_nome text;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS cliente_email text;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS cliente_whatsapp text;");
            migrationBuilder.Sql("ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS nome_condominio text;");

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS reservas (
                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                    espaco text NOT NULL,
                    morador text NOT NULL,
                    data_reserva text NOT NULL,
                    hora_inicio text NOT NULL,
                    hora_fim text NOT NULL,
                    status text NOT NULL DEFAULT 'pendente',
                    observacoes text,
                    usuario_id uuid NOT NULL,
                    created_at timestamp with time zone DEFAULT now(),
                    updated_at timestamp with time zone DEFAULT now(),
                    CONSTRAINT ""PK_reservas"" PRIMARY KEY (id)
                );
                CREATE INDEX IF NOT EXISTS ""IX_reservas_usuario_id"" ON reservas (usuario_id);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE moradores DROP COLUMN IF EXISTS whatsapp;");
            migrationBuilder.Sql("ALTER TABLE pagamentos DROP COLUMN IF EXISTS morador_nome;");
            migrationBuilder.Sql("ALTER TABLE pagamentos DROP COLUMN IF EXISTS morador_email;");
            migrationBuilder.Sql("ALTER TABLE pagamentos DROP COLUMN IF EXISTS morador_numero;");
            migrationBuilder.Sql("ALTER TABLE despesas DROP COLUMN IF EXISTS melhoria_titulo;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS valor_pago;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS status_pagamento;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS data_pagamento;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS dias_atraso;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS ultima_notificacao_atraso;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS cliente_nome;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS cliente_email;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS cliente_whatsapp;");
            migrationBuilder.Sql("ALTER TABLE assinaturas DROP COLUMN IF EXISTS nome_condominio;");
            migrationBuilder.DropTable(name: "reservas");
        }
    }
}

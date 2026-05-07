using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEnvioAutomaticoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_configuracoes",
                table: "configuracoes");

            migrationBuilder.DropColumn(
                name: "whatsapp",
                table: "moradores");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "configuracoes");

            migrationBuilder.DropColumn(
                name: "envio_automatico",
                table: "configuracoes");

            migrationBuilder.DropColumn(
                name: "gmail_app_password",
                table: "configuracoes");

            migrationBuilder.DropColumn(
                name: "gmail_email",
                table: "configuracoes");

            migrationBuilder.RenameTable(
                name: "configuracoes",
                newName: "configuracao");

            migrationBuilder.RenameColumn(
                name: "valores_por_ap",
                table: "despesas",
                newName: "valoresporap");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "configuracao",
                newName: "criado_em");

            migrationBuilder.RenameIndex(
                name: "IX_configuracoes_usuario_id",
                table: "configuracao",
                newName: "IX_configuracao_usuario_id");

            migrationBuilder.AlterColumn<decimal>(
                name: "valor",
                table: "pagamentos",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "url_comprovante",
                table: "pagamentos",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "pagamentos",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<Guid>(
                name: "morador_id",
                table: "pagamentos",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "mes_ano",
                table: "pagamentos",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(7)",
                oldMaxLength: 7);

            migrationBuilder.AlterColumn<string>(
                name: "mercado_pago_id",
                table: "pagamentos",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "pagamentos",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<decimal>(
                name: "caixinha",
                table: "pagamentos",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "usuario_id",
                table: "moradores",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "telefone",
                table: "moradores",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "numero",
                table: "moradores",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "nome",
                table: "moradores",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "moradores",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "moradores",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<string>(
                name: "tipo",
                table: "moradores",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<decimal>(
                name: "valor",
                table: "despesas",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "descricao",
                table: "despesas",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "despesas",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "categoria",
                table: "despesas",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<decimal[]>(
                name: "valoresporap",
                table: "despesas",
                type: "numeric[]",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "comprovanteurl",
                table: "despesas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "enviado",
                table: "despesas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "melhoria_id",
                table: "despesas",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "origem",
                table: "despesas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "despesas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tipo_divisao",
                table: "despesas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "whatsapp",
                table: "configuracao",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "atualizado_em",
                table: "configuracao",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "dia_envio_cobranca",
                table: "configuracao",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "dia_envio_relatorio",
                table: "configuracao",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "configuracao",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "envio_automatico_ativo",
                table: "configuracao",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "hora_envio_cobranca",
                table: "configuracao",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "hora_envio_relatorio",
                table: "configuracao",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "nome",
                table: "configuracao",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_configuracao",
                table: "configuracao",
                column: "id");

            migrationBuilder.CreateTable(
                name: "cadastro",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    nome = table.Column<string>(type: "text", nullable: true),
                    cnpj_cpf = table.Column<string>(type: "text", nullable: true),
                    whatsapp = table.Column<string>(type: "text", nullable: true),
                    nome_condominio = table.Column<string>(type: "text", nullable: true),
                    quantidade_apartamentos = table.Column<int>(type: "integer", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    mercadopago_payment_id = table.Column<string>(type: "text", nullable: true),
                    mercadopago_preference_id = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cadastro", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "configuracao_email",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email_remetente = table.Column<string>(type: "text", nullable: true),
                    senha_app = table.Column<string>(type: "text", nullable: true),
                    ativo = table.Column<bool>(type: "boolean", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_configuracao_email", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "melhorias",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    titulo = table.Column<string>(type: "text", nullable: false),
                    descricao = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    prioridade = table.Column<string>(type: "text", nullable: false),
                    categoria = table.Column<string>(type: "text", nullable: false),
                    custo_estimado = table.Column<decimal>(type: "numeric", nullable: true),
                    custo_real = table.Column<decimal>(type: "numeric", nullable: true),
                    data_inicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data_fim_prevista = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data_fim_real = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    responsavel = table.Column<string>(type: "text", nullable: true),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    observacoes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_melhorias", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "receitas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    data = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    descricao = table.Column<string>(type: "text", nullable: false),
                    categoria = table.Column<string>(type: "text", nullable: true),
                    valor = table.Column<decimal>(type: "numeric", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_receitas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sugestoes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    titulo = table.Column<string>(type: "text", nullable: false),
                    descricao = table.Column<string>(type: "text", nullable: false),
                    categoria = table.Column<string>(type: "text", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    observacoes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sugestoes", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_cadastro_email",
                table: "cadastro",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_configuracao_email_usuario_id",
                table: "configuracao_email",
                column: "usuario_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_melhorias_usuario_id",
                table: "melhorias",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_receitas_usuario_id",
                table: "receitas",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_sugestoes_usuario_id",
                table: "sugestoes",
                column: "usuario_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cadastro");

            migrationBuilder.DropTable(
                name: "configuracao_email");

            migrationBuilder.DropTable(
                name: "melhorias");

            migrationBuilder.DropTable(
                name: "receitas");

            migrationBuilder.DropTable(
                name: "sugestoes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_configuracao",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "tipo",
                table: "moradores");

            migrationBuilder.DropColumn(
                name: "comprovanteurl",
                table: "despesas");

            migrationBuilder.DropColumn(
                name: "enviado",
                table: "despesas");

            migrationBuilder.DropColumn(
                name: "melhoria_id",
                table: "despesas");

            migrationBuilder.DropColumn(
                name: "origem",
                table: "despesas");

            migrationBuilder.DropColumn(
                name: "status",
                table: "despesas");

            migrationBuilder.DropColumn(
                name: "tipo_divisao",
                table: "despesas");

            migrationBuilder.DropColumn(
                name: "atualizado_em",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "dia_envio_cobranca",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "dia_envio_relatorio",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "email",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "envio_automatico_ativo",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "hora_envio_cobranca",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "hora_envio_relatorio",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "nome",
                table: "configuracao");

            migrationBuilder.RenameTable(
                name: "configuracao",
                newName: "configuracoes");

            migrationBuilder.RenameColumn(
                name: "valoresporap",
                table: "despesas",
                newName: "valores_por_ap");

            migrationBuilder.RenameColumn(
                name: "criado_em",
                table: "configuracoes",
                newName: "updated_at");

            migrationBuilder.RenameIndex(
                name: "IX_configuracao_usuario_id",
                table: "configuracoes",
                newName: "IX_configuracoes_usuario_id");

            migrationBuilder.AlterColumn<decimal>(
                name: "valor",
                table: "pagamentos",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "url_comprovante",
                table: "pagamentos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "status",
                table: "pagamentos",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<Guid>(
                name: "morador_id",
                table: "pagamentos",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "mes_ano",
                table: "pagamentos",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "mercado_pago_id",
                table: "pagamentos",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "pagamentos",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "caixinha",
                table: "pagamentos",
                type: "numeric(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "usuario_id",
                table: "moradores",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "telefone",
                table: "moradores",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "numero",
                table: "moradores",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "nome",
                table: "moradores",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "moradores",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "moradores",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "whatsapp",
                table: "moradores",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "valor",
                table: "despesas",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "descricao",
                table: "despesas",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "despesas",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "categoria",
                table: "despesas",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "valores_por_ap",
                table: "despesas",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(decimal[]),
                oldType: "numeric[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "whatsapp",
                table: "configuracoes",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "configuracoes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "envio_automatico",
                table: "configuracoes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "gmail_app_password",
                table: "configuracoes",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "gmail_email",
                table: "configuracoes",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_configuracoes",
                table: "configuracoes",
                column: "id");
        }
    }
}

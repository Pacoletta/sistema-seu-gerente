using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "configuracoes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    mensagem_relatorio = table.Column<string>(type: "text", nullable: true),
                    mensagem_cobranca = table.Column<string>(type: "text", nullable: true),
                    whatsapp = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    envio_automatico = table.Column<bool>(type: "boolean", nullable: false),
                    gmail_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gmail_app_password = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_configuracoes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "despesas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    data = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    categoria = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    valor = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    valores_por_ap = table.Column<string>(type: "jsonb", nullable: true),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_despesas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "moradores",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    numero = table.Column<int>(type: "integer", nullable: false),
                    nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    whatsapp = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_moradores", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pagamentos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    morador_id = table.Column<Guid>(type: "uuid", nullable: false),
                    mes_ano = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    valor = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    caixinha = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    data_pagamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data_vencimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    url_comprovante = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    mercado_pago_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pagamentos", x => x.id);
                    table.ForeignKey(
                        name: "FK_pagamentos_moradores_morador_id",
                        column: x => x.morador_id,
                        principalTable: "moradores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_configuracoes_usuario_id",
                table: "configuracoes",
                column: "usuario_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_despesas_usuario_id",
                table: "despesas",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_moradores_usuario_id",
                table: "moradores",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_pagamentos_mes_ano",
                table: "pagamentos",
                column: "mes_ano");

            migrationBuilder.CreateIndex(
                name: "IX_pagamentos_morador_id",
                table: "pagamentos",
                column: "morador_id");

            migrationBuilder.CreateIndex(
                name: "IX_pagamentos_usuario_id",
                table: "pagamentos",
                column: "usuario_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "configuracoes");

            migrationBuilder.DropTable(
                name: "despesas");

            migrationBuilder.DropTable(
                name: "pagamentos");

            migrationBuilder.DropTable(
                name: "moradores");
        }
    }
}

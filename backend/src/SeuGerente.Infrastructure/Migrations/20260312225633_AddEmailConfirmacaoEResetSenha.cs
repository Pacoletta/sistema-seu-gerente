using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailConfirmacaoEResetSenha : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "senha_hash",
                table: "cadastro",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "email_confirmado",
                table: "cadastro",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "token_confirmacao_email",
                table: "cadastro",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "token_confirmacao_expira_em",
                table: "cadastro",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "token_reset_senha",
                table: "cadastro",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "token_reset_senha_expira_em",
                table: "cadastro",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "senha_hash", table: "cadastro");
            migrationBuilder.DropColumn(name: "email_confirmado", table: "cadastro");
            migrationBuilder.DropColumn(name: "token_confirmacao_email", table: "cadastro");
            migrationBuilder.DropColumn(name: "token_confirmacao_expira_em", table: "cadastro");
            migrationBuilder.DropColumn(name: "token_reset_senha", table: "cadastro");
            migrationBuilder.DropColumn(name: "token_reset_senha_expira_em", table: "cadastro");
        }
    }
}

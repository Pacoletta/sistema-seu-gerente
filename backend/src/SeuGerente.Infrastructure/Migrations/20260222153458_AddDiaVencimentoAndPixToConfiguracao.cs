using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDiaVencimentoAndPixToConfiguracao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "dia_vencimento",
                table: "configuracao",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pix_cobranca",
                table: "configuracao",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dia_vencimento",
                table: "configuracao");

            migrationBuilder.DropColumn(
                name: "pix_cobranca",
                table: "configuracao");
        }
    }
}

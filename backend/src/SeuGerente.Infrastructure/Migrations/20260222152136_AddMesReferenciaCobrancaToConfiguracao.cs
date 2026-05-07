using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMesReferenciaCobrancaToConfiguracao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "mes_referencia_cobranca",
                table: "configuracao",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "mes_referencia_cobranca",
                table: "configuracao");
        }
    }
}

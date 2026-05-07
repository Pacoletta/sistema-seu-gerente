using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPixNomeBeneficiarioToConfiguracao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "pix_nome_beneficiario",
                table: "configuracao",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "pix_nome_beneficiario",
                table: "configuracao");
        }
    }
}

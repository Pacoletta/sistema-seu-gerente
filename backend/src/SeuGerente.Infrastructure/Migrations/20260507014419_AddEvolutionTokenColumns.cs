using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuGerente.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEvolutionTokenColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "evolution_instance_id",
                table: "whatsapp_instancias",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "evolution_token",
                table: "whatsapp_instancias",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "evolution_instance_id",
                table: "whatsapp_instancias");

            migrationBuilder.DropColumn(
                name: "evolution_token",
                table: "whatsapp_instancias");
        }
    }
}

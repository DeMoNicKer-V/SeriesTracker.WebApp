using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SeriesTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class categorycolor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "CategoryEntities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 1,
                column: "Color",
                value: "purple");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Color",
                value: "green");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 3,
                column: "Color",
                value: "gold");

            migrationBuilder.InsertData(
                table: "CategoryEntities",
                columns: new[] { "Id", "Color", "Title" },
                values: new object[,]
                {
                    { 4, "cyan", "Отложено" },
                    { 5, "cyan", "Брошено" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "Color",
                table: "CategoryEntities");
        }
    }
}

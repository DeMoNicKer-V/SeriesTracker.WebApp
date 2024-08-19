using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeriesTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class categoryupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "CategoryEntities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrevColor",
                table: "CategoryEntities",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Color", "Date", "PrevColor" },
                values: new object[] { "#6DBA91", "2024-08-19T14:12:44", null });

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Color", "Date", "PrevColor" },
                values: new object[] { "#4DA8DA", "2024-08-19T14:12:44", null });

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Color", "Date", "PrevColor" },
                values: new object[] { "#F9A602", "2024-08-19T14:12:44", null });

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Color", "Date", "PrevColor" },
                values: new object[] { "#999999", "2024-08-19T14:12:44", null });

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Color", "Date", "PrevColor" },
                values: new object[] { "#E74C3C", "2024-08-19T14:12:44", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "CategoryEntities");

            migrationBuilder.DropColumn(
                name: "PrevColor",
                table: "CategoryEntities");

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

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4,
                column: "Color",
                value: "cyan");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5,
                column: "Color",
                value: "cyan");
        }
    }
}

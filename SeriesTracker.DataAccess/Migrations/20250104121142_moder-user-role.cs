using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SeriesTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class moderuserrole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: "2025-01-04T15:11:42");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: "2025-01-04T15:11:42");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: "2025-01-04T15:11:42");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: "2025-01-04T15:11:42");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: "2025-01-04T15:11:42");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: "2025-01-04T15:11:42");

            migrationBuilder.UpdateData(
                table: "RoleEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Moder");

            migrationBuilder.InsertData(
                table: "RoleEntities",
                columns: new[] { "Id", "Name" },
                values: new object[] { 3, "User" });

            migrationBuilder.InsertData(
                table: "RolePermissionEntity",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { 2, 2 },
                    { 3, 2 },
                    { 4, 3 },
                    { 5, 3 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissionEntity",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 2, 2 });

            migrationBuilder.DeleteData(
                table: "RolePermissionEntity",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 3, 2 });

            migrationBuilder.DeleteData(
                table: "RolePermissionEntity",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 4, 3 });

            migrationBuilder.DeleteData(
                table: "RolePermissionEntity",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 5, 3 });

            migrationBuilder.DeleteData(
                table: "RoleEntities",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: "2025-01-04T14:58:18");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: "2025-01-04T14:58:18");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: "2025-01-04T14:58:18");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: "2025-01-04T14:58:18");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: "2025-01-04T14:58:18");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: "2025-01-04T14:58:18");

            migrationBuilder.UpdateData(
                table: "RoleEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "User");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SeriesTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class newentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccessLevelEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessLevelEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserEntities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Avatar = table.Column<string>(type: "text", nullable: true),
                    DateOfBirth = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    RegistrationDate = table.Column<string>(type: "text", nullable: false),
                    Surname = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "text", nullable: false),
                    UserRoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoleEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AccessLevelId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoleEntities", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AccessLevelEntities",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Полный доступ ко всем функциям приложения", "Полный" },
                    { 2, "Ограниченный доступ ко всем функциям приложения", "Ограниченный" },
                    { 3, "Доступ к базовым функциям приложения. Доступен всем по умолчанию", "Пользовательский" }
                });

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: "2024-09-02T18:41:45");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: "2024-09-02T18:41:45");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: "2024-09-02T18:41:45");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: "2024-09-02T18:41:45");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: "2024-09-02T18:41:45");

            migrationBuilder.InsertData(
                table: "UserRoleEntities",
                columns: new[] { "Id", "AccessLevelId", "Name" },
                values: new object[,]
                {
                    { 1, 1, "Администратор" },
                    { 2, 2, "Модератор" },
                    { 3, 3, "Пользователь" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessLevelEntities");

            migrationBuilder.DropTable(
                name: "UserEntities");

            migrationBuilder.DropTable(
                name: "UserRoleEntities");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: "2024-08-19T14:12:44");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: "2024-08-19T14:12:44");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: "2024-08-19T14:12:44");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: "2024-08-19T14:12:44");

            migrationBuilder.UpdateData(
                table: "CategoryEntities",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: "2024-08-19T14:12:44");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeriesTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class edit_all_tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissionEntity_PermissionEntity_PermissionId",
                table: "RolePermissionEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissionEntity_RoleEntities_RoleId",
                table: "RolePermissionEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoleEntity_RoleEntities_RoleId",
                table: "UserRoleEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoleEntity_UserEntities_UserId",
                table: "UserRoleEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSeriesEntities_CategoryEntities_CategoryId",
                table: "UserSeriesEntities");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSeriesEntities_UserEntities_UserId",
                table: "UserSeriesEntities");

            migrationBuilder.DropTable(
                name: "SeriesEntities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSeriesEntities",
                table: "UserSeriesEntities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoleEntity",
                table: "UserRoleEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEntities",
                table: "UserEntities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RolePermissionEntity",
                table: "RolePermissionEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoleEntities",
                table: "RoleEntities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PermissionEntity",
                table: "PermissionEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CategoryEntities",
                table: "CategoryEntities");

            migrationBuilder.RenameTable(
                name: "UserSeriesEntities",
                newName: "UserSeries");

            migrationBuilder.RenameTable(
                name: "UserRoleEntity",
                newName: "UserRoles");

            migrationBuilder.RenameTable(
                name: "UserEntities",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "RolePermissionEntity",
                newName: "RolePermissions");

            migrationBuilder.RenameTable(
                name: "RoleEntities",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "PermissionEntity",
                newName: "Permissions");

            migrationBuilder.RenameTable(
                name: "CategoryEntities",
                newName: "Categories");

            migrationBuilder.RenameColumn(
                name: "WatchedEpisode",
                table: "UserSeries",
                newName: "WatchedEpisodes");

            migrationBuilder.RenameIndex(
                name: "IX_UserSeriesEntities_CategoryId",
                table: "UserSeries",
                newName: "IX_UserSeries_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoleEntity_UserId",
                table: "UserRoles",
                newName: "IX_UserRoles_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_RolePermissionEntity_PermissionId",
                table: "RolePermissions",
                newName: "IX_RolePermissions_PermissionId");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "SurName",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Roles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Permissions",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "PrevColor",
                table: "Categories",
                type: "character varying(7)",
                maxLength: 7,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Categories",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSeries",
                table: "UserSeries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions",
                columns: new[] { "RoleId", "PermissionId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                table: "Roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Date",
                value: "2025-04-18T20:15:52");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Date",
                value: "2025-04-18T20:15:52");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                column: "Date",
                value: "2025-04-18T20:15:52");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                column: "Date",
                value: "2025-04-18T20:15:52");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5,
                column: "Date",
                value: "2025-04-18T20:15:52");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6,
                column: "Date",
                value: "2025-04-18T20:15:52");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Delete");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Update");

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[] { 3, 3 });

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Roles_RoleId",
                table: "RolePermissions",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Users_UserId",
                table: "UserRoles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSeries_Categories_CategoryId",
                table: "UserSeries",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSeries_Users_UserId",
                table: "UserSeries",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Roles_RoleId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Users_UserId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSeries_Categories_CategoryId",
                table: "UserSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSeries_Users_UserId",
                table: "UserSeries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSeries",
                table: "UserSeries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                table: "Roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 3, 3 });

            migrationBuilder.RenameTable(
                name: "UserSeries",
                newName: "UserSeriesEntities");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "UserEntities");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                newName: "UserRoleEntity");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "RoleEntities");

            migrationBuilder.RenameTable(
                name: "RolePermissions",
                newName: "RolePermissionEntity");

            migrationBuilder.RenameTable(
                name: "Permissions",
                newName: "PermissionEntity");

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "CategoryEntities");

            migrationBuilder.RenameColumn(
                name: "WatchedEpisodes",
                table: "UserSeriesEntities",
                newName: "WatchedEpisode");

            migrationBuilder.RenameIndex(
                name: "IX_UserSeries_CategoryId",
                table: "UserSeriesEntities",
                newName: "IX_UserSeriesEntities_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoleEntity",
                newName: "IX_UserRoleEntity_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissionEntity",
                newName: "IX_RolePermissionEntity_PermissionId");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "UserEntities",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "SurName",
                table: "UserEntities",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "UserEntities",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "UserEntities",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "RoleEntities",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PermissionEntity",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "PrevColor",
                table: "CategoryEntities",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(7)",
                oldMaxLength: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CategoryEntities",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "CategoryEntities",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(7)",
                oldMaxLength: 7);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSeriesEntities",
                table: "UserSeriesEntities",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEntities",
                table: "UserEntities",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoleEntity",
                table: "UserRoleEntity",
                columns: new[] { "RoleId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoleEntities",
                table: "RoleEntities",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RolePermissionEntity",
                table: "RolePermissionEntity",
                columns: new[] { "RoleId", "PermissionId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_PermissionEntity",
                table: "PermissionEntity",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CategoryEntities",
                table: "CategoryEntities",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SeriesEntities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false),
                    AddedDate = table.Column<string>(type: "text", nullable: false),
                    AnimeId = table.Column<int>(type: "integer", nullable: false),
                    ChangedDate = table.Column<string>(type: "text", nullable: false),
                    IsFavorite = table.Column<bool>(type: "boolean", nullable: false),
                    WatchedEpisode = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeriesEntities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SeriesEntities_CategoryEntities_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "CategoryEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                table: "PermissionEntity",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Update");

            migrationBuilder.UpdateData(
                table: "PermissionEntity",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Delete");

            migrationBuilder.CreateIndex(
                name: "IX_SeriesEntities_CategoryId",
                table: "SeriesEntities",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissionEntity_PermissionEntity_PermissionId",
                table: "RolePermissionEntity",
                column: "PermissionId",
                principalTable: "PermissionEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissionEntity_RoleEntities_RoleId",
                table: "RolePermissionEntity",
                column: "RoleId",
                principalTable: "RoleEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoleEntity_RoleEntities_RoleId",
                table: "UserRoleEntity",
                column: "RoleId",
                principalTable: "RoleEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoleEntity_UserEntities_UserId",
                table: "UserRoleEntity",
                column: "UserId",
                principalTable: "UserEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSeriesEntities_CategoryEntities_CategoryId",
                table: "UserSeriesEntities",
                column: "CategoryId",
                principalTable: "CategoryEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserSeriesEntities_UserEntities_UserId",
                table: "UserSeriesEntities",
                column: "UserId",
                principalTable: "UserEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

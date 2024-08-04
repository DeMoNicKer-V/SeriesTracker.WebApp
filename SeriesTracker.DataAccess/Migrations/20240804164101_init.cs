using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeriesTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CategoryEntities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SeriesEntities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnimeId = table.Column<int>(type: "integer", nullable: false),
                    WatchedEpisode = table.Column<int>(type: "integer", nullable: false),
                    AddedDate = table.Column<string>(type: "text", nullable: false),
                    ChangedDate = table.Column<string>(type: "text", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsFavorite = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeriesEntities", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryEntities");

            migrationBuilder.DropTable(
                name: "SeriesEntities");
        }
    }
}

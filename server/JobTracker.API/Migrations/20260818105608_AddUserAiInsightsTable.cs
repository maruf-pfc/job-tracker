using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAiInsightsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserAiInsights",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DataHash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ExecutiveSummary = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    GovtVsCorporateStrategy = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    KeyStrengthsJson = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    CriticalGapsJson = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    ActionPlanJson = table.Column<string>(type: "character varying(15000)", maxLength: 15000, nullable: false),
                    TotalApplicationsAnalyzed = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAiInsights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAiInsights_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAiInsights_UserId_DataHash",
                table: "UserAiInsights",
                columns: new[] { "UserId", "DataHash" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAiInsights");
        }
    }
}

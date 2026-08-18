using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRejectionRetrospectives : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RejectionRetrospectives",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JobApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    JobDomain = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FailedStage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PrimaryRootCause = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SpecificWeaknessTagsJson = table.Column<string>(type: "text", nullable: false),
                    WhatWentWell = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    WhatFailed = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ActionablePlan = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RejectionRetrospectives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RejectionRetrospectives_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RejectionRetrospectives_JobApplications_JobApplicationId",
                        column: x => x.JobApplicationId,
                        principalTable: "JobApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RejectionRetrospectives_JobApplicationId",
                table: "RejectionRetrospectives",
                column: "JobApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RejectionRetrospectives_UserId_CreatedAt",
                table: "RejectionRetrospectives",
                columns: new[] { "UserId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RejectionRetrospectives");
        }
    }
}

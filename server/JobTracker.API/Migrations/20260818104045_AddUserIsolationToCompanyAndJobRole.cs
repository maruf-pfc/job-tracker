using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIsolationToCompanyAndJobRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "WorkTypes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "SourcePlatforms",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Priorities",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "JobTypes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "JobRoles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Companies",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "ApplicationStatuses",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkTypes_UserId",
                table: "WorkTypes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SourcePlatforms_UserId",
                table: "SourcePlatforms",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Priorities_UserId",
                table: "Priorities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_JobTypes_UserId",
                table: "JobTypes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_JobRoles_UserId_Name",
                table: "JobRoles",
                columns: new[] { "UserId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_Companies_UserId_Name",
                table: "Companies",
                columns: new[] { "UserId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationStatuses_UserId",
                table: "ApplicationStatuses",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationStatuses_AspNetUsers_UserId",
                table: "ApplicationStatuses",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_AspNetUsers_UserId",
                table: "Companies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobRoles_AspNetUsers_UserId",
                table: "JobRoles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobTypes_AspNetUsers_UserId",
                table: "JobTypes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Priorities_AspNetUsers_UserId",
                table: "Priorities",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SourcePlatforms_AspNetUsers_UserId",
                table: "SourcePlatforms",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkTypes_AspNetUsers_UserId",
                table: "WorkTypes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationStatuses_AspNetUsers_UserId",
                table: "ApplicationStatuses");

            migrationBuilder.DropForeignKey(
                name: "FK_Companies_AspNetUsers_UserId",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_JobRoles_AspNetUsers_UserId",
                table: "JobRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_JobTypes_AspNetUsers_UserId",
                table: "JobTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Priorities_AspNetUsers_UserId",
                table: "Priorities");

            migrationBuilder.DropForeignKey(
                name: "FK_SourcePlatforms_AspNetUsers_UserId",
                table: "SourcePlatforms");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkTypes_AspNetUsers_UserId",
                table: "WorkTypes");

            migrationBuilder.DropIndex(
                name: "IX_WorkTypes_UserId",
                table: "WorkTypes");

            migrationBuilder.DropIndex(
                name: "IX_SourcePlatforms_UserId",
                table: "SourcePlatforms");

            migrationBuilder.DropIndex(
                name: "IX_Priorities_UserId",
                table: "Priorities");

            migrationBuilder.DropIndex(
                name: "IX_JobTypes_UserId",
                table: "JobTypes");

            migrationBuilder.DropIndex(
                name: "IX_JobRoles_UserId_Name",
                table: "JobRoles");

            migrationBuilder.DropIndex(
                name: "IX_Companies_UserId_Name",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationStatuses_UserId",
                table: "ApplicationStatuses");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "WorkTypes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "SourcePlatforms");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Priorities");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "JobTypes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "JobRoles");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ApplicationStatuses");
        }
    }
}

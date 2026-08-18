using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class ExpandRejectionRetrospectiveSurveyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConfidenceRating",
                table: "RejectionRetrospectives",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DifficultyRating",
                table: "RejectionRetrospectives",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "EstimatedScore",
                table: "RejectionRetrospectives",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ExpectedCutoffScore",
                table: "RejectionRetrospectives",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FeedbackStatus",
                table: "RejectionRetrospectives",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MockCount",
                table: "RejectionRetrospectives",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "NegativeMarksLost",
                table: "RejectionRetrospectives",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreparationTime",
                table: "RejectionRetrospectives",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SurveyDataJson",
                table: "RejectionRetrospectives",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TimePressureRating",
                table: "RejectionRetrospectives",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfidenceRating",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "DifficultyRating",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "EstimatedScore",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "ExpectedCutoffScore",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "FeedbackStatus",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "MockCount",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "NegativeMarksLost",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "PreparationTime",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "SurveyDataJson",
                table: "RejectionRetrospectives");

            migrationBuilder.DropColumn(
                name: "TimePressureRating",
                table: "RejectionRetrospectives");
        }
    }
}

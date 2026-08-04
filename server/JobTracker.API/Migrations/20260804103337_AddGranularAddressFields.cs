using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddGranularAddressFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PermanentDistrict",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentDivision",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentPoliceStation",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentPostCode",
                table: "UserProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentPostOffice",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentUnion",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentUpazila",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermanentVillage",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentArea",
                table: "UserProfiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentDistrict",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentDivision",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentHouse",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentLocation",
                table: "UserProfiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentPoliceStation",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentPostCode",
                table: "UserProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentPostOffice",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PresentUpazila",
                table: "UserProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermanentDistrict",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentDivision",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentPoliceStation",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentPostCode",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentPostOffice",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentUnion",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentUpazila",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PermanentVillage",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentArea",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentDistrict",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentDivision",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentHouse",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentLocation",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentPoliceStation",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentPostCode",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentPostOffice",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "PresentUpazila",
                table: "UserProfiles");
        }
    }
}

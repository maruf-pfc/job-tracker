namespace JobTracker.API.DTOs.Profile;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string NameEnglish { get; set; } = string.Empty;
    public string? NameBangla { get; set; }
    public string? FatherName { get; set; }
    public string? MotherName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Nationality { get; set; }
    public string? Religion { get; set; }
    public string? Gender { get; set; }
    public string? BirthRegistration { get; set; }
    public string? NationalId { get; set; }
    public string? MaritalStatus { get; set; }
    public string? MobileNumber { get; set; }
    public string? Email { get; set; }

    // Present Address
    public string? PresentDivision { get; set; }
    public string? PresentDistrict { get; set; }
    public string? PresentArea { get; set; }
    public string? PresentLocation { get; set; }
    public string? PresentHouse { get; set; }
    public string? PresentUpazila { get; set; }
    public string? PresentPoliceStation { get; set; }
    public string? PresentPostOffice { get; set; }
    public string? PresentPostCode { get; set; }

    // Permanent Address
    public string? PermanentDivision { get; set; }
    public string? PermanentDistrict { get; set; }
    public string? PermanentUpazila { get; set; }
    public string? PermanentUnion { get; set; }
    public string? PermanentVillage { get; set; }
    public string? PermanentPostOffice { get; set; }
    public string? PermanentPoliceStation { get; set; }
    public string? PermanentPostCode { get; set; }

    public string? PresentAddress { get; set; }
    public string? PermanentAddress { get; set; }
    public string? BioSummary { get; set; }
    public string? EducationDetailsJson { get; set; }
    public string? CodingProfilesJson { get; set; }
}

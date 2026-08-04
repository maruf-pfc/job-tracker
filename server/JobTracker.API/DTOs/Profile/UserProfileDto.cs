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
    public string? PresentAddress { get; set; }
    public string? PermanentAddress { get; set; }
    public string? BioSummary { get; set; }
    public string? EducationDetailsJson { get; set; }
    public string? CodingProfilesJson { get; set; }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobTracker.API.Models;

public class UserProfile : BaseEntity
{
    public Guid UserId { get; set; }

    [MaxLength(200)]
    public string NameEnglish { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? NameBangla { get; set; }

    [MaxLength(200)]
    public string? FatherName { get; set; }

    [MaxLength(200)]
    public string? MotherName { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(100)]
    public string? Nationality { get; set; } = "Bangladeshi";

    [MaxLength(100)]
    public string? Religion { get; set; } = "Islam";

    [MaxLength(50)]
    public string? Gender { get; set; } = "Male";

    [MaxLength(100)]
    public string? BirthRegistration { get; set; }

    [MaxLength(100)]
    public string? NationalId { get; set; }

    [MaxLength(50)]
    public string? MaritalStatus { get; set; } = "Single";

    [MaxLength(50)]
    public string? MobileNumber { get; set; }

    [MaxLength(200)]
    public string? Email { get; set; }

    // Present Address Granular Fields
    [MaxLength(100)] public string? PresentDivision { get; set; }
    [MaxLength(100)] public string? PresentDistrict { get; set; }
    [MaxLength(200)] public string? PresentArea { get; set; }
    [MaxLength(200)] public string? PresentLocation { get; set; }
    [MaxLength(100)] public string? PresentHouse { get; set; }
    [MaxLength(100)] public string? PresentUpazila { get; set; }
    [MaxLength(100)] public string? PresentPoliceStation { get; set; }
    [MaxLength(100)] public string? PresentPostOffice { get; set; }
    [MaxLength(50)]  public string? PresentPostCode { get; set; }

    // Permanent Address Granular Fields
    [MaxLength(100)] public string? PermanentDivision { get; set; }
    [MaxLength(100)] public string? PermanentDistrict { get; set; }
    [MaxLength(100)] public string? PermanentUpazila { get; set; }
    [MaxLength(100)] public string? PermanentUnion { get; set; }
    [MaxLength(100)] public string? PermanentVillage { get; set; }
    [MaxLength(100)] public string? PermanentPostOffice { get; set; }
    [MaxLength(100)] public string? PermanentPoliceStation { get; set; }
    [MaxLength(50)]  public string? PermanentPostCode { get; set; }

    [MaxLength(1000)] public string? PresentAddress { get; set; }
    [MaxLength(1000)] public string? PermanentAddress { get; set; }

    [MaxLength(4000)] public string? BioSummary { get; set; }
    [MaxLength(4000)] public string? EducationDetailsJson { get; set; }
    [MaxLength(4000)] public string? CodingProfilesJson { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}

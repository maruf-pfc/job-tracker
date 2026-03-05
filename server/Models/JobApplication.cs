using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class JobApplication
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    // --- Job Info ---
    [Required, MaxLength(255)]
    public string JobTitle { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string CompanyName { get; set; } = string.Empty;

    public string? CompanyLinkedIn { get; set; }
    public string? CompanyWebsite { get; set; }
    public string? CompanyFacebook { get; set; }

    [MaxLength(255)]
    public string? Location { get; set; }

    public WorkType? WorkType { get; set; }
    public JobType? JobType { get; set; }
    public SourcePlatform? SourcePlatform { get; set; }

    public string? PostUrl { get; set; }
    public string? JobDescription { get; set; }

    // Stored as comma-separated or use a JSON column
    public string? RequiredSkillsJson { get; set; }

    [MaxLength(100)]
    public string? ExperienceRequired { get; set; }

    public int? SalaryMin { get; set; }
    public int? SalaryMax { get; set; }

    [MaxLength(10)]
    public string? Currency { get; set; }

    public DateOnly? Deadline { get; set; }

    // --- Application ---
    public bool Applied { get; set; } = false;
    public DateOnly? AppliedDate { get; set; }
    public ApplicationMethod? ApplicationMethod { get; set; }
    public string? CvLink { get; set; }
    public string? CoverLetterLink { get; set; }

    [MaxLength(100)]
    public string? CvVersion { get; set; }

    [MaxLength(255)]
    public string? ReferralPerson { get; set; }

    // --- Follow-up ---
    public DateOnly? FollowUpDate { get; set; }
    public bool FollowUpDone { get; set; } = false;

    // --- Outcome ---
    public JobStatus Status { get; set; } = JobStatus.Saved;
    public int? OfferSalary { get; set; }
    public DateOnly? OfferDeadline { get; set; }
    public string? RejectionReason { get; set; }

    public Priority? Priority { get; set; }

    [Range(1, 5)]
    public int? PersonalRating { get; set; }

    // --- Notes ---
    public string? ShortNote { get; set; }
    public string? CompanyCultureNotes { get; set; }
    public string? RedFlags { get; set; }
    public bool? WouldReapply { get; set; }
    public string? TagsJson { get; set; }

    // --- Timestamps ---
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;

    public ICollection<Interview> Interviews { get; set; } = new List<Interview>();
    public ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobTracker.API.Models;

public class JobApplication : BaseEntity
{
    public Guid CompanyId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Role { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? JobUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? SalaryRange { get; set; }

    [MaxLength(20000)]
    public string? Notes { get; set; }

    [MaxLength(30000)]
    public string? CoverLetter { get; set; }

    [MaxLength(500)]
    public string? ResumeDriveLink { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public bool IsArchived { get; set; }
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public Guid UserId { get; set; }
    public Guid PriorityId { get; set; }
    public Guid JobTypeId { get; set; }
    public Guid SourcePlatformId { get; set; }
    public Guid ApplicationStatusId { get; set; }
    public Guid WorkTypeId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; } = null!;

    [ForeignKey(nameof(PriorityId))]
    public Priority Priority { get; set; } = null!;

    [ForeignKey(nameof(JobTypeId))]
    public JobType JobType { get; set; } = null!;

    [ForeignKey(nameof(SourcePlatformId))]
    public SourcePlatform SourcePlatform { get; set; } = null!;

    [ForeignKey(nameof(ApplicationStatusId))]
    public ApplicationStatus ApplicationStatus { get; set; } = null!;

    [ForeignKey(nameof(WorkTypeId))]
    public WorkType WorkType { get; set; } = null!;
}
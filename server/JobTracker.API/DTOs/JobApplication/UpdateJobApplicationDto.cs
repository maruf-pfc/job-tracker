using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.JobApplication;

public class UpdateJobApplicationDto
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
    public DateTime AppliedAt { get; set; }
    public Guid PriorityId { get; set; }
    public Guid JobTypeId { get; set; }
    public Guid SourcePlatformId { get; set; }
    public Guid ApplicationStatusId { get; set; }
    public Guid WorkTypeId { get; set; }
}
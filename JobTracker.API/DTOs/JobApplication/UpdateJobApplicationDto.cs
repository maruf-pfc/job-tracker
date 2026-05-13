using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.JobApplication;

public class UpdateJobApplicationDto
{
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Role { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? JobUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? SalaryRange { get; set; }

    [MaxLength(5000)]
    public string? Notes { get; set; }

    public DateTime AppliedAt { get; set; }
    public Guid PriorityId { get; set; }
    public Guid JobTypeId { get; set; }
    public Guid SourcePlatformId { get; set; }
    public Guid ApplicationStatusId { get; set; }
    public Guid WorkTypeId { get; set; }
}
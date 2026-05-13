using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.JobApplication;

public class CreateJobApplicationDto
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
        = DateTime.UtcNow;

    [Required]
    public Guid PriorityId { get; set; }

    [Required]
    public Guid JobTypeId { get; set; }

    [Required]
    public Guid SourcePlatformId { get; set; }

    [Required]
    public Guid ApplicationStatusId { get; set; }

    [Required]
    public Guid WorkTypeId { get; set; }
}
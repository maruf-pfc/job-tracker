using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.JobType;

public class CreateJobTypeDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
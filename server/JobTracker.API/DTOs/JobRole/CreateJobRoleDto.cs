using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.JobRole;

public class CreateJobRoleDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.ApplicationStatus;

public class CreateApplicationStatusDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
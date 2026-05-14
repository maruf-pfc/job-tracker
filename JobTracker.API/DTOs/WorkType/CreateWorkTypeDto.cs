using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.WorkType;

public class CreateWorkTypeDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
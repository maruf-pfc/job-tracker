using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.SourcePlatform;

public class CreateSourcePlatformDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
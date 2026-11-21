using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.Company;

public class CreateCompanyDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? CareerPageUrl { get; set; }

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(5000)]
    public string? Notes { get; set; }

    public bool IsFavorite { get; set; }
    public bool IsArchived { get; set; }
    public bool IsRedFlagged { get; set; }

    [MaxLength(500)]
    public string? RedFlagReason { get; set; }
}

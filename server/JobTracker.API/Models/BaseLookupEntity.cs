using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.Models;

public abstract class BaseLookupEntity : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Color { get; set; } = "slate";

    public bool IsActive { get; set; } = true;
}
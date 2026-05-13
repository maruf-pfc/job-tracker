using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.Models;

public class Priority : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Color { get; set; } = "slate";
    
    public bool IsActive { get; set; } = true;
}
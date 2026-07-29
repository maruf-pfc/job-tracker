using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace JobTracker.API.Models;

public class User : IdentityUser<Guid>
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
}
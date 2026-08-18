using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.Models;

public class Company : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? CareerPageUrl { get; set; }

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    [MaxLength(5000)]
    public string? Notes { get; set; }

    public bool IsFavorite { get; set; }
    public bool IsArchived { get; set; }

    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public ICollection<JobApplication> JobApplications = new List<JobApplication>();
}
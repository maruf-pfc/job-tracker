using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class ActivityLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? JobId { get; set; }
    public JobApplication? Job { get; set; }

    [Required, MaxLength(255)]
    public string Action { get; set; } = string.Empty;

    public string? OldValue { get; set; }
    public string? NewValue { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

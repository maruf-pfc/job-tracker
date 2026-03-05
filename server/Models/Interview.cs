using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class Interview
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid JobId { get; set; }
    public JobApplication? Job { get; set; }


    public int RoundNumber { get; set; } = 1;
    public InterviewType InterviewType { get; set; }

    public DateTime? ScheduledAt { get; set; }
    public int? DurationMinutes { get; set; }

    [MaxLength(255)]
    public string? InterviewerName { get; set; }

    [MaxLength(255)]
    public string? InterviewerLinkedIn { get; set; }

    // e.g. ["DSA", "System Design", "HR"]
    public string? TopicsJson { get; set; }

    public InterviewOutcome Outcome { get; set; } = InterviewOutcome.Waiting;

    public string? TaskLink { get; set; }
    public string? SubmissionLink { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobTracker.API.Models;

public enum InterviewResult
{
    Pending,
    Passed,
    Failed,
    Cancelled
}

public class InterviewRound : BaseEntity
{
    public Guid JobApplicationId { get; set; }

    [Required]
    [MaxLength(100)]
    public string RoundName { get; set; } = string.Empty;

    public DateTime RoundDate { get; set; }

    [MaxLength(5000)]
    public string? Experience { get; set; }

    public InterviewResult Result { get; set; } = InterviewResult.Pending;

    [ForeignKey(nameof(JobApplicationId))]
    public JobApplication JobApplication { get; set; } = null!;
}

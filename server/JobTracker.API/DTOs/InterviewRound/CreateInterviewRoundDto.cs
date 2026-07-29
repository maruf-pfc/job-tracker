using System.ComponentModel.DataAnnotations;
using JobTracker.API.Models;

namespace JobTracker.API.DTOs.InterviewRound;

public class CreateInterviewRoundDto
{
    [Required]
    [MaxLength(100)]
    public string RoundName { get; set; } = string.Empty;

    public DateTime RoundDate { get; set; } = DateTime.UtcNow;

    [MaxLength(5000)]
    public string? Experience { get; set; }

    public InterviewResult Result { get; set; } = InterviewResult.Pending;
}

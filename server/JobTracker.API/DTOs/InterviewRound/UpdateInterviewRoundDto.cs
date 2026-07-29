using System.ComponentModel.DataAnnotations;
using JobTracker.API.Models;

namespace JobTracker.API.DTOs.InterviewRound;

public class UpdateInterviewRoundDto
{
    [Required]
    [MaxLength(100)]
    public string RoundName { get; set; } = string.Empty;

    public DateTime RoundDate { get; set; }

    [MaxLength(5000)]
    public string? Experience { get; set; }

    public InterviewResult Result { get; set; }
}

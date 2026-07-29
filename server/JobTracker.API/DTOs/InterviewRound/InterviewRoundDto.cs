using JobTracker.API.Models;

namespace JobTracker.API.DTOs.InterviewRound;

public class InterviewRoundDto
{
    public Guid Id { get; set; }
    public Guid JobApplicationId { get; set; }
    public string RoundName { get; set; } = string.Empty;
    public DateTime RoundDate { get; set; }
    public string? Experience { get; set; }
    public InterviewResult Result { get; set; }
    public DateTime CreatedAt { get; set; }
}

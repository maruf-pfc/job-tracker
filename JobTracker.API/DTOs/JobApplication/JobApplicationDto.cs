namespace JobTracker.API.DTOs.JobApplication;

public class JobApplicationDto
{
    public Guid Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? JobUrl { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? Notes { get; set; }
    public string? CoverLetter { get; set; }
    public string? ResumeDriveLink { get; set; }
    public DateTime AppliedAt { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public bool IsArchived { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string JobType { get; set; } = string.Empty;
    public string SourcePlatform { get; set; } = string.Empty;
    public string ApplicationStatus { get; set; } = string.Empty;
    public string WorkType { get; set; } = string.Empty;
}
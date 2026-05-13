namespace JobTracker.API.DTOs.JobApplication;

public class JobApplicationDto
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? JobUrl { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? Notes { get; set; }
    public DateTime AppliedAt { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string JobType { get; set; } = string.Empty;
    public string SourcePlatform { get; set; } = string.Empty;
    public string ApplicationStatus { get; set; } = string.Empty;
    public string WorkType { get; set; } = string.Empty;
}
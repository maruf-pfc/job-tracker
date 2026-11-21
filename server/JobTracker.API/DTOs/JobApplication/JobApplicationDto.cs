namespace JobTracker.API.DTOs.JobApplication;

public class JobApplicationDto
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string Company { get; set; } = string.Empty;
    public bool IsCompanyFavorite { get; set; }
    public bool IsCompanyRedFlagged { get; set; }
    public string? CompanyRedFlagReason { get; set; }
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
    public int TotalRounds { get; set; }
    public int PassedRounds { get; set; }
    public string? LatestRoundName { get; set; }
    public string? LatestRoundResult { get; set; }
    public string? FailedStage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

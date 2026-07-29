namespace JobTracker.API.DTOs.JobApplication;

public class JobApplicationQueryDto
{
    public string? Search { get; set; }
    public Guid? PriorityId { get; set; }
    public Guid? JobTypeId { get; set; }
    public Guid? SourcePlatformId { get; set; }
    public Guid? ApplicationStatusId { get; set; }
    public Guid? WorkTypeId { get; set; }

    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    // Sorting
    public string SortBy { get; set; } = "AppliedAt";
    public string SortDirection { get; set; } = "desc";
}
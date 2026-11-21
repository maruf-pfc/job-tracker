namespace JobTracker.API.DTOs.Company;

public class CompanyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CareerPageUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
    public bool IsFavorite { get; set; }
    public bool IsArchived { get; set; }
    public bool IsRedFlagged { get; set; }
    public string? RedFlagReason { get; set; }
}

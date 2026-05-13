namespace JobTracker.API.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalApplications { get; set; }
    public int TotalInterviews { get; set; }
    public int TotalOffers { get; set; }
    public int TotalRejected { get; set; }
    public int TotalSaved { get; set; }
}
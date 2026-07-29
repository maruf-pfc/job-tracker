namespace JobTracker.API.DTOs.Dashboard;

public class WeeklyApplicationTrendDto
{
    public string WeekLabel { get; set; } = string.Empty;
    public int ApplicationCount { get; set; }
}

public class DashboardAnalyticsDto
{
    public double ResponseRatePercentage { get; set; }
    public double InterviewConversionRatePercentage { get; set; }
    public int TotalApplications { get; set; }
    public int TotalInterviews { get; set; }
    public int TotalOffers { get; set; }
    public IEnumerable<WeeklyApplicationTrendDto> WeeklyTrends { get; set; } = new List<WeeklyApplicationTrendDto>();
}

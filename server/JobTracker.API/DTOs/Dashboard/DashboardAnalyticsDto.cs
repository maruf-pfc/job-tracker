namespace JobTracker.API.DTOs.Dashboard;

public class WeeklyApplicationTrendDto
{
    public string WeekLabel { get; set; } = string.Empty;
    public int ApplicationCount { get; set; }
}

public class PriorityAnalyticsDto
{
    public string Priority { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class WorkTypeAnalyticsDto
{
    public string WorkType { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class DashboardAnalyticsDto
{
    public double ResponseRatePercentage { get; set; }
    public double InterviewConversionRatePercentage { get; set; }
    public int TotalApplications { get; set; }
    public int TotalInterviews { get; set; }
    public int TotalOffers { get; set; }
    public List<WeeklyApplicationTrendDto> WeeklyTrends { get; set; } = new();
    public List<ApplicationStatusChartDto> StatusBreakdown { get; set; } = new();
    public List<PlatformAnalyticsDto> PlatformBreakdown { get; set; } = new();
    public List<PriorityAnalyticsDto> PriorityBreakdown { get; set; } = new();
    public List<WorkTypeAnalyticsDto> WorkTypeBreakdown { get; set; } = new();
}

using JobTracker.API.DTOs.Dashboard;

namespace JobTracker.API.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
    Task<List<ApplicationStatusChartDto>> GetApplicationsByStatusAsync();
    Task<List<PlatformAnalyticsDto>> GetApplicationsByPlatformAsync();
}
using JobTracker.API.DTOs.Dashboard;

namespace JobTracker.API.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
    Task<List<ApplicationStatusChartDto>> GetApplicationsByStatusAsync(CancellationToken cancellationToken = default);
    Task<List<PlatformAnalyticsDto>> GetApplicationsByPlatformAsync(CancellationToken cancellationToken = default);
    Task<DashboardAnalyticsDto> GetAnalyticsAsync(CancellationToken cancellationToken = default);
}
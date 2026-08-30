using JobTracker.API.DTOs.AiAdvisor;

namespace JobTracker.API.Interfaces;

public interface IAiAdvisorService
{
    Task<AiCareerInsightDto> GetCareerAdvisorInsightsAsync(bool forceRefresh = false, CancellationToken cancellationToken = default);
}

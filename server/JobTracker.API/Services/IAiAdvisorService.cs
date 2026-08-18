using System.Threading.Tasks;
using JobTracker.API.DTOs.AiAdvisor;

namespace JobTracker.API.Services;

public interface IAiAdvisorService
{
    Task<AiCareerInsightDto> GetCareerAdvisorInsightsAsync(bool forceRefresh = false);
}

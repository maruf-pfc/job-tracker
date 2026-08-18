using System.Threading.Tasks;
using JobTracker.API.DTOs.AiAdvisor;
using JobTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiAdvisorController : ControllerBase
{
    private readonly IAiAdvisorService _aiAdvisorService;

    public AiAdvisorController(IAiAdvisorService aiAdvisorService)
    {
        _aiAdvisorService = aiAdvisorService;
    }

    [HttpGet("insights")]
    public async Task<ActionResult<AiCareerInsightDto>> GetInsights([FromQuery] bool forceRefresh = false)
    {
        var result = await _aiAdvisorService.GetCareerAdvisorInsightsAsync(forceRefresh);
        return Ok(result);
    }

    [HttpPost("insights/refresh")]
    public async Task<ActionResult<AiCareerInsightDto>> RefreshInsights()
    {
        var result = await _aiAdvisorService.GetCareerAdvisorInsightsAsync(forceRefresh: true);
        return Ok(result);
    }
}

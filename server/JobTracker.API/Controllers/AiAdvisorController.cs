using JobTracker.API.DTOs.AiAdvisor;
using JobTracker.API.Interfaces;
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
    public async Task<ActionResult<AiCareerInsightDto>> GetInsights([FromQuery] bool forceRefresh, CancellationToken cancellationToken)
    {
        var result = await _aiAdvisorService.GetCareerAdvisorInsightsAsync(forceRefresh, cancellationToken);
        return Ok(result);
    }

    [HttpPost("insights/refresh")]
    public async Task<ActionResult<AiCareerInsightDto>> RefreshInsights(CancellationToken cancellationToken)
    {
        var result = await _aiAdvisorService.GetCareerAdvisorInsightsAsync(forceRefresh: true, cancellationToken);
        return Ok(result);
    }
}

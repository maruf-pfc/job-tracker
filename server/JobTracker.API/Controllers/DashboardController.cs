using JobTracker.API.Common;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetSummaryAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpGet("chart")]
    public async Task<IActionResult> GetApplicationsByStatus(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetApplicationsByStatusAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpGet("platform")]
    public async Task<IActionResult> GetApplicationsByPlatform(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetApplicationsByPlatformAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetAnalyticsAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Analytics data fetched successfully"
            )
        );
    }
}
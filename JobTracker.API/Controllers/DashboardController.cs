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
    public async Task<IActionResult> GetSummary()
    {
        var result = await _dashboardService.GetSummaryAsync();

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Dashboard summary fetched successfully"
            )
        );
    }

    [HttpGet("status-chart")]
    public async Task<IActionResult>
    GetApplicationsByStatus()
    {
        var result = await _dashboardService.GetApplicationsByStatusAsync();

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Status chart fetched successfully"
            )
        );
    }

    [HttpGet("platform-chart")]
    public async Task<IActionResult>
    GetApplicationsByPlatform()
    {
        var result = await _dashboardService.GetApplicationsByPlatformAsync();

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Platform chart fetched successfully"
            )
        );
    }
}
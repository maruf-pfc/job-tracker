using JobTracker.API.Common;
using JobTracker.API.DTOs.Rejection;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api/rejection-retrospectives")]
public class RejectionRetrospectivesController : ControllerBase
{
    private readonly IRejectionRetrospectiveService _service;

    public RejectionRetrospectivesController(IRejectionRetrospectiveService service)
    {
        _service = service;
    }

    [HttpPost("{applicationId:guid}")]
    public async Task<IActionResult> UpsertRetrospective(Guid applicationId, [FromBody] CreateRejectionRetrospectiveDto dto, CancellationToken cancellationToken)
    {
        var result = await _service.UpsertRetrospectiveAsync(applicationId, dto, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Retrospective saved successfully"));
    }

    [HttpGet("{applicationId:guid}")]
    public async Task<IActionResult> GetByApplicationId(Guid applicationId, CancellationToken cancellationToken)
    {
        var result = await _service.GetByApplicationIdAsync(applicationId, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Retrospective loaded successfully"));
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
    {
        var result = await _service.GetFailureAnalyticsAsync(cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Failure analytics loaded successfully"));
    }
}

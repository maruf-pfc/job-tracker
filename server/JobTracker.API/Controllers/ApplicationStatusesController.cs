using JobTracker.API.Common;
using JobTracker.API.DTOs.ApplicationStatus;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/application-statuses")]
[Authorize]
public class ApplicationStatusesController : ControllerBase
{
    private readonly IApplicationStatusService _applicationStatusService;

    public ApplicationStatusesController(IApplicationStatusService applicationStatusService)
    {
        _applicationStatusService = applicationStatusService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _applicationStatusService.GetAllAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateApplicationStatusDto dto, CancellationToken cancellationToken)
    {
        var result = await _applicationStatusService.CreateAsync(dto, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Created successfully"
            )
        );
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _applicationStatusService.DeleteAsync(id, cancellationToken);

        if (!result)
        {
            return NotFound(
                ApiResponse<string>.FailureResponse(
                    "Resource not found"
                )
            );
        }

        return Ok(
            ApiResponse<string>.SuccessResponse(
                null,
                "Deleted successfully"
            )
        );
    }
}
using JobTracker.API.Common;
using JobTracker.API.DTOs.SourcePlatform;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/source-platforms")]
[Route("api/sourceplatforms")]
[Authorize]
public class SourcePlatformsController : ControllerBase
{
    private readonly ISourcePlatformService _sourcePlatformService;

    public SourcePlatformsController(ISourcePlatformService sourcePlatformService)
    {
        _sourcePlatformService = sourcePlatformService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _sourcePlatformService.GetAllAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSourcePlatformDto dto, CancellationToken cancellationToken)
    {
        var result = await _sourcePlatformService.CreateAsync(dto, cancellationToken);
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
        var result = await _sourcePlatformService.DeleteAsync(id, cancellationToken);

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
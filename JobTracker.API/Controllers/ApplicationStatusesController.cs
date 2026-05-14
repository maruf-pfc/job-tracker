using JobTracker.API.Common;
using JobTracker.API.DTOs.ApplicationStatus;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationStatusesController : ControllerBase
{
    private readonly IApplicationStatusService _service;

    public ApplicationStatusesController(IApplicationStatusService service
    )
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Application statuses fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateApplicationStatusDto dto)
    {
        var result = await _service.CreateAsync(dto);

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Application status created successfully"
            )
        );
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(
                ApiResponse<string>.FailureResponse(
                    "Application status not found"
                )
            );
        }

        return Ok(
            ApiResponse<string>.SuccessResponse(
                null,
                "Application status deleted successfully"
            )
        );
    }
}
using JobTracker.API.Common;
using JobTracker.API.DTOs.Priority;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PrioritiesController : ControllerBase
{
    private readonly IPriorityService _priorityService;

    public PrioritiesController(IPriorityService priorityService)
    {
        _priorityService = priorityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _priorityService.GetAllAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _priorityService.GetByIdAsync(id, cancellationToken);

        if (result is null)
        {
            return NotFound(
                ApiResponse<string>.FailureResponse(
                    "Resource not found"
                )
            );
        }

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePriorityDto dto, CancellationToken cancellationToken)
    {
        var result = await _priorityService.CreateAsync(dto, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Created successfully"
            )
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdatePriorityDto dto, CancellationToken cancellationToken)
    {
        var result = await _priorityService.UpdateAsync(id, dto, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Updated successfully"
            )
        );
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _priorityService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
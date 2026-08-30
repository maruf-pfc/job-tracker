using JobTracker.API.Common;
using JobTracker.API.DTOs.WorkType;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/work-types")]
[Authorize]
public class WorkTypesController : ControllerBase
{
    private readonly IWorkTypeService _workTypeService;

    public WorkTypesController(IWorkTypeService workTypeService)
    {
        _workTypeService = workTypeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _workTypeService.GetAllAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateWorkTypeDto dto, CancellationToken cancellationToken)
    {
        var result = await _workTypeService.CreateAsync(dto, cancellationToken);
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
        var result = await _workTypeService.DeleteAsync(id, cancellationToken);

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
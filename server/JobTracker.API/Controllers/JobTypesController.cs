using JobTracker.API.Common;
using JobTracker.API.DTOs.JobType;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/job-types")]
[Authorize]
public class JobTypesController : ControllerBase
{
    private readonly IJobTypeService _jobTypeService;

    public JobTypesController(IJobTypeService jobTypeService)
    {
        _jobTypeService = jobTypeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _jobTypeService.GetAllAsync(cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateJobTypeDto dto, CancellationToken cancellationToken)
    {
        var result = await _jobTypeService.CreateAsync(dto, cancellationToken);
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
        var result = await _jobTypeService.DeleteAsync(id, cancellationToken);

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
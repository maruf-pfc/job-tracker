using JobTracker.API.DTOs.JobType;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobTracker.API.Common;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobTypesController: ControllerBase
{
    private readonly IJobTypeService  _service;

    public JobTypesController(IJobTypeService service
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
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateJobTypeDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Created successfully"
            )
        );
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return Ok(
                ApiResponse<string>.SuccessResponse(
                    null,
                    "Deleted successfully"
                )
            );
        }

        return NotFound(
            ApiResponse<string>.FailureResponse(
                "Resource not found"
            )
        );
    }
}
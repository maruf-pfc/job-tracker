using JobTracker.API.Common;
using JobTracker.API.DTOs.JobApplication;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class JobApplicationsController : ControllerBase
{
    private readonly IJobApplicationService _jobApplicationService;

    public JobApplicationsController(IJobApplicationService jobApplicationService)
    {
        _jobApplicationService = jobApplicationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] JobApplicationQueryDto query, CancellationToken cancellationToken)
    {
        var result = await _jobApplicationService.GetAllAsync(query, cancellationToken);
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
        var result = await _jobApplicationService.GetByIdAsync(id, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateJobApplicationDto dto, CancellationToken cancellationToken)
    {
        var result = await _jobApplicationService.CreateAsync(dto, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Created successfully"
            )
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateJobApplicationDto dto, CancellationToken cancellationToken)
    {
        var result = await _jobApplicationService.UpdateAsync(id, dto, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Updated successfully"
            )
        );
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] Guid statusId, CancellationToken cancellationToken)
    {
        var result = await _jobApplicationService.UpdateStatusAsync(id, statusId, cancellationToken);
        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Status updated successfully"
            )
        );
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _jobApplicationService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
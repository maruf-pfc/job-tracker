using JobTracker.API.Common;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/job-roles")]
[Authorize]
public class JobRolesController : ControllerBase
{
    private readonly IJobRoleService _jobRoleService;

    public JobRolesController(IJobRoleService jobRoleService)
    {
        _jobRoleService = jobRoleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _jobRoleService.GetAllAsync(cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Data fetched successfully"));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateJobRoleDto dto, CancellationToken cancellationToken)
    {
        var result = await _jobRoleService.CreateAsync(dto, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Created successfully"));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CreateJobRoleDto dto, CancellationToken cancellationToken)
    {
        var result = await _jobRoleService.UpdateAsync(id, dto, cancellationToken);
        if (result is null)
        {
            return NotFound(ApiResponse<string>.FailureResponse("Resource not found"));
        }
        return Ok(ApiResponse<object>.SuccessResponse(result, "Updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _jobRoleService.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound(ApiResponse<string>.FailureResponse("Resource not found"));
        }
        return Ok(ApiResponse<string>.SuccessResponse(null, "Deleted successfully"));
    }
}

using JobTracker.API.Common;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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
    public async Task<IActionResult> GetAll()
    {
        var result = await _jobRoleService.GetAllAsync();
        return Ok(ApiResponse<object>.SuccessResponse(result, "Data fetched successfully"));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateJobRoleDto dto)
    {
        var result = await _jobRoleService.CreateAsync(dto);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Created successfully"));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CreateJobRoleDto dto)
    {
        var result = await _jobRoleService.UpdateAsync(id, dto);
        if (result is null)
        {
            return NotFound(ApiResponse<string>.FailureResponse("Resource not found"));
        }
        return Ok(ApiResponse<object>.SuccessResponse(result, "Updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _jobRoleService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(ApiResponse<string>.FailureResponse("Resource not found"));
        }
        return Ok(ApiResponse<string>.SuccessResponse(null, "Deleted successfully"));
    }
}

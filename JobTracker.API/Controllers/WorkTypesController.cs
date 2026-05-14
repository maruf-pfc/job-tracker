using JobTracker.API.DTOs.WorkType;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobTracker.API.Common;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkTypesController : ControllerBase
{
    private readonly IWorkTypeService _service;
    public WorkTypesController(IWorkTypeService service)
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
    public async Task<IActionResult> Create(CreateWorkTypeDto dto)
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
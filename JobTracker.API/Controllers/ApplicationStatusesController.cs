using JobTracker.API.DTOs.ApplicationStatus;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationStatusesController
    : ControllerBase
{
    private readonly IApplicationStatusService _service;

    public ApplicationStatusesController(IApplicationStatusService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult>
    GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult>
    Create(CreateApplicationStatusDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult>
    Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
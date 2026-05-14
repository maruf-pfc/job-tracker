using JobTracker.API.DTOs.SourcePlatform;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SourcePlatformsController: ControllerBase
{
    private readonly ISourcePlatformService _service;

    public SourcePlatformsController(ISourcePlatformService service)
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
    Create(CreateSourcePlatformDto dto)
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
using JobTracker.API.DTOs.Company;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompaniesController: ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }



    [HttpGet]
    public async Task<IActionResult>
    GetAll()
    {
        var result = await _companyService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult>
    GetById(Guid id)
    {
        var result = await _companyService.GetByIdAsync(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult>
    Create(CreateCompanyDto dto)
    {
        var result = await _companyService.CreateAsync(dto);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult>
    Update(Guid id, CreateCompanyDto dto)
    {
        var result = await _companyService.UpdateAsync(id, dto);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult>
    Delete(Guid id)
    {
        var deleted = await _companyService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
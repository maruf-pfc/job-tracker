using JobTracker.API.Common;
using JobTracker.API.DTOs.Company;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _companyService.GetAllAsync(cancellationToken);
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
        var result = await _companyService.GetByIdAsync(id, cancellationToken);

        if (result is null)
        {
            return NotFound(
                ApiResponse<string>.FailureResponse(
                    "Resource not found"
                )
            );
        }

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Data fetched successfully"
            )
        );
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCompanyDto dto, CancellationToken cancellationToken)
    {
        var result = await _companyService.CreateAsync(dto, cancellationToken);

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Created successfully"
            )
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CreateCompanyDto dto, CancellationToken cancellationToken)
    {
        var result = await _companyService.UpdateAsync(id, dto, cancellationToken);

        if (result is null)
        {
            return NotFound(
                ApiResponse<string>.FailureResponse(
                    "Resource not found"
                )
            );
        }

        return Ok(
            ApiResponse<object>.SuccessResponse(
                result,
                "Updated successfully"
            )
        );
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _companyService.DeleteAsync(id, cancellationToken);

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
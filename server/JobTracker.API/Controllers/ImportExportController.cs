using JobTracker.API.Common;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class ImportExportController : ControllerBase
{
    private readonly IImportExportService _importExportService;

    public ImportExportController(IImportExportService importExportService)
    {
        _importExportService = importExportService;
    }

    [HttpPost("import/csv")]
    public async Task<ActionResult<ApiResponse<object>>> ImportCsv(IFormFile file, CancellationToken cancellationToken)
    {
        var importedCount = await _importExportService.ImportCsvAsync(file, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(new { ImportedCount = importedCount }, $"{importedCount} applications imported successfully"));
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv(CancellationToken cancellationToken)
    {
        var csvBytes = await _importExportService.ExportCsvAsync(cancellationToken);
        return File(csvBytes, "text/csv", $"job_applications_{DateTime.UtcNow:yyyyMMdd}.csv");
    }
}

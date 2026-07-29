using Microsoft.AspNetCore.Http;

namespace JobTracker.API.Interfaces;

public interface IImportExportService
{
    Task<int> ImportCsvAsync(IFormFile file);
    Task<byte[]> ExportCsvAsync();
}

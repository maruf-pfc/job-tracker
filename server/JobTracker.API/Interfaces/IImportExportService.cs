using Microsoft.AspNetCore.Http;

namespace JobTracker.API.Interfaces;

public interface IImportExportService
{
    Task<int> ImportCsvAsync(IFormFile file, CancellationToken cancellationToken = default);
    Task<byte[]> ExportCsvAsync(CancellationToken cancellationToken = default);
}

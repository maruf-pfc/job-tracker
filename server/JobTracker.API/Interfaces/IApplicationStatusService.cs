using JobTracker.API.DTOs.ApplicationStatus;

namespace JobTracker.API.Interfaces;

public interface IApplicationStatusService
{
    Task<List<ApplicationStatusDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ApplicationStatusDto> CreateAsync(CreateApplicationStatusDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
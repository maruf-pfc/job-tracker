using JobTracker.API.DTOs.ApplicationStatus;

namespace JobTracker.API.Interfaces;

public interface IApplicationStatusService
{
    Task<List<ApplicationStatusDto>> GetAllAsync();
    Task<ApplicationStatusDto> CreateAsync(CreateApplicationStatusDto dto);
    Task<bool> DeleteAsync(Guid id);
}
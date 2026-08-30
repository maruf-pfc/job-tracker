using JobTracker.API.DTOs.Priority;

namespace JobTracker.API.Interfaces;

public interface IPriorityService
{
    Task<List<PriorityDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<PriorityDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PriorityDto> CreateAsync(CreatePriorityDto dto, CancellationToken cancellationToken = default);
    Task<PriorityDto> UpdateAsync(Guid id, UpdatePriorityDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
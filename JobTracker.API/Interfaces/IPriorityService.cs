using JobTracker.API.DTOs.Priority;

namespace JobTracker.API.Interfaces;

public interface IPriorityService
{
    Task<List<PriorityDto>> GetAllAsync();
    Task<PriorityDto?> GetByIdAsync(Guid id);
    Task<PriorityDto> CreateAsync(CreatePriorityDto dto);
    Task<PriorityDto> UpdateAsync(Guid id, UpdatePriorityDto dto);
    Task DeleteAsync(Guid id);
}
using JobTracker.API.DTOs.WorkType;

namespace JobTracker.API.Interfaces;

public interface IWorkTypeService
{
    Task<List<WorkTypeDto>> GetAllAsync();
    Task<WorkTypeDto> CreateAsync(CreateWorkTypeDto dto);
    Task<bool> DeleteAsync(Guid id);
}
using JobTracker.API.DTOs.WorkType;

namespace JobTracker.API.Interfaces;

public interface IWorkTypeService
{
    Task<List<WorkTypeDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<WorkTypeDto> CreateAsync(CreateWorkTypeDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

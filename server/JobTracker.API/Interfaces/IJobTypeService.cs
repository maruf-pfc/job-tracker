using JobTracker.API.DTOs.JobType;

namespace JobTracker.API.Interfaces;

public interface IJobTypeService
{
    Task<List<JobTypeDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<JobTypeDto> CreateAsync(CreateJobTypeDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
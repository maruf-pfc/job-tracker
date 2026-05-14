using JobTracker.API.DTOs.JobType;

namespace JobTracker.API.Interfaces;

public interface IJobTypeService
{
    Task<List<JobTypeDto>> GetAllAsync();
    Task<JobTypeDto> CreateAsync(CreateJobTypeDto dto);
    Task<bool> DeleteAsync(Guid id);
}
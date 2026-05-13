using JobTracker.API.DTOs.JobApplication;

namespace JobTracker.API.Interfaces;

public interface IJobApplicationService
{
    Task<List<JobApplicationDto>> GetAllAsync();
    Task<JobApplicationDto?> GetByIdAsync(Guid id);
    Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto);
    Task<JobApplicationDto> UpdateAsync(Guid id, UpdateJobApplicationDto dto);
    Task DeleteAsync(Guid id);
}
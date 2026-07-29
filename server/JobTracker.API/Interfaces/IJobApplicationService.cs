using JobTracker.API.DTOs.JobApplication;
using JobTracker.API.DTOs.Common;

namespace JobTracker.API.Interfaces;

public interface IJobApplicationService
{
    Task<PaginatedResponseDto<JobApplicationDto>> GetAllAsync(JobApplicationQueryDto query);
    Task<JobApplicationDto?> GetByIdAsync(Guid id);
    Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto);
    Task<JobApplicationDto> UpdateAsync(Guid id, UpdateJobApplicationDto dto);
    Task<JobApplicationDto> UpdateStatusAsync(Guid id, Guid statusId);
    Task DeleteAsync(Guid id);
}
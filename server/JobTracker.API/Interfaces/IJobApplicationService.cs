using JobTracker.API.DTOs.JobApplication;
using JobTracker.API.DTOs.Common;

namespace JobTracker.API.Interfaces;

public interface IJobApplicationService
{
    Task<PaginatedResponseDto<JobApplicationDto>> GetAllAsync(JobApplicationQueryDto query, CancellationToken cancellationToken = default);
    Task<JobApplicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto, CancellationToken cancellationToken = default);
    Task<JobApplicationDto> UpdateAsync(Guid id, UpdateJobApplicationDto dto, CancellationToken cancellationToken = default);
    Task<JobApplicationDto> UpdateStatusAsync(Guid id, Guid statusId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
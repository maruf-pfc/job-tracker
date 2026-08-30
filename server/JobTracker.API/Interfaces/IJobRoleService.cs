using JobTracker.API.DTOs.JobRole;

namespace JobTracker.API.Interfaces;

public interface IJobRoleService
{
    Task<List<JobRoleDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<JobRoleDto> CreateAsync(CreateJobRoleDto dto, CancellationToken cancellationToken = default);
    Task<JobRoleDto?> UpdateAsync(Guid id, CreateJobRoleDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

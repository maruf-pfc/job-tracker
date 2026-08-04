using JobTracker.API.DTOs.JobRole;

namespace JobTracker.API.Interfaces;

public interface IJobRoleService
{
    Task<List<JobRoleDto>> GetAllAsync();
    Task<JobRoleDto> CreateAsync(CreateJobRoleDto dto);
    Task<JobRoleDto?> UpdateAsync(Guid id, CreateJobRoleDto dto);
    Task<bool> DeleteAsync(Guid id);
}

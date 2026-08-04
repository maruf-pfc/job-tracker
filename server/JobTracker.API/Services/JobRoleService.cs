using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class JobRoleService : IJobRoleService
{
    private readonly AppDbContext _context;

    public JobRoleService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<JobRoleDto>> GetAllAsync()
    {
        return await _context.JobRoles
            .OrderBy(r => r.Name)
            .Select(r => new JobRoleDto
            {
                Id = r.Id,
                Name = r.Name
            })
            .ToListAsync();
    }

    public async Task<JobRoleDto> CreateAsync(CreateJobRoleDto dto)
    {
        var entity = new JobRole
        {
            Name = dto.Name.Trim()
        };

        _context.JobRoles.Add(entity);
        await _context.SaveChangesAsync();

        return new JobRoleDto
        {
            Id = entity.Id,
            Name = entity.Name
        };
    }

    public async Task<JobRoleDto?> UpdateAsync(Guid id, CreateJobRoleDto dto)
    {
        var entity = await _context.JobRoles.FirstOrDefaultAsync(r => r.Id == id);
        if (entity is null) return null;

        entity.Name = dto.Name.Trim();
        await _context.SaveChangesAsync();

        return new JobRoleDto
        {
            Id = entity.Id,
            Name = entity.Name
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context.JobRoles.FirstOrDefaultAsync(r => r.Id == id);
        if (entity is null) return false;

        _context.JobRoles.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}

using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class JobRoleService : IJobRoleService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public JobRoleService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<JobRoleDto>> GetAllAsync()
    {
        var userId = _currentUser.UserId;
        return await _context.JobRoles
            .Where(r => r.UserId == userId || r.UserId == null)
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
            Name = dto.Name.Trim(),
            UserId = _currentUser.UserId
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
        var userId = _currentUser.UserId;
        var entity = await _context.JobRoles.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
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
        var userId = _currentUser.UserId;
        var entity = await _context.JobRoles.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (entity is null) return false;

        _context.JobRoles.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}

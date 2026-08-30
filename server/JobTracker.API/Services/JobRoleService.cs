using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Exceptions;
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

    private Guid GetRequiredUserId()
    {
        var userId = _currentUser.UserId;
        if (!userId.HasValue || userId.Value == Guid.Empty)
        {
            throw new UnauthorizedException("User is not authenticated.");
        }
        return userId.Value;
    }

    public async Task<List<JobRoleDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        return await _context.JobRoles
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderBy(r => r.Name)
            .Select(r => new JobRoleDto
            {
                Id = r.Id,
                Name = r.Name
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<JobRoleDto> CreateAsync(CreateJobRoleDto dto, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var entity = new JobRole
        {
            Name = dto.Name.Trim(),
            UserId = userId
        };

        _context.JobRoles.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return new JobRoleDto
        {
            Id = entity.Id,
            Name = entity.Name
        };
    }

    public async Task<JobRoleDto?> UpdateAsync(Guid id, CreateJobRoleDto dto, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var entity = await _context.JobRoles.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name.Trim();
        await _context.SaveChangesAsync(cancellationToken);

        return new JobRoleDto
        {
            Id = entity.Id,
            Name = entity.Name
        };
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var entity = await _context.JobRoles.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId, cancellationToken);
        if (entity is null) return false;

        _context.JobRoles.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

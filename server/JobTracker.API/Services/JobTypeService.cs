using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobType;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class JobTypeService : IJobTypeService
{
    private readonly AppDbContext _context;

    public JobTypeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<JobTypeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.JobTypes
            .AsNoTracking()
            .OrderBy(j => j.Name)
            .Select(j => new JobTypeDto
            {
                Id = j.Id,
                Name = j.Name,
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<JobTypeDto> CreateAsync(CreateJobTypeDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new JobType
        {
            Name = dto.Name.Trim(),
        };

        _context.JobTypes.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return new JobTypeDto
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.JobTypes.FirstOrDefaultAsync(j => j.Id == id, cancellationToken);

        if (entity is null)
        {
            return false;
        }

        _context.JobTypes.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobType;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class JobTypeService: IJobTypeService
{
    private readonly AppDbContext _context;
    public JobTypeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<JobTypeDto>>
    GetAllAsync()
    {
        return await _context
            .JobTypes
            .OrderBy(j => j.Name)
            .Select(j => new JobTypeDto
            {
                Id = j.Id,
                Name = j.Name,
            })
            .ToListAsync();
    }

    public async Task<JobTypeDto>
    CreateAsync(CreateJobTypeDto dto)
    {
        var entity = new JobType
            {
                Name = dto.Name,
            };

        _context.JobTypes.Add(entity);

        await _context.SaveChangesAsync();

        return new JobTypeDto
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity =  await _context
                .JobTypes
                .FirstOrDefaultAsync(j => j.Id == id);

        if (entity is null)
        {
            return false;
        }

        _context.JobTypes.Remove(entity);

        await _context.SaveChangesAsync();

        return true;
    }
}
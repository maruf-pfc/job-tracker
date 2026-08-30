using JobTracker.API.Configs;
using JobTracker.API.DTOs.WorkType;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class WorkTypeService : IWorkTypeService
{
    private readonly AppDbContext _context;

    public WorkTypeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkTypeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.WorkTypes
            .AsNoTracking()
            .OrderBy(w => w.Name)
            .Select(w => new WorkTypeDto
            {
                Id = w.Id,
                Name = w.Name,
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<WorkTypeDto> CreateAsync(CreateWorkTypeDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new WorkType
        {
            Name = dto.Name.Trim(),
        };

        _context.WorkTypes.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return new WorkTypeDto
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.WorkTypes.FirstOrDefaultAsync(w => w.Id == id, cancellationToken);

        if (entity is null)
        {
            return false;
        }

        _context.WorkTypes.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
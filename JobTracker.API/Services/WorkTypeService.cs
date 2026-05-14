using JobTracker.API.Configs;
using JobTracker.API.DTOs.WorkType;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class WorkTypeService: IWorkTypeService
{
    private readonly AppDbContext _context;

    public WorkTypeService(AppDbContext context)
    {
        _context = context;
    }



    public async Task<List<WorkTypeDto>>
    GetAllAsync()
    {
        return await _context
            .WorkTypes
            .OrderBy(w => w.Name)
            .Select(w => new WorkTypeDto
            {
                Id = w.Id,
                Name = w.Name,
            })
            .ToListAsync();
    }

    public async Task<WorkTypeDto>
    CreateAsync(CreateWorkTypeDto dto)
    {
        var entity = new WorkType
            {
                Name = dto.Name,
            };

        _context.WorkTypes.Add(entity);

        await _context.SaveChangesAsync();

        return new WorkTypeDto
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }

    public async Task<bool>
    DeleteAsync(Guid id)
    {
        var entity = await _context
                .WorkTypes
                .FirstOrDefaultAsync(w => w.Id == id);

        if (entity is null)
        {
            return false;
        }

        _context.WorkTypes.Remove(entity);

        await _context.SaveChangesAsync();

        return true;
    }
}
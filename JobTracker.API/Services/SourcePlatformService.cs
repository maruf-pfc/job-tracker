using JobTracker.API.Configs;
using JobTracker.API.DTOs.SourcePlatform;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class SourcePlatformService
    : ISourcePlatformService
{
    private readonly AppDbContext _context;

    public SourcePlatformService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SourcePlatformDto>>
    GetAllAsync()
    {
        return await _context
            .SourcePlatforms
            .OrderBy(s => s.Name)
            .Select(s => new SourcePlatformDto
            {
                Id = s.Id,
                Name = s.Name,
            })
            .ToListAsync();
    }



    public async Task<SourcePlatformDto>
    CreateAsync(CreateSourcePlatformDto dto)
    {
        var entity = new SourcePlatform
            {
                Name = dto.Name,
            };

        _context.SourcePlatforms.Add(entity);

        await _context.SaveChangesAsync();

        return new SourcePlatformDto
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }



    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context
                .SourcePlatforms
                .FirstOrDefaultAsync(s => s.Id == id);

        if (entity is null)
        {
            return false;
        }

        _context.SourcePlatforms.Remove(entity);

        await _context.SaveChangesAsync();

        return true;
    }
}
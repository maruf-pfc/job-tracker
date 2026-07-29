using JobTracker.API.Configs;
using JobTracker.API.DTOs.ApplicationStatus;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class ApplicationStatusService
    : IApplicationStatusService
{
    private readonly AppDbContext _context;

    public ApplicationStatusService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicationStatusDto>> GetAllAsync()
    {
        return await _context.ApplicationStatuses
            .OrderBy(a => a.Name)
            .Select(a => new ApplicationStatusDto
            {
                Id = a.Id,
                Name = a.Name,
            })
            .ToListAsync();
    }

    public async Task<ApplicationStatusDto> CreateAsync(CreateApplicationStatusDto dto)
    {
        var entity = new ApplicationStatus
        {
            Name = dto.Name,
        };

        _context.ApplicationStatuses.Add(entity);

        await _context.SaveChangesAsync();

        return new ApplicationStatusDto
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context.ApplicationStatuses.FirstOrDefaultAsync( a => a.Id == id);

        if (entity is null)
        {
            return false;
        }

        _context.ApplicationStatuses.Remove(entity);

        await _context.SaveChangesAsync();

        return true;
    }
}
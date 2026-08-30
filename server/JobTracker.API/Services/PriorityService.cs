using JobTracker.API.Configs;
using JobTracker.API.DTOs.Priority;
using JobTracker.API.Exceptions;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class PriorityService : IPriorityService
{
    private readonly AppDbContext _context;

    public PriorityService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PriorityDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Priorities
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name,
                Color = p.Color,
                IsActive = p.IsActive
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<PriorityDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Priorities
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name,
                Color = p.Color,
                IsActive = p.IsActive
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<PriorityDto> CreateAsync(CreatePriorityDto dto, CancellationToken cancellationToken = default)
    {
        var priority = new Priority
        {
            Name = dto.Name.Trim(),
            Color = dto.Color.Trim().ToLower()
        };

        _context.Priorities.Add(priority);
        await _context.SaveChangesAsync(cancellationToken);

        return new PriorityDto
        {
            Id = priority.Id,
            Name = priority.Name,
            Color = priority.Color,
            IsActive = priority.IsActive
        };
    }

    public async Task<PriorityDto> UpdateAsync(Guid id, UpdatePriorityDto dto, CancellationToken cancellationToken = default)
    {
        var priority = await _context.Priorities.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (priority is null)
        {
            throw new NotFoundException("Priority", id);
        }

        priority.Name = dto.Name.Trim();
        priority.Color = dto.Color.Trim().ToLower();
        priority.IsActive = dto.IsActive;
        priority.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new PriorityDto
        {
            Id = priority.Id,
            Name = priority.Name,
            Color = priority.Color,
            IsActive = priority.IsActive
        };
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var priority = await _context.Priorities.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (priority is null)
        {
            throw new NotFoundException("Priority", id);
        }

        _context.Priorities.Remove(priority);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Priority;
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

    public async Task<List<PriorityDto>> GetAllAsync()
    {
        return await _context.Priorities
            .OrderBy(p => p.Name)
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name,
                Color = p.Color,
                IsActive = p.IsActive
            })
            .ToListAsync();
    }

    public async Task<PriorityDto?> GetByIdAsync(Guid id)
    {
        return await _context.Priorities
            .Where(p => p.Id == id)
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name,
                Color = p.Color,
                IsActive = p.IsActive
            })
            .FirstOrDefaultAsync();
    }

    public async Task<PriorityDto> CreateAsync(CreatePriorityDto dto)
    {
        var priority = new Priority
        {
            Name = dto.Name.Trim(),
            Color = dto.Color.Trim().ToLower()
        };

        _context.Priorities.Add(priority);

        await _context.SaveChangesAsync();

        return new PriorityDto
        {
            Id = priority.Id,
            Name = priority.Name,
            Color = priority.Color,
            IsActive = priority.IsActive
        };
    }

    public async Task<PriorityDto> UpdateAsync(Guid id, UpdatePriorityDto dto)
    {
        var priority = await _context.Priorities.FirstOrDefaultAsync(p => p.Id == id);

        if (priority is null)
        {
            throw new Exception("Priority not found");
        }

        priority.Name = dto.Name.Trim();
        priority.Color = dto.Color.Trim().ToLower();
        priority.IsActive = dto.IsActive;
        priority.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new PriorityDto
        {
            Id = priority.Id,
            Name = priority.Name,
            Color = priority.Color,
            IsActive = priority.IsActive
        };
    }

    public async Task DeleteAsync(Guid id)
    {
        var priority = await _context.Priorities.FirstOrDefaultAsync(p => p.Id == id);

        if (priority is null)
        {
            throw new Exception("Priority not found");
        }

        _context.Priorities.Remove(priority);

        await _context.SaveChangesAsync();
    }
}
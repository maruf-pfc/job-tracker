using JobTracker.API.Configs;
using JobTracker.API.DTOs.SourcePlatform;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class SourcePlatformService : ISourcePlatformService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SourcePlatformService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<SourcePlatformDto>> GetAllAsync()
    {
        var userId = _currentUser.UserId;
        return await _context.SourcePlatforms
            .Where(s => s.UserId == userId || s.UserId == null)
            .OrderBy(s => s.Name)
            .Select(s => new SourcePlatformDto
            {
                Id = s.Id,
                Name = s.Name,
            })
            .ToListAsync();
    }

    public async Task<SourcePlatformDto> CreateAsync(CreateSourcePlatformDto dto)
    {
        var entity = new SourcePlatform
        {
            Name = dto.Name,
            UserId = _currentUser.UserId
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
        var userId = _currentUser.UserId;
        var entity = await _context.SourcePlatforms
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (entity is null)
        {
            return false;
        }

        _context.SourcePlatforms.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
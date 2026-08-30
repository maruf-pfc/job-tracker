using JobTracker.API.Configs;
using JobTracker.API.DTOs.Company;
using JobTracker.API.Exceptions;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class CompanyService : ICompanyService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CompanyService(AppDbContext context, ICurrentUserService currentUser)
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

    public async Task<List<CompanyDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        return await _context.Companies
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                Name = c.Name,
                CareerPageUrl = c.CareerPageUrl,
                WebsiteUrl = c.WebsiteUrl,
                Location = c.Location,
                IsFavorite = c.IsFavorite,
                IsArchived = c.IsArchived,
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<CompanyDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        return await _context.Companies
            .AsNoTracking()
            .Where(c => c.Id == id && c.UserId == userId)
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                Name = c.Name,
                CareerPageUrl = c.CareerPageUrl,
                WebsiteUrl = c.WebsiteUrl,
                Location = c.Location,
                IsFavorite = c.IsFavorite,
                IsArchived = c.IsArchived,
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var company = new Company
        {
            Name = dto.Name.Trim(),
            CareerPageUrl = dto.CareerPageUrl?.Trim(),
            WebsiteUrl = dto.WebsiteUrl?.Trim(),
            Location = dto.Location?.Trim(),
            Notes = dto.Notes?.Trim(),
            UserId = userId
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync(cancellationToken);

        return new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            CareerPageUrl = company.CareerPageUrl,
            WebsiteUrl = company.WebsiteUrl,
            Location = company.Location,
            IsFavorite = company.IsFavorite,
            IsArchived = company.IsArchived,
        };
    }

    public async Task<CompanyDto?> UpdateAsync(Guid id, CreateCompanyDto dto, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId, cancellationToken);
        if (company is null)
        {
            return null;
        }

        company.Name = dto.Name.Trim();
        company.CareerPageUrl = dto.CareerPageUrl?.Trim();
        company.WebsiteUrl = dto.WebsiteUrl?.Trim();
        company.Location = dto.Location?.Trim();
        company.Notes = dto.Notes?.Trim();
        company.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            CareerPageUrl = company.CareerPageUrl,
            WebsiteUrl = company.WebsiteUrl,
            Location = company.Location,
            IsFavorite = company.IsFavorite,
            IsArchived = company.IsArchived,
        };
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId, cancellationToken);

        if (company is null)
        {
            return false;
        }

        // Delete linked job applications for this user first
        var linkedApps = await _context.JobApplications
            .Where(j => j.CompanyId == id && j.UserId == userId)
            .ToListAsync(cancellationToken);

        if (linkedApps.Any())
        {
            _context.JobApplications.RemoveRange(linkedApps);
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
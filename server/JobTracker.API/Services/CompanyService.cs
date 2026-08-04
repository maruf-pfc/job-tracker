using JobTracker.API.Configs;
using JobTracker.API.DTOs.Company;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class CompanyService : ICompanyService
{
    private readonly AppDbContext _context;

    public CompanyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyDto>> GetAllAsync()
    {
        return await _context.Companies
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
            .ToListAsync();
    }

    public async Task<CompanyDto?> GetByIdAsync(Guid id)
    {
        return await _context.Companies
            .Where(c => c.Id == id)
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
            .FirstOrDefaultAsync();
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto)
    {
        var company = new Company
        {
            Name = dto.Name.Trim(),
            CareerPageUrl = dto.CareerPageUrl?.Trim(),
            WebsiteUrl = dto.WebsiteUrl?.Trim(),
            Location = dto.Location?.Trim(),
            Notes = dto.Notes?.Trim(),
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

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

    public async Task<CompanyDto?> UpdateAsync(Guid id, CreateCompanyDto dto)
    {
        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == id);
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

        await _context.SaveChangesAsync();

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

    public async Task<bool> DeleteAsync(Guid id)
    {
        var company = await _context.Companies
            .Include(c => c.JobApplications)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company is null)
        {
            return false;
        }

        if (company.JobApplications != null && company.JobApplications.Any())
        {
            _context.JobApplications.RemoveRange(company.JobApplications);
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync();
        return true;
    }
}
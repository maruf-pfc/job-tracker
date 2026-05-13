using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobApplication;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class JobApplicationService : IJobApplicationService
{
    private readonly AppDbContext _context;

    private readonly ICurrentUserService _currentUser;

    public JobApplicationService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PaginatedResponseDto<JobApplicationDto>> GetAllAsync(JobApplicationQueryDto query)
    {
        var userId = _currentUser.UserId;

        var applicationsQuery = _context.JobApplications
                .Where(j => j.UserId == userId)
                .AsQueryable();

        // Search
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            applicationsQuery = applicationsQuery.Where(j =>
                    j.CompanyName.ToLower().Contains(search) || j.Role.ToLower().Contains(search)
                );
        }

        // Filters
        if (query.PriorityId.HasValue)
        {
            applicationsQuery = applicationsQuery.Where(j =>
                    j.PriorityId == query.PriorityId
                );
        }

        if (query.JobTypeId.HasValue)
        {
            applicationsQuery = applicationsQuery.Where(j =>
                    j.JobTypeId == query.JobTypeId
                );
        }

        if (query.SourcePlatformId.HasValue)
        {
            applicationsQuery = applicationsQuery.Where(j =>
                    j.SourcePlatformId ==
                    query.SourcePlatformId
                );
        }

        if (query.ApplicationStatusId.HasValue)
        {
            applicationsQuery = applicationsQuery.Where(j =>
                    j.ApplicationStatusId ==
                    query.ApplicationStatusId
                );
        }

        if (query.WorkTypeId.HasValue)
        {
            applicationsQuery = applicationsQuery.Where(j =>
                    j.WorkTypeId == query.WorkTypeId
                );
        }

        // Sorting
        applicationsQuery =
            query.SortDirection.ToLower() == "asc"
                ? applicationsQuery.OrderBy(j => j.AppliedAt)
                : applicationsQuery.OrderByDescending(
                    j => j.AppliedAt
                );

        // Pagination
        var totalCount = await applicationsQuery.CountAsync();

        var items = await applicationsQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(j => new JobApplicationDto
            {
                Id = j.Id,
                CompanyName = j.CompanyName,
                Role = j.Role,
                JobUrl = j.JobUrl,
                Location = j.Location,
                SalaryRange = j.SalaryRange,
                Notes = j.Notes,
                AppliedAt = j.AppliedAt,
                Priority = j.Priority.Name,
                JobType = j.JobType.Name,
                SourcePlatform = j.SourcePlatform.Name,
                ApplicationStatus = j.ApplicationStatus.Name,
                WorkType = j.WorkType.Name
            })
            .ToListAsync();

        return new PaginatedResponseDto<JobApplicationDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };
    }

    public async Task<JobApplicationDto?> GetByIdAsync(Guid id)
    {
        var userId = _currentUser.UserId;

        return await _context.JobApplications
            .Where(j =>
                j.Id == id &&
                j.UserId == userId
            )
            .Select(j => new JobApplicationDto
            {
                Id = j.Id,
                CompanyName = j.CompanyName,
                Role = j.Role,
                JobUrl = j.JobUrl,
                Location = j.Location,
                SalaryRange = j.SalaryRange,
                Notes = j.Notes,
                AppliedAt = j.AppliedAt,
                Priority = j.Priority.Name,
                JobType = j.JobType.Name,
                SourcePlatform = j.SourcePlatform.Name,
                ApplicationStatus = j.ApplicationStatus.Name,
                WorkType = j.WorkType.Name
            })
            .FirstOrDefaultAsync();
    }

    public async Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto)
    {
        var userId = _currentUser.UserId;

        var application = new JobApplication
        {
            CompanyName = dto.CompanyName.Trim(),
            Role = dto.Role.Trim(),
            JobUrl = dto.JobUrl?.Trim(),
            Location = dto.Location?.Trim(),
            SalaryRange = dto.SalaryRange?.Trim(),
            Notes = dto.Notes?.Trim(),
            AppliedAt = dto.AppliedAt,
            UserId = userId!.Value,
            PriorityId = dto.PriorityId,
            JobTypeId = dto.JobTypeId,
            SourcePlatformId = dto.SourcePlatformId,
            ApplicationStatusId = dto.ApplicationStatusId,
            WorkTypeId = dto.WorkTypeId
        };

        _context.JobApplications.Add(application);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(application.Id) ?? throw new Exception("Failed to create application");
    }

    public async Task<JobApplicationDto> UpdateAsync(Guid id, UpdateJobApplicationDto dto)
    {
        var userId = _currentUser.UserId;

        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j =>
                j.Id == id &&
                j.UserId == userId
            );

        if (application is null)
        {
            throw new Exception("Application not found");
        }

        application.CompanyName = dto.CompanyName.Trim();
        application.Role = dto.Role.Trim();
        application.JobUrl = dto.JobUrl?.Trim();
        application.Location = dto.Location?.Trim();
        application.SalaryRange = dto.SalaryRange?.Trim();
        application.Notes = dto.Notes?.Trim();
        application.AppliedAt = dto.AppliedAt;
        application.PriorityId = dto.PriorityId;
        application.JobTypeId = dto.JobTypeId;
        application.SourcePlatformId = dto.SourcePlatformId;
        application.ApplicationStatusId = dto.ApplicationStatusId;
        application.WorkTypeId = dto.WorkTypeId;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id) ?? throw new Exception("Application not found");
    }

    public async Task DeleteAsync(Guid id)
    {
        var userId = _currentUser.UserId;

        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j =>
                j.Id == id &&
                j.UserId == userId
            );

        if (application is null)
        {
            throw new Exception("Application not found");
        }

        _context.JobApplications.Remove(application);

        await _context.SaveChangesAsync();
    }
}
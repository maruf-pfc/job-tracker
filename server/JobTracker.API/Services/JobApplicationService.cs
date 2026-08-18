using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobApplication;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using JobTracker.API.DTOs.Common;

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
                    j.Company.Name.ToLower().Contains(search) || j.Role.ToLower().Contains(search)
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

        // Sorting (default: new to old based on creation time)
        var isAsc = query.SortDirection.Equals("asc", StringComparison.OrdinalIgnoreCase);
        applicationsQuery = query.SortBy?.ToLowerInvariant() switch
        {
            "appliedat" => isAsc
                ? applicationsQuery.OrderBy(j => j.AppliedAt).ThenBy(j => j.CreatedAt)
                : applicationsQuery.OrderByDescending(j => j.AppliedAt).ThenByDescending(j => j.CreatedAt),
            "company" => isAsc
                ? applicationsQuery.OrderBy(j => j.Company.Name)
                : applicationsQuery.OrderByDescending(j => j.Company.Name),
            "role" => isAsc
                ? applicationsQuery.OrderBy(j => j.Role)
                : applicationsQuery.OrderByDescending(j => j.Role),
            "createdat" or _ => isAsc
                ? applicationsQuery.OrderBy(j => j.CreatedAt)
                : applicationsQuery.OrderByDescending(j => j.CreatedAt)
        };

        // Pagination
        var totalCount = await applicationsQuery.CountAsync();

        var items = await applicationsQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(j => new JobApplicationDto
            {
                Id = j.Id,
                Company = j.Company.Name,
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
                WorkType = j.WorkType.Name,
                CoverLetter = j.CoverLetter,
                ResumeDriveLink = j.ResumeDriveLink,
                FollowUpDate = j.FollowUpDate,
                IsArchived = j.IsArchived,
                CreatedAt = j.CreatedAt,
                UpdatedAt = j.UpdatedAt,
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
                Company = j.Company.Name,
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
                WorkType = j.WorkType.Name,
                CoverLetter = j.CoverLetter,
                ResumeDriveLink = j.ResumeDriveLink,
                FollowUpDate = j.FollowUpDate,
                IsArchived = j.IsArchived,
                CreatedAt = j.CreatedAt,
                UpdatedAt = j.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto)
    {
        var userId = _currentUser.UserId;

        var appliedAtUtc = dto.AppliedAt == default || dto.AppliedAt.Year < 1970
            ? DateTime.UtcNow
            : DateTime.SpecifyKind(dto.AppliedAt, DateTimeKind.Utc);

        var followUpDateUtc = dto.FollowUpDate.HasValue && dto.FollowUpDate.Value.Year >= 1970
            ? DateTime.SpecifyKind(dto.FollowUpDate.Value, DateTimeKind.Utc)
            : (DateTime?)null;

        var application = new JobApplication
        {
            CompanyId = dto.CompanyId,
            Role = dto.Role.Trim(),
            JobUrl = dto.JobUrl?.Trim(),
            Location = dto.Location?.Trim(),
            SalaryRange = dto.SalaryRange?.Trim(),
            Notes = dto.Notes?.Trim(),
            AppliedAt = appliedAtUtc,
            UserId = userId!.Value,
            PriorityId = dto.PriorityId,
            JobTypeId = dto.JobTypeId,
            SourcePlatformId = dto.SourcePlatformId,
            ApplicationStatusId = dto.ApplicationStatusId,
            WorkTypeId = dto.WorkTypeId,
            CoverLetter = dto.CoverLetter?.Trim(),
            ResumeDriveLink = dto.ResumeDriveLink?.Trim(),
            FollowUpDate = followUpDateUtc,
            IsArchived = dto.IsArchived,
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

        if (dto.AppliedAt != default && dto.AppliedAt.Year >= 1970)
        {
            application.AppliedAt = DateTime.SpecifyKind(dto.AppliedAt, DateTimeKind.Utc);
        }

        application.CompanyId = dto.CompanyId;
        application.Role = dto.Role.Trim();
        application.JobUrl = dto.JobUrl?.Trim();
        application.Location = dto.Location?.Trim();
        application.SalaryRange = dto.SalaryRange?.Trim();
        application.Notes = dto.Notes?.Trim();
        application.PriorityId = dto.PriorityId;
        application.JobTypeId = dto.JobTypeId;
        application.SourcePlatformId = dto.SourcePlatformId;
        application.ApplicationStatusId = dto.ApplicationStatusId;
        application.WorkTypeId = dto.WorkTypeId;
        application.UpdatedAt = DateTime.UtcNow;
        application.CoverLetter = dto.CoverLetter?.Trim();
        application.ResumeDriveLink = dto.ResumeDriveLink?.Trim();
        application.FollowUpDate = dto.FollowUpDate.HasValue && dto.FollowUpDate.Value.Year >= 1970
            ? DateTime.SpecifyKind(dto.FollowUpDate.Value, DateTimeKind.Utc)
            : (DateTime?)null;
        application.IsArchived = dto.IsArchived;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id) ?? throw new Exception("Application not found");
    }

    public async Task<JobApplicationDto> UpdateStatusAsync(Guid id, Guid statusId)
    {
        var userId = _currentUser.UserId;
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

        if (application is null)
        {
            throw new Exception("Application not found");
        }

        var statusExists = await _context.ApplicationStatuses.AnyAsync(s => s.Id == statusId);
        if (!statusExists)
        {
            throw new Exception("Invalid application status ID");
        }

        application.ApplicationStatusId = statusId;
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
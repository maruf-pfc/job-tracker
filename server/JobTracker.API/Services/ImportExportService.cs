using System.Text;
using JobTracker.API.Configs;
using JobTracker.API.Exceptions;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class ImportExportService : IImportExportService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public ImportExportService(AppDbContext context, ICurrentUserService currentUser)
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

    public async Task<byte[]> ExportCsvAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var applications = await _context.JobApplications
            .AsNoTracking()
            .Include(j => j.Company)
            .Include(j => j.Priority)
            .Include(j => j.JobType)
            .Include(j => j.WorkType)
            .Include(j => j.SourcePlatform)
            .Include(j => j.ApplicationStatus)
            .Where(j => j.UserId == userId)
            .OrderByDescending(j => j.AppliedAt)
            .ToListAsync(cancellationToken);

        var sb = new StringBuilder();
        sb.AppendLine("Company,Role,JobUrl,Location,SalaryRange,Priority,JobType,WorkType,SourcePlatform,ApplicationStatus,AppliedAt,Notes");

        foreach (var app in applications)
        {
            var company = EscapeCsvField(app.Company?.Name);
            var role = EscapeCsvField(app.Role);
            var jobUrl = EscapeCsvField(app.JobUrl);
            var location = EscapeCsvField(app.Location);
            var salaryRange = EscapeCsvField(app.SalaryRange);
            var priority = EscapeCsvField(app.Priority?.Name);
            var jobType = EscapeCsvField(app.JobType?.Name);
            var workType = EscapeCsvField(app.WorkType?.Name);
            var sourcePlatform = EscapeCsvField(app.SourcePlatform?.Name);
            var status = EscapeCsvField(app.ApplicationStatus?.Name);
            var appliedAt = app.AppliedAt.ToString("o");
            var notes = EscapeCsvField(app.Notes);

            sb.AppendLine($"{company},{role},{jobUrl},{location},{salaryRange},{priority},{jobType},{workType},{sourcePlatform},{status},{appliedAt},{notes}");
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    public async Task<int> ImportCsvAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            throw new BadRequestException("Uploaded file is empty.");
        }

        var userId = GetRequiredUserId();

        using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
        var content = await reader.ReadToEndAsync(cancellationToken);
        var lines = content.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

        if (lines.Length <= 1)
        {
            return 0; // Header only or empty file
        }

        // Default fallbacks
        var defaultPriority = await _context.Priorities.FirstOrDefaultAsync(cancellationToken) 
            ?? new Priority { Name = "Medium", Color = "amber" };
        var defaultJobType = await _context.JobTypes.FirstOrDefaultAsync(cancellationToken) 
            ?? new JobType { Name = "Full Time" };
        var defaultWorkType = await _context.WorkTypes.FirstOrDefaultAsync(cancellationToken) 
            ?? new WorkType { Name = "Remote" };
        var defaultPlatform = await _context.SourcePlatforms.FirstOrDefaultAsync(cancellationToken) 
            ?? new SourcePlatform { Name = "LinkedIn" };
        var defaultStatus = await _context.ApplicationStatuses.FirstOrDefaultAsync(cancellationToken) 
            ?? new ApplicationStatus { Name = "Applied" };

        var count = 0;
        for (int i = 1; i < lines.Length; i++)
        {
            var fields = ParseCsvLine(lines[i]);
            if (fields.Length < 2) continue;

            var companyName = fields[0].Trim();
            var role = fields[1].Trim();

            if (string.IsNullOrWhiteSpace(companyName) || string.IsNullOrWhiteSpace(role)) continue;

            // Find or create Company isolated to the current user
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Name.ToLower() == companyName.ToLower(), cancellationToken);

            if (company is null)
            {
                company = new Company 
                { 
                    Name = companyName,
                    UserId = userId
                };
                _context.Companies.Add(company);
                await _context.SaveChangesAsync(cancellationToken);
            }

            var jobUrl = fields.Length > 2 ? fields[2] : null;
            var location = fields.Length > 3 ? fields[3] : null;
            var salaryRange = fields.Length > 4 ? fields[4] : null;
            var notes = fields.Length > 11 ? fields[11] : null;

            var application = new JobApplication
            {
                UserId = userId,
                CompanyId = company.Id,
                Role = role,
                JobUrl = string.IsNullOrWhiteSpace(jobUrl) ? null : jobUrl,
                Location = string.IsNullOrWhiteSpace(location) ? null : location,
                SalaryRange = string.IsNullOrWhiteSpace(salaryRange) ? null : salaryRange,
                Notes = string.IsNullOrWhiteSpace(notes) ? null : notes,
                PriorityId = defaultPriority.Id,
                JobTypeId = defaultJobType.Id,
                WorkTypeId = defaultWorkType.Id,
                SourcePlatformId = defaultPlatform.Id,
                ApplicationStatusId = defaultStatus.Id,
                AppliedAt = DateTime.UtcNow
            };

            _context.JobApplications.Add(application);
            count++;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return count;
    }

    private static string EscapeCsvField(string? field)
    {
        if (string.IsNullOrEmpty(field)) return string.Empty;
        if (field.Contains(",") || field.Contains("\"") || field.Contains("\n"))
        {
            return $"\"{field.Replace("\"", "\"\"")}\"";
        }
        return field;
    }

    private static string[] ParseCsvLine(string line)
    {
        var result = new List<string>();
        var sb = new StringBuilder();
        bool inQuotes = false;

        for (int i = 0; i < line.Length; i++)
        {
            char c = line[i];
            if (c == '"')
            {
                if (inQuotes && i + 1 < line.Length && line[i + 1] == '"')
                {
                    sb.Append('"');
                    i++;
                }
                else
                {
                    inQuotes = !inQuotes;
                }
            }
            else if (c == ',' && !inQuotes)
            {
                result.Add(sb.ToString());
                sb.Clear();
            }
            else
            {
                sb.Append(c);
            }
        }

        result.Add(sb.ToString());
        return result.ToArray();
    }
}

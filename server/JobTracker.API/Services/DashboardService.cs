using JobTracker.API.Configs;
using JobTracker.API.DTOs.Dashboard;
using JobTracker.API.Exceptions;
using JobTracker.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DashboardService(AppDbContext context, ICurrentUserService currentUser)
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

    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var apps = await _context.JobApplications
            .AsNoTracking()
            .Where(j => j.UserId == userId)
            .Select(j => new
            {
                Status = j.ApplicationStatus.Name,
                HasInterviewRounds = j.InterviewRounds.Any(),
                PassedRounds = j.InterviewRounds.Count(r => r.Result == Models.InterviewResult.Passed)
            })
            .ToListAsync(cancellationToken);

        bool IsInterviewStatus(string s) =>
            s.Equals("Interview", StringComparison.OrdinalIgnoreCase) ||
            s.Equals("Interviewing", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Exam", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Viva", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Preliminary", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Skill Test", StringComparison.OrdinalIgnoreCase);

        int GetStatusCount(string name) => apps.Count(a => string.Equals(a.Status, name, StringComparison.OrdinalIgnoreCase));

        return new DashboardSummaryDto
        {
            TotalApplications = apps.Count,
            TotalInterviews = apps.Count(a => a.HasInterviewRounds || IsInterviewStatus(a.Status)),
            TotalOffers = GetStatusCount("Offer"),
            TotalRejected = GetStatusCount("Rejected"),
            TotalSaved = GetStatusCount("Saved"),
            TotalInterviewRoundsPassed = apps.Sum(a => a.PassedRounds)
        };
    }

    public async Task<List<ApplicationStatusChartDto>> GetApplicationsByStatusAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();

        return await _context.JobApplications
            .AsNoTracking()
            .Where(j => j.UserId == userId)
            .GroupBy(j => j.ApplicationStatus.Name)
            .Select(group =>
                new ApplicationStatusChartDto
                {
                    Status = group.Key,
                    Count = group.Count()
                }
            )
            .OrderByDescending(x => x.Count)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<PlatformAnalyticsDto>> GetApplicationsByPlatformAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();

        return await _context.JobApplications
            .AsNoTracking()
            .Where(j => j.UserId == userId)
            .GroupBy(j => j.SourcePlatform.Name)
            .Select(group =>
                new PlatformAnalyticsDto
                {
                    Platform = group.Key,
                    Count = group.Count()
                }
            )
            .OrderByDescending(x => x.Count)
            .ToListAsync(cancellationToken);
    }

    public async Task<DashboardAnalyticsDto> GetAnalyticsAsync(CancellationToken cancellationToken = default)
    {
        var userId = GetRequiredUserId();
        var applications = await _context.JobApplications
            .AsNoTracking()
            .Where(j => j.UserId == userId)
            .Select(j => new
            {
                j.AppliedAt,
                Status = j.ApplicationStatus.Name,
                Platform = j.SourcePlatform != null ? j.SourcePlatform.Name : "Direct / Other",
                Priority = j.Priority != null ? j.Priority.Name : "Medium",
                WorkType = j.WorkType != null ? j.WorkType.Name : "Hybrid",
                HasInterviewRounds = j.InterviewRounds.Any()
            })
            .ToListAsync(cancellationToken);

        bool IsInterviewStatus(string s) =>
            s.Equals("Interview", StringComparison.OrdinalIgnoreCase) ||
            s.Equals("Interviewing", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Exam", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Viva", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Preliminary", StringComparison.OrdinalIgnoreCase) ||
            s.Contains("Skill Test", StringComparison.OrdinalIgnoreCase);

        var totalCount = applications.Count;
        var interviewCount = applications.Count(j => 
            j.HasInterviewRounds ||
            (j.Status != null && IsInterviewStatus(j.Status)));
        
        var offerCount = applications.Count(j => 
            j.Status != null &&
            j.Status.Equals("Offer", StringComparison.OrdinalIgnoreCase));

        var respondedCount = applications.Count(j => 
            j.HasInterviewRounds ||
            (j.Status != null && (
            IsInterviewStatus(j.Status) ||
            j.Status.Equals("Offer", StringComparison.OrdinalIgnoreCase) ||
            j.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase))));

        var responseRate = totalCount > 0 ? Math.Round((double)respondedCount / totalCount * 100, 1) : 0;
        var conversionRate = interviewCount > 0 ? Math.Round((double)offerCount / interviewCount * 100, 1) : 0;

        var weeklyTrends = applications
            .GroupBy(j => GetWeekOfYear(j.AppliedAt))
            .OrderBy(g => g.Key)
            .Select(g => new WeeklyApplicationTrendDto
            {
                WeekLabel = $"Week {g.Key}",
                ApplicationCount = g.Count()
            })
            .ToList();

        var statusBreakdown = applications
            .GroupBy(j => j.Status ?? "Unknown")
            .Select(g => new ApplicationStatusChartDto { Status = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .ToList();

        var platformBreakdown = applications
            .GroupBy(j => j.Platform ?? "Direct / Other")
            .Select(g => new PlatformAnalyticsDto { Platform = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .ToList();

        var priorityBreakdown = applications
            .GroupBy(j => j.Priority ?? "Medium")
            .Select(g => new PriorityAnalyticsDto { Priority = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .ToList();

        var workTypeBreakdown = applications
            .GroupBy(j => j.WorkType ?? "Hybrid")
            .Select(g => new WorkTypeAnalyticsDto { WorkType = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .ToList();

        return new DashboardAnalyticsDto
        {
            TotalApplications = totalCount,
            TotalInterviews = interviewCount,
            TotalOffers = offerCount,
            ResponseRatePercentage = responseRate,
            InterviewConversionRatePercentage = conversionRate,
            WeeklyTrends = weeklyTrends,
            StatusBreakdown = statusBreakdown,
            PlatformBreakdown = platformBreakdown,
            PriorityBreakdown = priorityBreakdown,
            WorkTypeBreakdown = workTypeBreakdown
        };
    }

    private static int GetWeekOfYear(DateTime date)
    {
        return System.Globalization.CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
            date, 
            System.Globalization.CalendarWeekRule.FirstFourDayWeek, 
            DayOfWeek.Monday);
    }
}
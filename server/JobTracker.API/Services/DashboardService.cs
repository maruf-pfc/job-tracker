using JobTracker.API.Configs;
using JobTracker.API.DTOs.Dashboard;
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


    public async Task<DashboardSummaryDto>GetSummaryAsync()
    {
        var userId = _currentUser.UserId;
        var applications = _context.JobApplications.Where(j => j.UserId == userId);

        return new DashboardSummaryDto
        {
            TotalApplications = await applications.CountAsync(),

            TotalInterviews = await applications.CountAsync(j =>
                    j.ApplicationStatus.Name == "Interview"
                ),

            TotalOffers = await applications.CountAsync(j =>
                    j.ApplicationStatus.Name == "Offer"
                ),

            TotalRejected = await applications.CountAsync(j =>
                    j.ApplicationStatus.Name == "Rejected"
                ),

            TotalSaved = await applications.CountAsync(j =>
                    j.ApplicationStatus.Name == "Saved"
                )
        };
    }

    public async Task<List<ApplicationStatusChartDto>> GetApplicationsByStatusAsync()
    {
        var userId = _currentUser.UserId;

        return await _context.JobApplications
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
            .ToListAsync();
    }

    public async Task<List<PlatformAnalyticsDto>> GetApplicationsByPlatformAsync()
    {
        var userId = _currentUser.UserId;

        return await _context.JobApplications
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
            .ToListAsync();
    }

    public async Task<DashboardAnalyticsDto> GetAnalyticsAsync()
    {
        var userId = _currentUser.UserId;
        var applications = await _context.JobApplications
            .Include(j => j.ApplicationStatus)
            .Where(j => j.UserId == userId)
            .ToListAsync();

        var totalCount = applications.Count;
        var interviewCount = applications.Count(j => 
            j.ApplicationStatus.Name.Equals("Interview", StringComparison.OrdinalIgnoreCase) || 
            j.ApplicationStatus.Name.Equals("Interviewing", StringComparison.OrdinalIgnoreCase));
        
        var offerCount = applications.Count(j => 
            j.ApplicationStatus.Name.Equals("Offer", StringComparison.OrdinalIgnoreCase));

        var respondedCount = applications.Count(j => 
            j.ApplicationStatus.Name.Equals("Interview", StringComparison.OrdinalIgnoreCase) ||
            j.ApplicationStatus.Name.Equals("Interviewing", StringComparison.OrdinalIgnoreCase) ||
            j.ApplicationStatus.Name.Equals("Offer", StringComparison.OrdinalIgnoreCase) ||
            j.ApplicationStatus.Name.Equals("Rejected", StringComparison.OrdinalIgnoreCase));

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

        return new DashboardAnalyticsDto
        {
            TotalApplications = totalCount,
            TotalInterviews = interviewCount,
            TotalOffers = offerCount,
            ResponseRatePercentage = responseRate,
            InterviewConversionRatePercentage = conversionRate,
            WeeklyTrends = weeklyTrends
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
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
}
using JobTracker.API.Configs;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class DashboardServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAnalyticsAsync_ShouldCalculateCorrectPercentages()
    {
        var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();

        var appliedStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Applied" };
        var interviewStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Interviewing" };
        var offerStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Offer" };
        var rejectedStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Rejected" };

        db.ApplicationStatuses.AddRange(appliedStatus, interviewStatus, offerStatus, rejectedStatus);

        db.JobApplications.AddRange(
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, ApplicationStatusId = appliedStatus.Id, ApplicationStatus = appliedStatus, AppliedAt = DateTime.UtcNow },
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, ApplicationStatusId = interviewStatus.Id, ApplicationStatus = interviewStatus, AppliedAt = DateTime.UtcNow },
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, ApplicationStatusId = offerStatus.Id, ApplicationStatus = offerStatus, AppliedAt = DateTime.UtcNow },
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, ApplicationStatusId = rejectedStatus.Id, ApplicationStatus = rejectedStatus, AppliedAt = DateTime.UtcNow }
        );

        await db.SaveChangesAsync();

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userId);

        var service = new DashboardService(db, mockUser.Object);

        var analytics = await service.GetAnalyticsAsync();

        Assert.Equal(4, analytics.TotalApplications);
        Assert.Equal(1, analytics.TotalInterviews);
        Assert.Equal(1, analytics.TotalOffers);
        Assert.Equal(75.0, analytics.ResponseRatePercentage); // 3 responded out of 4 = 75%
        Assert.Equal(100.0, analytics.InterviewConversionRatePercentage); // 1 offer out of 1 interview = 100%
    }
}

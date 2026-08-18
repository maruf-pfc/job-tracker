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

        var company = new Company { Id = Guid.NewGuid(), Name = "Test Inc" };
        var priority = new Priority { Id = Guid.NewGuid(), Name = "High" };
        var jobType = new JobType { Id = Guid.NewGuid(), Name = "Full-time" };
        var platform = new SourcePlatform { Id = Guid.NewGuid(), Name = "LinkedIn" };
        var workType = new WorkType { Id = Guid.NewGuid(), Name = "Remote" };

        var appliedStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Applied" };
        var interviewStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Interviewing" };
        var offerStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Offer" };
        var rejectedStatus = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Rejected" };

        db.Companies.Add(company);
        db.Priorities.Add(priority);
        db.JobTypes.Add(jobType);
        db.SourcePlatforms.Add(platform);
        db.WorkTypes.Add(workType);
        db.ApplicationStatuses.AddRange(appliedStatus, interviewStatus, offerStatus, rejectedStatus);
        await db.SaveChangesAsync();

        db.JobApplications.AddRange(
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, CompanyId = company.Id, PriorityId = priority.Id, JobTypeId = jobType.Id, SourcePlatformId = platform.Id, WorkTypeId = workType.Id, ApplicationStatusId = appliedStatus.Id, ApplicationStatus = appliedStatus, AppliedAt = DateTime.UtcNow },
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, CompanyId = company.Id, PriorityId = priority.Id, JobTypeId = jobType.Id, SourcePlatformId = platform.Id, WorkTypeId = workType.Id, ApplicationStatusId = interviewStatus.Id, ApplicationStatus = interviewStatus, AppliedAt = DateTime.UtcNow },
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, CompanyId = company.Id, PriorityId = priority.Id, JobTypeId = jobType.Id, SourcePlatformId = platform.Id, WorkTypeId = workType.Id, ApplicationStatusId = offerStatus.Id, ApplicationStatus = offerStatus, AppliedAt = DateTime.UtcNow },
            new JobApplication { Id = Guid.NewGuid(), UserId = userId, CompanyId = company.Id, PriorityId = priority.Id, JobTypeId = jobType.Id, SourcePlatformId = platform.Id, WorkTypeId = workType.Id, ApplicationStatusId = rejectedStatus.Id, ApplicationStatus = rejectedStatus, AppliedAt = DateTime.UtcNow }
        );

        await db.SaveChangesAsync();

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userId);

        var service = new JobTracker.API.Services.DashboardService(db, mockUser.Object);

        var analytics = await service.GetAnalyticsAsync();

        Assert.Equal(4, analytics.TotalApplications);
        Assert.Equal(1, analytics.TotalInterviews);
        Assert.Equal(1, analytics.TotalOffers);
        Assert.Equal(75.0, analytics.ResponseRatePercentage); // 3 responded out of 4 = 75%
        Assert.Equal(100.0, analytics.InterviewConversionRatePercentage); // 1 offer out of 1 interview = 100%
    }
}

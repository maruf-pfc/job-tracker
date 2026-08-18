using JobTracker.API.Configs;
using JobTracker.API.DTOs.Rejection;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class RejectionRetrospectiveServiceTests
{
    private static (AppDbContext context, Mock<ICurrentUserService> currentUserMock, Guid userId, Guid appId) CreateTestContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        var userId = Guid.NewGuid();
        var appId = Guid.NewGuid();

        var currentUserMock = new Mock<ICurrentUserService>();
        currentUserMock.Setup(u => u.UserId).Returns(userId);

        var user = new User
        {
            Id = userId,
            UserName = "test@jobtracker.dev",
            Email = "test@jobtracker.dev"
        };
        context.Users.Add(user);

        var company = new Company { Id = Guid.NewGuid(), Name = "Microsoft" };
        var priority = new Priority { Id = Guid.NewGuid(), Name = "High", Color = "red" };
        var jobType = new JobType { Id = Guid.NewGuid(), Name = "Full Time" };
        var status = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Rejected" };
        var platform = new SourcePlatform { Id = Guid.NewGuid(), Name = "LinkedIn" };
        var workType = new WorkType { Id = Guid.NewGuid(), Name = "Remote" };

        context.Companies.Add(company);
        context.Priorities.Add(priority);
        context.JobTypes.Add(jobType);
        context.ApplicationStatuses.Add(status);
        context.SourcePlatforms.Add(platform);
        context.WorkTypes.Add(workType);

        var app = new JobApplication
        {
            Id = appId,
            UserId = userId,
            CompanyId = company.Id,
            PriorityId = priority.Id,
            JobTypeId = jobType.Id,
            ApplicationStatusId = status.Id,
            SourcePlatformId = platform.Id,
            WorkTypeId = workType.Id,
            Role = "Senior Architect"
        };
        context.JobApplications.Add(app);
        context.SaveChanges();

        return (context, currentUserMock, userId, appId);
    }

    [Fact]
    public async Task UpsertRetrospectiveAsync_ShouldCreateNewRetrospective_WhenNoneExists()
    {
        var (context, currentUserMock, userId, appId) = CreateTestContext();
        var service = new RejectionRetrospectiveService(context, currentUserMock.Object);

        var dto = new CreateRejectionRetrospectiveDto
        {
            JobDomain = "Corporate",
            FailedStage = "System Design Round",
            PrimaryRootCause = "Technical Depth & Core Concepts",
            PreparationTime = "1-3 months",
            MockCount = "1-3 mocks",
            DifficultyRating = 4,
            TimePressureRating = 3,
            ConfidenceRating = 7,
            EstimatedScore = 80,
            ExpectedCutoffScore = 85,
            SpecificWeaknessTags = new List<string> { "System Design", "Scalability" },
            TechnicalTopicGaps = new List<string> { "Microservices & Distributed Transactions" },
            WhatWentWell = "Coding round cleared",
            WhatFailed = "Struggled with multi-region database failover",
            ActionablePlan = "Read Alex Xu Vol 2"
        };

        var result = await service.UpsertRetrospectiveAsync(appId, dto);

        Assert.NotNull(result);
        Assert.Equal("Corporate", result.JobDomain);
        Assert.Equal("System Design Round", result.FailedStage);
        Assert.Equal(2, result.SpecificWeaknessTags.Count);
        Assert.Single(result.TechnicalTopicGaps);
        Assert.Equal(4, result.DifficultyRating);

        var stored = await context.RejectionRetrospectives.FirstOrDefaultAsync(r => r.JobApplicationId == appId);
        Assert.NotNull(stored);
        Assert.Equal(userId, stored.UserId);
        Assert.Equal(4, stored.DifficultyRating);
    }

    [Fact]
    public async Task UpsertRetrospectiveAsync_ShouldUpdateExisting_WhenAlreadyExists()
    {
        var (context, currentUserMock, userId, appId) = CreateTestContext();
        var service = new RejectionRetrospectiveService(context, currentUserMock.Object);

        var initialDto = new CreateRejectionRetrospectiveDto
        {
            JobDomain = "Corporate",
            FailedStage = "Coding / OA Assessment",
            PrimaryRootCause = "Technical Depth & Core Concepts",
            SpecificWeaknessTags = new List<string> { "LeetCode" }
        };
        await service.UpsertRetrospectiveAsync(appId, initialDto);

        var updatedDto = new CreateRejectionRetrospectiveDto
        {
            JobDomain = "Corporate",
            FailedStage = "System Design Round",
            PrimaryRootCause = "Technical Depth & Core Concepts",
            PreparationTime = "3-6 months",
            DifficultyRating = 5,
            SpecificWeaknessTags = new List<string> { "System Design", "Scalability" },
            ActionablePlan = "New updated plan"
        };
        var result = await service.UpsertRetrospectiveAsync(appId, updatedDto);

        Assert.Equal("System Design Round", result.FailedStage);
        Assert.Equal("New updated plan", result.ActionablePlan);
        Assert.Equal(5, result.DifficultyRating);

        var count = await context.RejectionRetrospectives.CountAsync(r => r.JobApplicationId == appId);
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task GetFailureAnalyticsAsync_ShouldReturnStageBreakdownAndRemediationCards()
    {
        var (context, currentUserMock, userId, appId) = CreateTestContext();
        var service = new RejectionRetrospectiveService(context, currentUserMock.Object);

        // Seed 1 Corporate and 1 Govt retrospective
        await service.UpsertRetrospectiveAsync(appId, new CreateRejectionRetrospectiveDto
        {
            JobDomain = "Corporate",
            FailedStage = "System Design Round",
            PrimaryRootCause = "Technical Depth & Core Concepts",
            PreparationTime = "1-3 months",
            DifficultyRating = 4,
            TimePressureRating = 3,
            ConfidenceRating = 6,
            EstimatedScore = 75,
            ExpectedCutoffScore = 85,
            SpecificWeaknessTags = new List<string> { "System Design", "Caching" },
            TechnicalTopicGaps = new List<string> { "System Design - Scalability & Partitioning" }
        });

        var govtAppId = Guid.NewGuid();
        var govtApp = new JobApplication
        {
            Id = govtAppId,
            UserId = userId,
            CompanyId = (await context.Companies.FirstAsync()).Id,
            PriorityId = (await context.Priorities.FirstAsync()).Id,
            JobTypeId = (await context.JobTypes.FirstAsync()).Id,
            ApplicationStatusId = (await context.ApplicationStatuses.FirstAsync()).Id,
            SourcePlatformId = (await context.SourcePlatforms.FirstAsync()).Id,
            WorkTypeId = (await context.WorkTypes.FirstAsync()).Id,
            Role = "Assistant Programmer"
        };
        context.JobApplications.Add(govtApp);
        await context.SaveChangesAsync();

        await service.UpsertRetrospectiveAsync(govtAppId, new CreateRejectionRetrospectiveDto
        {
            JobDomain = "Govt & Bank",
            FailedStage = "MCQ / Preliminary Test",
            PrimaryRootCause = "Exam Speed & Time Management",
            PreparationTime = "3-6 months",
            DifficultyRating = 4,
            TimePressureRating = 5,
            ConfidenceRating = 4,
            EstimatedScore = 65,
            ExpectedCutoffScore = 75,
            NegativeMarksLost = 5,
            SpecificWeaknessTags = new List<string> { "MCQ Speed Drill", "Math Shortcuts" },
            TechnicalTopicGaps = new List<string> { "Analytical Math & Shortcuts" }
        });

        var analytics = await service.GetFailureAnalyticsAsync();

        Assert.Equal(2, analytics.TotalRetrospectives);
        Assert.Equal(1, analytics.CorporateFailures);
        Assert.Equal(1, analytics.GovtFailures);
        Assert.Equal(4, analytics.AvgDifficultyRating);
        Assert.Equal(4, analytics.AvgTimePressureRating);
        Assert.Equal(10, analytics.AvgCutoffDeficit); // (85-75 + 75-65)/2 = 10
        Assert.Equal(2, analytics.StageBreakdown.Count);
        Assert.True(analytics.RemediationActionPlan.Count >= 2);
    }
}

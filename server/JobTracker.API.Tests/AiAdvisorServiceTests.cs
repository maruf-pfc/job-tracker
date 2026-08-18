using System;
using System.Net.Http;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class AiAdvisorServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static (AppDbContext context, Mock<ICurrentUserService> userMock, Guid userId, Mock<IHttpClientFactory> httpFactoryMock) SetupTestEnv()
    {
        var context = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var userMock = new Mock<ICurrentUserService>();
        userMock.Setup(u => u.UserId).Returns(userId);

        var httpFactoryMock = new Mock<IHttpClientFactory>();
        httpFactoryMock.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(new HttpClient());

        return (context, userMock, userId, httpFactoryMock);
    }

    [Fact]
    public async Task GetCareerAdvisorInsightsAsync_ShouldReturnStarterGuidance_WhenZeroApplications()
    {
        // Arrange
        var (context, userMock, userId, httpFactoryMock) = SetupTestEnv();
        var configMock = new Mock<IConfiguration>();
        var loggerMock = new Mock<ILogger<AiAdvisorService>>();

        var service = new AiAdvisorService(
            context,
            userMock.Object,
            configMock.Object,
            loggerMock.Object,
            httpFactoryMock.Object);

        // Act
        var result = await service.GetCareerAdvisorInsightsAsync(forceRefresh: false);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.TotalApplicationsAnalyzed);
        Assert.True(result.IsCached);
        Assert.Contains("initialized", result.ExecutiveSummary, StringComparison.OrdinalIgnoreCase);
        Assert.NotEmpty(result.ActionPlan);
    }

    [Fact]
    public async Task GetCareerAdvisorInsightsAsync_ShouldReturnCachedData_WhenNoChangesOccur()
    {
        // Arrange
        var (context, userMock, userId, httpFactoryMock) = SetupTestEnv();
        var configMock = new Mock<IConfiguration>();
        var loggerMock = new Mock<ILogger<AiAdvisorService>>();

        // Seed an existing application
        var company = new Company { Id = Guid.NewGuid(), Name = "Google" };
        var status = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Applied" };
        context.Companies.Add(company);
        context.ApplicationStatuses.Add(status);

        var app = new JobApplication
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CompanyId = company.Id,
            ApplicationStatusId = status.Id,
            Role = "Senior Backend Engineer"
        };
        context.JobApplications.Add(app);
        await context.SaveChangesAsync();

        var service = new AiAdvisorService(
            context,
            userMock.Object,
            configMock.Object,
            loggerMock.Object,
            httpFactoryMock.Object);

        // First call (creates fallback or api response and stores in db)
        var firstResult = await service.GetCareerAdvisorInsightsAsync(forceRefresh: false);
        Assert.NotNull(firstResult);

        // Second call with same data state (should hit cache)
        var secondResult = await service.GetCareerAdvisorInsightsAsync(forceRefresh: false);
        Assert.NotNull(secondResult);
        Assert.True(secondResult.IsCached);
        Assert.Equal(firstResult.ExecutiveSummary, secondResult.ExecutiveSummary);
    }
}

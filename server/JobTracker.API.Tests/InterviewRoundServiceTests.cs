using JobTracker.API.Configs;
using JobTracker.API.DTOs.InterviewRound;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class InterviewRoundServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddRound_WhenUserOwnsApplication()
    {
        var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var appId = Guid.NewGuid();

        db.JobApplications.Add(new JobApplication
        {
            Id = appId,
            UserId = userId,
            Role = "Senior Dev",
            CompanyId = Guid.NewGuid(),
            PriorityId = Guid.NewGuid(),
            JobTypeId = Guid.NewGuid(),
            WorkTypeId = Guid.NewGuid(),
            SourcePlatformId = Guid.NewGuid(),
            ApplicationStatusId = Guid.NewGuid()
        });
        await db.SaveChangesAsync();

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userId);

        var service = new InterviewRoundService(db, mockUser.Object);

        var dto = new CreateInterviewRoundDto
        {
            RoundName = "Technical Screen",
            RoundDate = DateTime.UtcNow,
            Experience = "System design & coding",
            Result = InterviewResult.Passed
        };

        var result = await service.CreateAsync(appId, dto);

        Assert.NotNull(result);
        Assert.Equal("Technical Screen", result.RoundName);
        Assert.Equal(InterviewResult.Passed, result.Result);

        var roundInDb = await db.InterviewRounds.FirstOrDefaultAsync(r => r.Id == result.Id);
        Assert.NotNull(roundInDb);
        Assert.Equal(appId, roundInDb.JobApplicationId);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenUserDoesNotOwnApplication()
    {
        var db = GetInMemoryDbContext();
        var ownerId = Guid.NewGuid();
        var strangerId = Guid.NewGuid();
        var appId = Guid.NewGuid();

        db.JobApplications.Add(new JobApplication
        {
            Id = appId,
            UserId = ownerId,
            Role = "Backend Dev",
            CompanyId = Guid.NewGuid(),
            PriorityId = Guid.NewGuid(),
            JobTypeId = Guid.NewGuid(),
            WorkTypeId = Guid.NewGuid(),
            SourcePlatformId = Guid.NewGuid(),
            ApplicationStatusId = Guid.NewGuid()
        });
        await db.SaveChangesAsync();

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(strangerId);

        var service = new InterviewRoundService(db, mockUser.Object);

        var dto = new CreateInterviewRoundDto
        {
            RoundName = "HackerRank",
            RoundDate = DateTime.UtcNow
        };

        await Assert.ThrowsAsync<KeyNotFoundException>(() => service.CreateAsync(appId, dto));
    }
}

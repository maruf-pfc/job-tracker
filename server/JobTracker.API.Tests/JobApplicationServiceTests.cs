using JobTracker.API.Configs;
using JobTracker.API.DTOs.Common;
using JobTracker.API.DTOs.JobApplication;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class JobApplicationServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private async Task SeedLookupDataAsync(AppDbContext db)
    {
        db.Priorities.Add(new Priority { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "High", Color = "red" });
        db.JobTypes.Add(new JobType { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Full Time" });
        db.WorkTypes.Add(new WorkType { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Remote" });
        db.SourcePlatforms.Add(new SourcePlatform { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "LinkedIn" });
        db.ApplicationStatuses.Add(new ApplicationStatus { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Applied" });
        db.Companies.Add(new Company { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "Acme Corp" });
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateApplicationForCurrentUser()
    {
        var db = GetInMemoryDbContext();
        await SeedLookupDataAsync(db);

        var userId = Guid.NewGuid();
        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userId);

        var service = new JobApplicationService(db, mockUser.Object);

        var dto = new CreateJobApplicationDto
        {
            CompanyId = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            Role = "Software Engineer",
            PriorityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            JobTypeId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            WorkTypeId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            SourcePlatformId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            ApplicationStatusId = Guid.Parse("55555555-5555-5555-5555-555555555555")
        };

        var result = await service.CreateAsync(dto);

        Assert.NotNull(result);
        Assert.Equal("Software Engineer", result.Role);
        Assert.Equal("Acme Corp", result.Company);

        var applicationInDb = await db.JobApplications.FirstOrDefaultAsync(j => j.Id == result.Id);
        Assert.NotNull(applicationInDb);
        Assert.Equal(userId, applicationInDb.UserId);
    }

    [Fact]
    public async Task GetAllAsync_ShouldOnlyReturnApplicationsBelongingToCurrentUser()
    {
        var db = GetInMemoryDbContext();
        await SeedLookupDataAsync(db);

        var userA = Guid.NewGuid();
        var userB = Guid.NewGuid();

        db.JobApplications.Add(new JobApplication
        {
            Id = Guid.NewGuid(),
            UserId = userA,
            Role = "User A Role",
            CompanyId = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            PriorityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            JobTypeId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            WorkTypeId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            SourcePlatformId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            ApplicationStatusId = Guid.Parse("55555555-5555-5555-5555-555555555555")
        });

        db.JobApplications.Add(new JobApplication
        {
            Id = Guid.NewGuid(),
            UserId = userB,
            Role = "User B Role",
            CompanyId = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            PriorityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            JobTypeId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            WorkTypeId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            SourcePlatformId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            ApplicationStatusId = Guid.Parse("55555555-5555-5555-5555-555555555555")
        });

        await db.SaveChangesAsync();

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userA);

        var service = new JobApplicationService(db, mockUser.Object);

        var result = await service.GetAllAsync(new JobApplicationQueryDto());

        Assert.Single(result.Items);
        Assert.Equal("User A Role", result.Items.First().Role);
    }
}

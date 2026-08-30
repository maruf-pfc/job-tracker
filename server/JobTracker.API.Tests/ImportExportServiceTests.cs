using System.Text;
using JobTracker.API.Configs;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class ImportExportServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task ExportCsvAsync_ShouldGenerateValidCsvHeaderAndData()
    {
        var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();

        var company = new Company { Id = Guid.NewGuid(), Name = "Google" };
        var priority = new Priority { Id = Guid.NewGuid(), Name = "High" };
        var jobType = new JobType { Id = Guid.NewGuid(), Name = "Full Time" };
        var workType = new WorkType { Id = Guid.NewGuid(), Name = "Remote" };
        var platform = new SourcePlatform { Id = Guid.NewGuid(), Name = "LinkedIn" };
        var status = new ApplicationStatus { Id = Guid.NewGuid(), Name = "Applied" };

        db.Companies.Add(company);
        db.Priorities.Add(priority);
        db.JobTypes.Add(jobType);
        db.WorkTypes.Add(workType);
        db.SourcePlatforms.Add(platform);
        db.ApplicationStatuses.Add(status);

        db.JobApplications.Add(new JobApplication
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Role = "Staff Engineer",
            CompanyId = company.Id,
            PriorityId = priority.Id,
            JobTypeId = jobType.Id,
            WorkTypeId = workType.Id,
            SourcePlatformId = platform.Id,
            ApplicationStatusId = status.Id,
            AppliedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userId);

        var service = new ImportExportService(db, mockUser.Object);

        var csvBytes = await service.ExportCsvAsync();
        var csvString = Encoding.UTF8.GetString(csvBytes);

        Assert.Contains("Company,Role,JobUrl,Location", csvString);
        Assert.Contains("Google", csvString);
        Assert.Contains("Staff Engineer", csvString);
    }

    [Fact]
    public async Task ImportCsvAsync_ShouldIsolateCreatedCompaniesToCurrentUser()
    {
        var db = GetInMemoryDbContext();
        var userA = Guid.NewGuid();
        var userB = Guid.NewGuid();

        // Seed lookups
        db.Priorities.Add(new Priority { Id = Guid.NewGuid(), Name = "Medium", Color = "amber" });
        db.JobTypes.Add(new JobType { Id = Guid.NewGuid(), Name = "Full Time" });
        db.WorkTypes.Add(new WorkType { Id = Guid.NewGuid(), Name = "Remote" });
        db.SourcePlatforms.Add(new SourcePlatform { Id = Guid.NewGuid(), Name = "LinkedIn" });
        db.ApplicationStatuses.Add(new ApplicationStatus { Id = Guid.NewGuid(), Name = "Applied" });

        // User B has a company named "Meta"
        db.Companies.Add(new Company { Id = Guid.NewGuid(), Name = "Meta", UserId = userB });
        await db.SaveChangesAsync();

        var csvContent = "Company,Role\nMeta,Software Engineer\n";
        var bytes = Encoding.UTF8.GetBytes(csvContent);
        var stream = new MemoryStream(bytes);
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.OpenReadStream()).Returns(stream);
        fileMock.Setup(f => f.Length).Returns(bytes.Length);

        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(userA);

        var service = new ImportExportService(db, mockUser.Object);

        var importedCount = await service.ImportCsvAsync(fileMock.Object);

        Assert.Equal(1, importedCount);

        // User A should have their own separate "Meta" company record
        var userACompany = await db.Companies.FirstOrDefaultAsync(c => c.UserId == userA && c.Name == "Meta");
        Assert.NotNull(userACompany);
        Assert.Equal(userA, userACompany.UserId);

        var userAApp = await db.JobApplications.FirstOrDefaultAsync(j => j.UserId == userA);
        Assert.NotNull(userAApp);
        Assert.Equal(userACompany.Id, userAApp.CompanyId);
    }
}


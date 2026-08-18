using System;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Company;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class CompanyServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private Mock<ICurrentUserService> CreateUserMock(Guid? userId)
    {
        var mock = new Mock<ICurrentUserService>();
        mock.Setup(u => u.UserId).Returns(userId);
        return mock;
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoCompaniesExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var userMock = CreateUserMock(Guid.NewGuid());
        var service = new CompanyService(context, userMock.Object);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddCompanyWithUserId_WhenValidDtoProvided()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var userMock = CreateUserMock(userId);
        var service = new CompanyService(context, userMock.Object);

        var dto = new CreateCompanyDto
        {
            Name = "Google",
            Location = "Remote",
            WebsiteUrl = "https://google.com",
            CareerPageUrl = "https://careers.google.com"
        };

        // Act
        var result = await service.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Google", result.Name);
        Assert.Equal("Remote", result.Location);

        var companyInDb = await context.Companies.FirstAsync();
        Assert.Equal(userId, companyInDb.UserId);
    }

    [Fact]
    public async Task UserIsolation_UserCannotSeeOrModifyOtherUserCompany()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var user1Id = Guid.NewGuid();
        var user2Id = Guid.NewGuid();

        var service1 = new CompanyService(context, CreateUserMock(user1Id).Object);
        var service2 = new CompanyService(context, CreateUserMock(user2Id).Object);

        // User 1 creates a private company
        var user1Company = await service1.CreateAsync(new CreateCompanyDto { Name = "User1 Private Tech" });

        // User 2 creates a private company
        var user2Company = await service2.CreateAsync(new CreateCompanyDto { Name = "User2 Secret Labs" });

        // Act - User 1 queries all
        var user1List = await service1.GetAllAsync();
        // User 2 queries all
        var user2List = await service2.GetAllAsync();

        // Assert Strict Isolation on Read
        Assert.Contains(user1List, c => c.Name == "User1 Private Tech");
        Assert.DoesNotContain(user1List, c => c.Name == "User2 Secret Labs");

        Assert.Contains(user2List, c => c.Name == "User2 Secret Labs");
        Assert.DoesNotContain(user2List, c => c.Name == "User1 Private Tech");

        // Act - User 2 attempts to update User 1's company
        var updateAttempt = await service2.UpdateAsync(user1Company.Id, new CreateCompanyDto { Name = "Hacked Tech" });
        Assert.Null(updateAttempt);

        // Act - User 2 attempts to delete User 1's company
        var deleteAttempt = await service2.DeleteAsync(user1Company.Id);
        Assert.False(deleteAttempt);

        // User 1 can delete their own company
        var user1Delete = await service1.DeleteAsync(user1Company.Id);
        Assert.True(user1Delete);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateCompanyDetails_WhenOwnedByUser()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var service = new CompanyService(context, CreateUserMock(userId).Object);

        var createDto = new CreateCompanyDto
        {
            Name = "Google",
            Location = "Remote"
        };

        var created = await service.CreateAsync(createDto);

        var updateDto = new CreateCompanyDto
        {
            Name = "Google Inc.",
            Location = "Mountain View, CA"
        };

        // Act
        var updated = await service.UpdateAsync(created.Id, updateDto);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal("Google Inc.", updated.Name);
        Assert.Equal("Mountain View, CA", updated.Location);
    }
}

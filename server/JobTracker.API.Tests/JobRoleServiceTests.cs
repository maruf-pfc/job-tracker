using System;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class JobRoleServiceTests
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
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoRolesExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var userMock = CreateUserMock(Guid.NewGuid());
        var service = new JobRoleService(context, userMock.Object);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddJobRoleWithUserId_WhenValidDtoProvided()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var userMock = CreateUserMock(userId);
        var service = new JobRoleService(context, userMock.Object);

        var dto = new CreateJobRoleDto
        {
            Name = "Frontend Engineer"
        };

        // Act
        var result = await service.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Frontend Engineer", result.Name);

        var roleInDb = await context.JobRoles.FirstAsync();
        Assert.Equal(userId, roleInDb.UserId);
    }

    [Fact]
    public async Task UserIsolation_UserCannotSeeOrModifyOtherUserRole()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var user1Id = Guid.NewGuid();
        var user2Id = Guid.NewGuid();

        var service1 = new JobRoleService(context, CreateUserMock(user1Id).Object);
        var service2 = new JobRoleService(context, CreateUserMock(user2Id).Object);

        // User 1 creates private role
        var user1Role = await service1.CreateAsync(new CreateJobRoleDto { Name = "User1 Specialist Role" });

        // User 2 creates private role
        var user2Role = await service2.CreateAsync(new CreateJobRoleDto { Name = "User2 Secret Role" });

        // Act - User 1 queries all
        var user1List = await service1.GetAllAsync();
        // User 2 queries all
        var user2List = await service2.GetAllAsync();

        // Assert Strict Isolation on Read
        Assert.Contains(user1List, r => r.Name == "User1 Specialist Role");
        Assert.DoesNotContain(user1List, r => r.Name == "User2 Secret Role");

        Assert.Contains(user2List, r => r.Name == "User2 Secret Role");
        Assert.DoesNotContain(user2List, r => r.Name == "User1 Specialist Role");

        // Act - User 2 attempts to update User 1's role
        var updateAttempt = await service2.UpdateAsync(user1Role.Id, new CreateJobRoleDto { Name = "Hacked Role" });
        Assert.Null(updateAttempt);

        // Act - User 2 attempts to delete User 1's role
        var deleteAttempt = await service2.DeleteAsync(user1Role.Id);
        Assert.False(deleteAttempt);

        // User 1 can delete their own role
        var user1Delete = await service1.DeleteAsync(user1Role.Id);
        Assert.True(user1Delete);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateRoleName_WhenOwnedByUser()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var service = new JobRoleService(context, CreateUserMock(userId).Object);

        var createDto = new CreateJobRoleDto { Name = "Backend Dev" };
        var created = await service.CreateAsync(createDto);

        var updateDto = new CreateJobRoleDto { Name = "Senior Backend Engineer" };

        // Act
        var updated = await service.UpdateAsync(created.Id, updateDto);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal("Senior Backend Engineer", updated.Name);
    }
}

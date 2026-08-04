using System;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.JobRole;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
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

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoRolesExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new JobRoleService(context);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddJobRole_WhenValidDtoProvided()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new JobRoleService(context);

        var dto = new CreateJobRoleDto
        {
            Name = "Frontend Engineer"
        };

        // Act
        var result = await service.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Frontend Engineer", result.Name);

        var count = await context.JobRoles.CountAsync();
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateRoleName_WhenRoleExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new JobRoleService(context);

        var createDto = new CreateJobRoleDto { Name = "Backend Dev" };
        var created = await service.CreateAsync(createDto);

        var updateDto = new CreateJobRoleDto { Name = "Senior Backend Engineer" };

        // Act
        var updated = await service.UpdateAsync(created.Id, updateDto);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal("Senior Backend Engineer", updated.Name);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveRole_WhenRoleExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new JobRoleService(context);

        var dto = new CreateJobRoleDto { Name = "DevOps" };
        var created = await service.CreateAsync(dto);

        // Act
        var deleted = await service.DeleteAsync(created.Id);

        // Assert
        Assert.True(deleted);
        var count = await context.JobRoles.CountAsync();
        Assert.Equal(0, count);
    }
}

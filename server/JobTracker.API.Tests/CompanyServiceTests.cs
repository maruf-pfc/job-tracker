using System;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Company;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
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

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoCompaniesExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddCompany_WhenValidDtoProvided()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

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

        var count = await context.Companies.CountAsync();
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateCompanyDetails_WhenCompanyExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

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

    [Fact]
    public async Task DeleteAsync_ShouldRemoveCompany_WhenCompanyExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

        var dto = new CreateCompanyDto { Name = "Meta" };
        var created = await service.CreateAsync(dto);

        // Act
        var deleted = await service.DeleteAsync(created.Id);

        // Assert
        Assert.True(deleted);
        var count = await context.Companies.CountAsync();
        Assert.Equal(0, count);
    }
}

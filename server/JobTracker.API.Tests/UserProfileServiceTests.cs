using System;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Profile;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class UserProfileServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetProfileAsync_ShouldReturnDefaultProfile_WhenNoProfileExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var mockCurrentUserService = new Mock<ICurrentUserService>();
        var testUserId = Guid.NewGuid();
        mockCurrentUserService.Setup(s => s.UserId).Returns(testUserId);

        var service = new UserProfileService(context, mockCurrentUserService.Object);

        // Act
        var result = await service.GetProfileAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Demo User", result.NameEnglish);
        Assert.Equal("Dhaka", result.PresentDivision);
        Assert.Equal("1219", result.PresentPostCode);
    }

    [Fact]
    public async Task UpdateProfileAsync_ShouldUpdateProfileDetails_WhenCalled()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var mockCurrentUserService = new Mock<ICurrentUserService>();
        var testUserId = Guid.NewGuid();
        mockCurrentUserService.Setup(s => s.UserId).Returns(testUserId);

        var service = new UserProfileService(context, mockCurrentUserService.Object);
        await service.GetProfileAsync(); // Create initial profile

        var updateDto = new UserProfileDto
        {
            NameEnglish = "Demo User UPDATED",
            PresentDivision = "Dhaka Division",
            PresentPostCode = "1219",
            MobileNumber = "",
        };

        // Act
        var updatedResult = await service.UpdateProfileAsync(updateDto);

        // Assert
        Assert.NotNull(updatedResult);
        Assert.Equal("Demo User UPDATED", updatedResult.NameEnglish);
        Assert.Equal("Dhaka Division", updatedResult.PresentDivision);
    }
}

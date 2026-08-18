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

        var testUser = new User
        {
            Id = testUserId,
            Name = "Test Developer",
            Email = "test@jobtracker.dev",
            UserName = "test@jobtracker.dev"
        };
        context.Users.Add(testUser);
        await context.SaveChangesAsync();

        var service = new UserProfileService(context, mockCurrentUserService.Object);

        // Act
        var result = await service.GetProfileAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Developer", result.NameEnglish);
        Assert.Equal("test@jobtracker.dev", result.Email);
        Assert.Equal(string.Empty, result.BioSummary);
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
            NameEnglish = "Demo User Updated",
            PresentDivision = "Dhaka Division",
            PresentPostCode = "1219",
            MobileNumber = "01700000000",
        };

        // Act
        var updatedResult = await service.UpdateProfileAsync(updateDto);

        // Assert
        Assert.NotNull(updatedResult);
        Assert.Equal("Demo User Updated", updatedResult.NameEnglish);
        Assert.Equal("Dhaka Division", updatedResult.PresentDivision);
    }
}

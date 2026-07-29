using JobTracker.API.Configs;
using JobTracker.API.DTOs.Auth;
using JobTracker.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace JobTracker.API.Tests;

public class AuthServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private IConfiguration GetMockConfiguration()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Jwt:Key", "SuperSecretKeyForTestingPurposes1234567890!"},
            {"Jwt:Issuer", "JobTracker.API"},
            {"Jwt:Audience", "JobTracker.Client"}
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
    }

    [Fact]
    public async Task RegisterAsync_ShouldCreateUserAndReturnToken()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var config = GetMockConfiguration();
        var service = new AuthService(db, config);

        var dto = new RegisterDto
        {
            Name = "Test User",
            Email = "test@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Act
        var response = await service.RegisterAsync(dto);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("test@example.com", response.Email);
        Assert.Equal("Test User", response.Name);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));

        var userInDb = await db.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
        Assert.NotNull(userInDb);
        Assert.Equal("Test User", userInDb.Name);
    }
}

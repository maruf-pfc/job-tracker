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

        var response = await service.RegisterAsync(dto);

        Assert.NotNull(response);
        Assert.Equal("test@example.com", response.Email);
        Assert.Equal("Test User", response.Name);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));

        var userInDb = await db.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
        Assert.NotNull(userInDb);
        Assert.Equal("Test User", userInDb.Name);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrowException_WhenDuplicateEmail()
    {
        var db = GetInMemoryDbContext();
        var config = GetMockConfiguration();
        var service = new AuthService(db, config);

        var dto = new RegisterDto
        {
            Name = "First User",
            Email = "dup@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        await service.RegisterAsync(dto);

        var exception = await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(dto));
        Assert.Equal("Email already exists", exception.Message);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrowException_WhenPasswordMismatch()
    {
        var db = GetInMemoryDbContext();
        var config = GetMockConfiguration();
        var service = new AuthService(db, config);

        var dto = new RegisterDto
        {
            Name = "Test User",
            Email = "mismatch@example.com",
            Password = "Password123!",
            ConfirmPassword = "DifferentPassword123!"
        };

        var exception = await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(dto));
        Assert.Equal("Passwords do not match", exception.Message);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
    {
        var db = GetInMemoryDbContext();
        var config = GetMockConfiguration();
        var service = new AuthService(db, config);

        await service.RegisterAsync(new RegisterDto
        {
            Name = "User Login",
            Email = "login@example.com",
            Password = "SecurePassword123!",
            ConfirmPassword = "SecurePassword123!"
        });

        var loginDto = new LoginDto
        {
            Email = "login@example.com",
            Password = "SecurePassword123!"
        };

        var response = await service.LoginAsync(loginDto);

        Assert.NotNull(response);
        Assert.Equal("login@example.com", response.Email);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowException_WhenInvalidCredentials()
    {
        var db = GetInMemoryDbContext();
        var config = GetMockConfiguration();
        var service = new AuthService(db, config);

        var loginDto = new LoginDto
        {
            Email = "nonexistent@example.com",
            Password = "WrongPassword"
        };

        var exception = await Assert.ThrowsAsync<Exception>(() => service.LoginAsync(loginDto));
        Assert.Equal("Invalid credentials", exception.Message);
    }
}

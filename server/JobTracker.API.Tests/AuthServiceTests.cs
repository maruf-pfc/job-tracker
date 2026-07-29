using JobTracker.API.Configs;
using JobTracker.API.DTOs.Auth;
using JobTracker.API.Models;
using JobTracker.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
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

    private Mock<UserManager<User>> GetMockUserManager()
    {
        var store = new Mock<IUserStore<User>>();
        return new Mock<UserManager<User>>(store.Object, null!, null!, null!, null!, null!, null!, null!, null!);
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
    public async Task RegisterAsync_ShouldCreateUserAndReturnToken_WhenValid()
    {
        var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var config = GetMockConfiguration();

        mockUserManager
            .Setup(m => m.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        mockUserManager
            .Setup(m => m.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        var service = new AuthService(mockUserManager.Object, db, config);

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
        Assert.False(string.IsNullOrWhiteSpace(response.RefreshToken));
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrowException_WhenDuplicateEmail()
    {
        var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var config = GetMockConfiguration();

        mockUserManager
            .Setup(m => m.FindByEmailAsync("dup@example.com"))
            .ReturnsAsync(new User { Email = "dup@example.com", Name = "Dup" });

        var service = new AuthService(mockUserManager.Object, db, config);

        var dto = new RegisterDto
        {
            Name = "First User",
            Email = "dup@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        var exception = await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(dto));
        Assert.Equal("Email already exists", exception.Message);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrowException_WhenPasswordMismatch()
    {
        var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var config = GetMockConfiguration();

        var service = new AuthService(mockUserManager.Object, db, config);

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
        var mockUserManager = GetMockUserManager();
        var config = GetMockConfiguration();

        var user = new User { Id = Guid.NewGuid(), Email = "login@example.com", Name = "User Login" };

        mockUserManager
            .Setup(m => m.FindByEmailAsync("login@example.com"))
            .ReturnsAsync(user);

        mockUserManager
            .Setup(m => m.CheckPasswordAsync(user, "SecurePassword123!"))
            .ReturnsAsync(true);

        var service = new AuthService(mockUserManager.Object, db, config);

        var loginDto = new LoginDto
        {
            Email = "login@example.com",
            Password = "SecurePassword123!"
        };

        var response = await service.LoginAsync(loginDto);

        Assert.NotNull(response);
        Assert.Equal("login@example.com", response.Email);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.False(string.IsNullOrWhiteSpace(response.RefreshToken));
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowException_WhenInvalidCredentials()
    {
        var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var config = GetMockConfiguration();

        mockUserManager
            .Setup(m => m.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var service = new AuthService(mockUserManager.Object, db, config);

        var loginDto = new LoginDto
        {
            Email = "nonexistent@example.com",
            Password = "WrongPassword"
        };

        var exception = await Assert.ThrowsAsync<Exception>(() => service.LoginAsync(loginDto));
        Assert.Equal("Invalid credentials", exception.Message);
    }
}

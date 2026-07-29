using System.Security.Cryptography;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Auth;
using JobTracker.API.Helpers;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<User> userManager, AppDbContext context, IConfiguration configuration)
    {
        _userManager = userManager;
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (dto.Password != dto.ConfirmPassword)
        {
            throw new Exception("Passwords do not match");
        }

        var existingUser = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (existingUser is not null)
        {
            throw new Exception("Email already exists");
        }

        var user = new User
        {
            UserName = dto.Email.Trim().ToLower(),
            Email = dto.Email.Trim().ToLower(),
            Name = dto.Name.Trim()
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception(errors);
        }

        var token = JwtHelper.GenerateToken(user, _configuration);
        var refreshToken = await GenerateAndSaveRefreshTokenAsync(user.Id);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            Email = user.Email ?? string.Empty,
            Name = user.Name
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is null)
        {
            throw new Exception("Invalid credentials");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
        {
            throw new Exception("Invalid credentials");
        }

        var token = JwtHelper.GenerateToken(user, _configuration);
        var refreshToken = await GenerateAndSaveRefreshTokenAsync(user.Id);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            Email = user.Email ?? string.Empty,
            Name = user.Name
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var existingToken = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken && !r.IsRevoked);

        if (existingToken is null || existingToken.ExpiresAt <= DateTime.UtcNow || existingToken.User is null)
        {
            throw new Exception("Invalid or expired refresh token");
        }

        // Revoke current token (Rotation)
        existingToken.IsRevoked = true;

        var newJwtToken = JwtHelper.GenerateToken(existingToken.User, _configuration);
        var newRefreshToken = await GenerateAndSaveRefreshTokenAsync(existingToken.User.Id);

        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = newJwtToken,
            RefreshToken = newRefreshToken,
            Email = existingToken.User.Email ?? string.Empty,
            Name = existingToken.User.Name
        };
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(Guid userId)
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var refreshTokenString = Convert.ToBase64String(randomBytes);

        var tokenEntity = new RefreshToken
        {
            UserId = userId,
            Token = refreshTokenString,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(tokenEntity);
        await _context.SaveChangesAsync();

        return refreshTokenString;
    }
}
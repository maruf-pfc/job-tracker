using JobTracker.API.DTOs.Auth;
using JobTracker.API.Helpers;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Identity;

namespace JobTracker.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<User> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
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

        return new AuthResponseDto
        {
            Token = token,
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

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email ?? string.Empty,
            Name = user.Name
        };
    }
}
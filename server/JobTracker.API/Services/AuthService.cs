using BCrypt.Net;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Auth;
using JobTracker.API.Helpers;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser is not null)
        {
            throw new Exception("Email already exists");
        }

        if (dto.Password != dto.ConfirmPassword)
        {
            throw new Exception("Passwords do not match");
        }

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token = JwtHelper.GenerateToken(user, _configuration);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Name = user.Name
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(
                u => u.Email == dto.Email.Trim().ToLower()
            );

        if (user is null)
        {
            throw new Exception("Invalid credentials");
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            throw new Exception("Invalid credentials");
        }

        var token = JwtHelper.GenerateToken( user, _configuration);

        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Name = user.Name
        };
    }
}
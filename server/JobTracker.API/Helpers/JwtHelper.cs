using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobTracker.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace JobTracker.API.Helpers;

public static class JwtHelper
{
    public static string GenerateToken(User user, IConfiguration configuration)
    {
        var jwtKey = configuration["Jwt:Key"]
            ?? throw new Exception("JWT Key not configured");

        var jwtIssuer = configuration["Jwt:Issuer"]
            ?? throw new Exception("JWT Issuer not configured");

        var jwtAudience = configuration["Jwt:Audience"]
            ?? throw new Exception("JWT Audience not configured");

        var rawDuration = configuration["Jwt:DurationInMinutes"];
        var durationInMinutes = int.TryParse(rawDuration, out var mins) && mins > 0
            ? mins
            : 10080;

        var claims =
            new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email ?? string.Empty),
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new(ClaimTypes.Name, user.Name),
            };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(durationInMinutes),
                signingCredentials: credentials
            );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
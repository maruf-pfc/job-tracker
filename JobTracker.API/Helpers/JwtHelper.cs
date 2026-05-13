using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobTracker.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace JobTracker.API.Helpers;

public static class JwtHelper
{
    public static string GenerateToken(
        User user,
        IConfiguration configuration
    )
    {
        var jwtKey = configuration["Jwt:Key"]
            ?? throw new Exception("JWT Key not configured");

        var jwtIssuer = configuration["Jwt:Issuer"]
            ?? throw new Exception("JWT Issuer not configured");

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtIssuer,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
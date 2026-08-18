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
        var jwtKey = configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey)) jwtKey = configuration["JWT_KEY"];
        if (string.IsNullOrWhiteSpace(jwtKey)) jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        if (string.IsNullOrWhiteSpace(jwtKey)) jwtKey = Environment.GetEnvironmentVariable("Jwt__Key");
        if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
        {
            jwtKey = "JobTrackerSecureDefaultJwtSigningSecretKeyMustBe32CharsLong!";
        }

        var jwtIssuer = configuration["Jwt:Issuer"];
        if (string.IsNullOrWhiteSpace(jwtIssuer)) jwtIssuer = configuration["JWT_ISSUER"];
        if (string.IsNullOrWhiteSpace(jwtIssuer)) jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        if (string.IsNullOrWhiteSpace(jwtIssuer)) jwtIssuer = "JobTrackerAPI";

        var jwtAudience = configuration["Jwt:Audience"];
        if (string.IsNullOrWhiteSpace(jwtAudience)) jwtAudience = configuration["JWT_AUDIENCE"];
        if (string.IsNullOrWhiteSpace(jwtAudience)) jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
        if (string.IsNullOrWhiteSpace(jwtAudience)) jwtAudience = "JobTrackerClient";

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
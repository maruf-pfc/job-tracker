using System.Text;
using JobTracker.API.Configs;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace JobTracker.API.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddSecurityAndIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        // Identity
        services.AddIdentityCore<User>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 6;
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<AppDbContext>();

        // Resolve JWT parameters
        var jwtKey = configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey)) jwtKey = configuration["JWT_KEY"];
        if (string.IsNullOrWhiteSpace(jwtKey)) jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        if (string.IsNullOrWhiteSpace(jwtKey)) jwtKey = Environment.GetEnvironmentVariable("Jwt__Key");

        if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
        {
            throw new InvalidOperationException("JWT Key is not configured or is less than 32 characters. Please set the JWT_KEY environment variable.");
        }

        var jwtIssuer = configuration["Jwt:Issuer"];
        if (string.IsNullOrWhiteSpace(jwtIssuer)) jwtIssuer = configuration["JWT_ISSUER"];
        if (string.IsNullOrWhiteSpace(jwtIssuer)) jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        if (string.IsNullOrWhiteSpace(jwtIssuer)) jwtIssuer = "JobTrackerAPI";

        var jwtAudience = configuration["Jwt:Audience"];
        if (string.IsNullOrWhiteSpace(jwtAudience)) jwtAudience = configuration["JWT_AUDIENCE"];
        if (string.IsNullOrWhiteSpace(jwtAudience)) jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
        if (string.IsNullOrWhiteSpace(jwtAudience)) jwtAudience = "JobTrackerClient";

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });

        return services;
    }
}

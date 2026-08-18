using JobTracker.API.Configs;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace JobTracker.API.Extensions;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabaseConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var rawConnStr = Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? configuration.GetConnectionString("DefaultConnection");

        var dbConnStr = ResolveConnectionString(rawConnStr);

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(dbConnStr);
        });

        return services;
    }

    private static string ResolveConnectionString(string? rawConnStr)
    {
        if (string.IsNullOrWhiteSpace(rawConnStr))
        {
            return string.Empty;
        }

        if (rawConnStr.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
            rawConnStr.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            var uri = new Uri(rawConnStr);
            var userInfo = uri.UserInfo.Split(':');
            var npgsqlBuilder = new NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port > 0 ? uri.Port : 5432,
                Username = userInfo.Length > 0 ? userInfo[0] : "",
                Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "",
                Database = uri.LocalPath.TrimStart('/'),
                SslMode = SslMode.Require
            };
            return npgsqlBuilder.ConnectionString;
        }

        return rawConnStr;
    }
}

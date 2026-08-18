namespace JobTracker.API.Extensions;

public static class CorsExtensions
{
    public const string PolicyName = "ClientPolicy";

    public static IServiceCollection AddAppCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOriginsEnv = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS");
        var clientOrigin = Environment.GetEnvironmentVariable("CLIENT_URL")
            ?? configuration["AllowedOrigins"]
            ?? "http://localhost:5173";

        var allowedOrigins = new List<string>
        {
            clientOrigin,
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:80",
            "http://localhost:4173",
            "https://job-tracker.itsniloy.eu.org",
            "https://job-tracker-client.vercel.app"
        };

        if (!string.IsNullOrWhiteSpace(allowedOriginsEnv))
        {
            var split = allowedOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            allowedOrigins.AddRange(split);
        }

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy
                    .WithOrigins(allowedOrigins.Distinct().ToArray())
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }
}

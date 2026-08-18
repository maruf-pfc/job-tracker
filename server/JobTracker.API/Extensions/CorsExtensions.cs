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

        var explicitOrigins = new List<string>
        {
            clientOrigin,
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:80",
            "http://localhost:4173",
            "https://job-trackerr.vercel.app",
            "https://job-tracker-client.vercel.app",
            "https://job-tracker.itsniloy.eu.org"
        };

        if (!string.IsNullOrWhiteSpace(allowedOriginsEnv))
        {
            var split = allowedOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            explicitOrigins.AddRange(split);
        }

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy
                    .SetIsOriginAllowed(origin =>
                    {
                        if (string.IsNullOrWhiteSpace(origin)) return false;

                        try
                        {
                            var uri = new Uri(origin);
                            var host = uri.Host.ToLowerInvariant();

                            // Allow local development ports and LAN addresses
                            if (host is "localhost" or "127.0.0.1" || host.StartsWith("192.168."))
                                return true;

                            // Allow all Vercel deployment URLs (production & preview branches)
                            if (host.EndsWith(".vercel.app"))
                                return true;

                            // Allow itsniloy.eu.org custom domain
                            if (host.EndsWith("itsniloy.eu.org"))
                                return true;

                            // Allow explicitly listed origins from environment / config
                            if (explicitOrigins.Any(o => !string.IsNullOrWhiteSpace(o) && string.Equals(o.TrimEnd('/'), origin.TrimEnd('/'), StringComparison.OrdinalIgnoreCase)))
                                return true;
                        }
                        catch
                        {
                            return false;
                        }

                        return false;
                    })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }
}

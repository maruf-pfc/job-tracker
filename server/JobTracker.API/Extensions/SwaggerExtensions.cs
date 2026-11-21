using Microsoft.OpenApi;

namespace JobTracker.API.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "JobTracker API",
                Version = "v1.0.0",
                Description = "Career Operations & Interview Pipeline Management API"
            });
        });
        return services;
    }
}

using JobTracker.API.Interfaces;
using JobTracker.API.Services;

namespace JobTracker.API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddHttpClient();

        // Domain Services
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPriorityService, PriorityService>();
        services.AddScoped<IJobApplicationService, JobApplicationService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<ICompanyService, CompanyService>();
        services.AddScoped<IJobTypeService, JobTypeService>();
        services.AddScoped<ISourcePlatformService, SourcePlatformService>();
        services.AddScoped<IApplicationStatusService, ApplicationStatusService>();
        services.AddScoped<IWorkTypeService, WorkTypeService>();
        services.AddScoped<IJobRoleService, JobRoleService>();
        services.AddScoped<IUserProfileService, UserProfileService>();
        services.AddScoped<IRejectionRetrospectiveService, RejectionRetrospectiveService>();
        services.AddScoped<IInterviewRoundService, InterviewRoundService>();
        services.AddScoped<IAiAdvisorService, AiAdvisorService>();
        services.AddScoped<IImportExportService, ImportExportService>();

        return services;
    }
}

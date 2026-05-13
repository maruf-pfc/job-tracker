using JobTracker.API.Configs;
using JobTracker.API.Middlewares;
using Microsoft.EntityFrameworkCore;
using JobTracker.API.Interfaces;
using JobTracker.API.Services;
using JobTracker.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPriorityService, PriorityService>();
builder.Services.AddHttpContextAccessor(); // bridges request context into services cleanly.
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IJobApplicationService, JobApplicationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPolicy", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(
                "http://localhost:5173"
            );
    });
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ClientPolicy");
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(context);
}

app.Run();
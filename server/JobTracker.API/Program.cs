using JobTracker.API.Configs;
using JobTracker.API.Data;
using JobTracker.API.Extensions;
using JobTracker.API.Middlewares;
using Microsoft.EntityFrameworkCore;
using Serilog;

// Enable Npgsql legacy timestamp behavior
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Automatically load .env file from current or parent directories if present
LoadDotEnv();

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog Logging
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Configure Modular Services & Extensions
builder.Services.AddControllers();
builder.Services.AddDatabaseConfiguration(builder.Configuration);
builder.Services.AddSecurityAndIdentity(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddAppCors(builder.Configuration);
builder.Services.AddAppRateLimiting();
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

// Middleware Pipeline
app.UseCors(CorsExtensions.PolicyName);

// Security Headers Middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

app.UseMiddleware<ExceptionMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database Migration & Seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbSeeder.SeedAsync(context);
}

app.Run();

static void LoadDotEnv()
{
    var currentDir = Directory.GetCurrentDirectory();
    var candidates = new[]
    {
        Path.Combine(currentDir, ".env"),
        Path.Combine(currentDir, "..", ".env"),
        Path.Combine(currentDir, "..", "..", ".env")
    };

    foreach (var path in candidates)
    {
        if (File.Exists(path))
        {
            foreach (var line in File.ReadAllLines(path))
            {
                var trimmed = line.Trim();
                if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith('#')) continue;
                var eqIdx = trimmed.IndexOf('=');
                if (eqIdx > 0)
                {
                    var key = trimmed[..eqIdx].Trim();
                    var val = trimmed[(eqIdx + 1)..].Trim();
                    if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(key)))
                    {
                        Environment.SetEnvironmentVariable(key, val);
                    }
                }
            }
            break;
        }
    }
}
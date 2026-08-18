using System.Text;
using JobTracker.API.Configs;
using JobTracker.API.Data;
using JobTracker.API.Interfaces;
using JobTracker.API.Middlewares;
using JobTracker.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Identity;
using Serilog;

// Enable Npgsql legacy timestamp behavior (allows DateTime.Unspecified with timestamptz)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Automatically load .env file from current or parent directories if present
LoadDotEnv();

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

var builder = WebApplication.CreateBuilder(args);

// Serilog Logging
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Database connection string (supports Neon DB, DATABASE_URL env var, or DefaultConnection)
var rawConnStr = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

string dbConnStr = rawConnStr ?? "";
if (!string.IsNullOrEmpty(rawConnStr) && (rawConnStr.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) || rawConnStr.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase)))
{
    var uri = new Uri(rawConnStr);
    var userInfo = uri.UserInfo.Split(':');
    var npgsqlBuilder = new Npgsql.NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.Port > 0 ? uri.Port : 5432,
        Username = userInfo.Length > 0 ? userInfo[0] : "",
        Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "",
        Database = uri.LocalPath.TrimStart('/'),
        SslMode = Npgsql.SslMode.Require
    };
    dbConnStr = npgsqlBuilder.ConnectionString;
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(dbConnStr);
});

// Identity
builder.Services.AddIdentityCore<User>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
})
.AddRoles<IdentityRole<Guid>>()
.AddEntityFrameworkStores<AppDbContext>();

// Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPriorityService, PriorityService>();
builder.Services.AddScoped<IJobApplicationService, JobApplicationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IJobTypeService, JobTypeService>();
builder.Services.AddScoped<IWorkTypeService, WorkTypeService>();
builder.Services.AddScoped<ISourcePlatformService, SourcePlatformService>();
builder.Services.AddScoped<IApplicationStatusService, ApplicationStatusService>();
builder.Services.AddScoped<IInterviewRoundService, InterviewRoundService>();
builder.Services.AddScoped<IImportExportService, ImportExportService>();
builder.Services.AddScoped<IJobRoleService, JobRoleService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IRejectionRetrospectiveService, RejectionRetrospectiveService>();

// Current User
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// Controllers & Swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPolicy", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});



// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("AuthPolicy", policy =>
    {
        policy.PermitLimit = 10;
        policy.Window = TimeSpan.FromMinutes(1);
        policy.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        policy.QueueLimit = 0;
    });
});

var app = builder.Build();

// Security Headers Middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

// Exception & Logging Middleware
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
app.UseCors("ClientPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

// Database Migration & Seeder
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbSeeder.SeedAsync(context);
}

app.Run();
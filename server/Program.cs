using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using server.Data;

// Load .env file in all environments (overrides are ignored if real env vars already exist)
Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// --- Database (Neon PostgreSQL via EF Core) ---
var connectionString = builder.Configuration.GetConnectionString("NeonDb")
    ?? throw new InvalidOperationException("Connection string 'NeonDb' not found.");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                builder.Configuration["AllowedOrigin"] ?? "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// --- Controllers & Swagger ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- Middleware ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowNextJs");
app.UseAuthorization();
app.MapControllers();

app.Run();

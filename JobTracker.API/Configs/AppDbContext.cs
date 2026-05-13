using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Configs;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<User> Users => Set<User>();
    public DbSet<Priority> Priorities => Set<Priority>();
    public DbSet<JobType> JobTypes => Set<JobType>();
    public DbSet<SourcePlatform> SourcePlatforms => Set<SourcePlatform>();
    public DbSet<WorkType> WorkTypes => Set<WorkType>();
    public DbSet<ApplicationStatus> ApplicationStatuses => Set<ApplicationStatus>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
    }
}
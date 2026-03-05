using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<Interview> Interviews => Set<Interview>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.ClerkUserId)
            .IsUnique();

        // JobApplication → User
        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.User)
            .WithMany(u => u.JobApplications)
            .HasForeignKey(j => j.UserId);

        // JobApplication enum conversions
        modelBuilder.Entity<JobApplication>()
            .Property(j => j.WorkType)
            .HasConversion<string>();
        modelBuilder.Entity<JobApplication>()
            .Property(j => j.JobType)
            .HasConversion<string>();
        modelBuilder.Entity<JobApplication>()
            .Property(j => j.SourcePlatform)
            .HasConversion<string>();
        modelBuilder.Entity<JobApplication>()
            .Property(j => j.ApplicationMethod)
            .HasConversion<string>();
        modelBuilder.Entity<JobApplication>()
            .Property(j => j.Status)
            .HasConversion<string>();
        modelBuilder.Entity<JobApplication>()
            .Property(j => j.Priority)
            .HasConversion<string>();

        // Soft delete filter — apply to both sides of the relationship
        modelBuilder.Entity<JobApplication>()
            .HasQueryFilter(j => !j.IsDeleted);
        modelBuilder.Entity<Interview>()
            .HasQueryFilter(i => i.Job == null || !i.Job.IsDeleted);

        // Interview → JobApplication
        modelBuilder.Entity<Interview>()
            .HasOne(i => i.Job)
            .WithMany(j => j.Interviews)
            .HasForeignKey(i => i.JobId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Interview>()
            .Property(i => i.InterviewType)
            .HasConversion<string>();
        modelBuilder.Entity<Interview>()
            .Property(i => i.Outcome)
            .HasConversion<string>();

        // ActivityLog → User
        modelBuilder.Entity<ActivityLog>()
            .HasOne(a => a.User)
            .WithMany(u => u.ActivityLogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ActivityLog → JobApplication (nullable)
        modelBuilder.Entity<ActivityLog>()
            .HasOne(a => a.Job)
            .WithMany(j => j.ActivityLogs)
            .HasForeignKey(a => a.JobId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

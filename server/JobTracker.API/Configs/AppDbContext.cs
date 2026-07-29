using JobTracker.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Configs;

public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Priority> Priorities => Set<Priority>();
    public DbSet<JobType> JobTypes => Set<JobType>();
    public DbSet<SourcePlatform> SourcePlatforms => Set<SourcePlatform>();
    public DbSet<WorkType> WorkTypes => Set<WorkType>();
    public DbSet<ApplicationStatus> ApplicationStatuses => Set<ApplicationStatus>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<InterviewRound> InterviewRounds => Set<InterviewRound>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // JobApplication Relationships
        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.User)
            .WithMany(u => u.JobApplications)
            .HasForeignKey(j => j.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.Priority)
            .WithMany(p => p.JobApplications)
            .HasForeignKey(j => j.PriorityId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.JobType)
            .WithMany(jt => jt.JobApplications)
            .HasForeignKey(j => j.JobTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.SourcePlatform)
            .WithMany(sp => sp.JobApplications)
            .HasForeignKey(j => j.SourcePlatformId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.WorkType)
            .WithMany(wt => wt.JobApplications)
            .HasForeignKey(j => j.WorkTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.ApplicationStatus)
            .WithMany(s => s.JobApplications)
            .HasForeignKey(j => j.ApplicationStatusId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.Company)
            .WithMany(c => c.JobApplications)
            .HasForeignKey(j => j.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<InterviewRound>()
            .HasOne(r => r.JobApplication)
            .WithMany(j => j.InterviewRounds)
            .HasForeignKey(r => r.JobApplicationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
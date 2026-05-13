using JobTracker.API.Configs;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await SeedPriorities(context);
        await SeedJobTypes(context);
        await SeedWorkTypes(context);
        await SeedSourcePlatforms(context);
        await SeedApplicationStatuses(context);
    }

    // Priorities
    private static async Task SeedPriorities(AppDbContext context)
    {
        if (await context.Priorities.AnyAsync())
        {
            return;
        }

        var priorities = new List<Priority>
        {
            new() {
                Name = "High",
                Color = "red"
            },
            new() {
                Name = "Medium",
                Color = "amber"
            },
            new() {
                Name = "Low",
                Color = "green"
            }
        };

        await context.Priorities.AddRangeAsync(priorities);
        await context.SaveChangesAsync();
    }

    // Job Types
    private static async Task SeedJobTypes(AppDbContext context)
    {
        if (await context.JobTypes.AnyAsync())
        {
            return;
        }

        var jobTypes = new List<JobType>
        {
            new() { Name = "Full Time" },
            new() { Name = "Part Time" },
            new() { Name = "Internship" },
            new() { Name = "Contract" }
        };

        await context.JobTypes.AddRangeAsync(jobTypes);
        await context.SaveChangesAsync();
    }

    // Work Types
    private static async Task SeedWorkTypes(AppDbContext context)
    {
        if (await context.WorkTypes.AnyAsync())
        {
            return;
        }

        var workTypes = new List<WorkType>
        {
            new() { Name = "Remote" },
            new() { Name = "Hybrid" },
            new() { Name = "Onsite" }
        };

        await context.WorkTypes.AddRangeAsync(workTypes);
        await context.SaveChangesAsync();
    }

    // Platforms
    private static async Task SeedSourcePlatforms(AppDbContext context)
    {
        if (await context.SourcePlatforms.AnyAsync())
        {
            return;
        }

        var platforms = new List<SourcePlatform>
            {
                new() { Name = "LinkedIn" },
                new() { Name = "Indeed" },
                new() { Name = "Bdjobs" },
                new() { Name = "Company Website" },
                new() { Name = "Referral" }
            };

        await context.SourcePlatforms.AddRangeAsync(platforms);
        await context.SaveChangesAsync();
    }

    // Statuses
    private static async Task SeedApplicationStatuses(AppDbContext context)
    {
        if (await context.ApplicationStatuses.AnyAsync())
        {
            return;
        }

        var statuses = new List<ApplicationStatus>
            {
                new() { Name = "Saved" },
                new() { Name = "Applied" },
                new() { Name = "Interview" },
                new() { Name = "Rejected" },
                new() { Name = "Offer" },
                new() { Name = "Ghosted" }
            };

        await context.ApplicationStatuses.AddRangeAsync(statuses);
        await context.SaveChangesAsync();
    }
}
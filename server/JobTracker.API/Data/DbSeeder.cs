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
        await SeedJobRoles(context);
        await SeedCompanies(context);
        await SeedUsers(context);
        await SeedJobApplications(context);
    }

    private static async Task SeedJobRoles(AppDbContext context)
    {
        if (await context.JobRoles.AnyAsync()) return;

        var roles = new List<JobRole>
        {
            new() { Name = "Frontend Engineer" },
            new() { Name = "Backend Developer" },
            new() { Name = "Fullstack Engineer" },
            new() { Name = "Software Engineer" },
            new() { Name = "DevOps Engineer" },
            new() { Name = "Mobile Engineer" },
            new() { Name = "UI/UX Designer" },
            new() { Name = "Product Manager" },
            new() { Name = "Data Engineer" },
            new() { Name = "QA Engineer" }
        };

        await context.JobRoles.AddRangeAsync(roles);
        await context.SaveChangesAsync();
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

    private static async Task SeedCompanies(AppDbContext context)
    {
        if (await context.Companies.AnyAsync())
        {
            return;
        }

        var companies = new List<Company>
        {
            new()
            {
                Name = "Google",
                CareerPageUrl = "https://careers.google.com",
                WebsiteUrl = "https://google.com",
                Location = "Remote"
            },

            new()
            {
                Name = "Microsoft",
                CareerPageUrl = "https://careers.microsoft.com",
                WebsiteUrl = "https://microsoft.com",
                Location = "Hybrid"
            },

            new()
            {
                Name = "Shopify",
                CareerPageUrl = "https://shopify.com/careers",
                WebsiteUrl = "https://shopify.com",
                Location = "Remote"
            },

            new()
            {
                Name = "Softvence",
                CareerPageUrl = "https://softvencefsd.xyz/career",
                WebsiteUrl = "https://softvencefsd.xyz",
                Location = "Dhaka"
            }
        };

        await context.Companies.AddRangeAsync(companies);
        await context.SaveChangesAsync();
    }

    private static async Task SeedUsers(AppDbContext context)
    {
        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();

        var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (existingUser is null)
        {
            var user = new User
            {
                UserName = "demo@jobtracker.dev",
                NormalizedUserName = "DEMO@JOBTRACKER.DEV",
                Email = "demo@jobtracker.dev",
                NormalizedEmail = "DEMO@JOBTRACKER.DEV",
                Name = "Demo User",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            user.PasswordHash = hasher.HashPassword(user, "Demo@123");
            await context.Users.AddAsync(user);
        }
        else
        {
            existingUser.UserName = "demo@jobtracker.dev";
            existingUser.NormalizedUserName = "DEMO@JOBTRACKER.DEV";
            existingUser.NormalizedEmail = "DEMO@JOBTRACKER.DEV";
            existingUser.PasswordHash = hasher.HashPassword(existingUser, "Demo@123");
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedJobApplications(AppDbContext context)
    {
        if (await context.JobApplications.AnyAsync())
        {
            return;
        }

        var user = await context.Users.FirstAsync();
        var companies = await context.Companies.ToListAsync();
        var priorities = await context.Priorities.ToListAsync();
        var jobTypes = await context.JobTypes.ToListAsync();
        var statuses = await context.ApplicationStatuses.ToListAsync();
        var platforms = await context.SourcePlatforms.ToListAsync();
        var workTypes = await context.WorkTypes.ToListAsync();
        var applications = new List<JobApplication>
            {
                new()
                {
                    UserId = user.Id,
                    CompanyId = companies.First(c => c.Name == "Google").Id,
                    Role = "Frontend Engineer",
                    JobUrl = "https://careers.google.com",
                    Location = "Remote",
                    SalaryRange = "$120k-$150k",
                    Notes =
                        """
                        ## Google Interview Prep

                        - Focus on React architecture
                        - Practice system design
                        - Revise algorithms

                        ### Important

                        Need better DSA consistency.
                        """,
                    CoverLetter =
                        """
                        Dear Hiring Team,

                        I am excited to apply...
                        """,
                    ResumeDriveLink = "https://drive.google.com/example",
                    AppliedAt = DateTime.UtcNow.AddDays(-7),
                    FollowUpDate = DateTime.UtcNow.AddDays(3),
                    PriorityId = priorities.First(p => p.Name == "High").Id,
                    JobTypeId = jobTypes.First(j => j.Name == "Full Time").Id,
                    SourcePlatformId = platforms.First(p => p.Name == "LinkedIn").Id,
                    ApplicationStatusId = statuses.First(s => s.Name == "Interview").Id,
                    WorkTypeId = workTypes.First(w => w.Name == "Remote").Id
                },

                new()
                {
                    UserId = user.Id,
                    CompanyId = companies.First(c => c.Name == "Shopify").Id,
                    Role = "Backend Developer",
                    JobUrl = "https://shopify.com/careers",
                    Location = "Remote",
                    SalaryRange = "$100k-$130k",
                    Notes =
                        """
                        ## Shopify Notes

                        - Strong .NET backend
                        - PostgreSQL scaling
                        - API design focus
                        """,
                    AppliedAt = DateTime.UtcNow.AddDays(-3),
                    PriorityId = priorities.First(p => p.Name == "Medium").Id,
                    JobTypeId = jobTypes.First(j => j.Name == "Full Time").Id,
                    SourcePlatformId = platforms.First(p => p.Name == "Company Website").Id,
                    ApplicationStatusId = statuses.First(s => s.Name == "Applied").Id,
                    WorkTypeId = workTypes.First(w => w.Name == "Remote").Id
                }
            };

        await context.JobApplications.AddRangeAsync(applications);
        await context.SaveChangesAsync();
    }
}
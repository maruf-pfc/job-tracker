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
        var existingRoles = await context.JobRoles.Select(r => r.Name).ToListAsync();
        var rolesToSeed = new List<JobRole>
        {
            new() { Name = "Frontend Engineer" },
            new() { Name = "Senior Frontend Developer" },
            new() { Name = "Backend Engineer (.NET / Go)" },
            new() { Name = "Fullstack Engineer (React & Node)" },
            new() { Name = "Software Architect" },
            new() { Name = "DevOps & Cloud Engineer" },
            new() { Name = "Site Reliability Engineer (SRE)" },
            new() { Name = "Mobile Engineer (iOS / Android)" },
            new() { Name = "AI / ML Engineer" },
            new() { Name = "Data Platform Engineer" },
            new() { Name = "UI/UX Product Designer" },
            new() { Name = "Technical Product Manager" },
            new() { Name = "QA Automation Engineer" },
            new() { Name = "Security Engineer" },
            new() { Name = "Systems Infrastructure Developer" }
        };

        var newRoles = rolesToSeed.Where(r => !existingRoles.Contains(r.Name, StringComparer.OrdinalIgnoreCase)).ToList();
        if (newRoles.Any())
        {
            await context.JobRoles.AddRangeAsync(newRoles);
            await context.SaveChangesAsync();
        }
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
        var existingCompanyNames = await context.Companies.Select(c => c.Name).ToListAsync();
        var companiesToSeed = new List<Company>
        {
            new() { Name = "Google", CareerPageUrl = "https://careers.google.com", WebsiteUrl = "https://google.com", Location = "Mountain View, CA (Remote)" },
            new() { Name = "Microsoft", CareerPageUrl = "https://careers.microsoft.com", WebsiteUrl = "https://microsoft.com", Location = "Redmond, WA (Hybrid)" },
            new() { Name = "Shopify", CareerPageUrl = "https://shopify.com/careers", WebsiteUrl = "https://shopify.com", Location = "Remote" },
            new() { Name = "Vercel", CareerPageUrl = "https://vercel.com/careers", WebsiteUrl = "https://vercel.com", Location = "San Francisco, CA (Remote)" },
            new() { Name = "Stripe", CareerPageUrl = "https://stripe.com/jobs", WebsiteUrl = "https://stripe.com", Location = "San Francisco, CA (Hybrid)" },
            new() { Name = "Meta", CareerPageUrl = "https://metacareers.com", WebsiteUrl = "https://meta.com", Location = "Menlo Park, CA" },
            new() { Name = "Amazon", CareerPageUrl = "https://amazon.jobs", WebsiteUrl = "https://amazon.com", Location = "Seattle, WA" },
            new() { Name = "Netflix", CareerPageUrl = "https://jobs.netflix.com", WebsiteUrl = "https://netflix.com", Location = "Los Gatos, CA" },
            new() { Name = "Datadog", CareerPageUrl = "https://datadoghq.com/careers", WebsiteUrl = "https://datadoghq.com", Location = "New York, NY (Remote)" },
            new() { Name = "Uber", CareerPageUrl = "https://uber.com/careers", WebsiteUrl = "https://uber.com", Location = "San Francisco, CA" },
            new() { Name = "Airbnb", CareerPageUrl = "https://careers.airbnb.com", WebsiteUrl = "https://airbnb.com", Location = "San Francisco, CA (Remote)" },
            new() { Name = "Figma", CareerPageUrl = "https://figma.com/careers", WebsiteUrl = "https://figma.com", Location = "San Francisco, CA (Hybrid)" }
        };

        var newCompanies = companiesToSeed.Where(c => !existingCompanyNames.Contains(c.Name)).ToList();
        if (newCompanies.Any())
        {
            await context.Companies.AddRangeAsync(newCompanies);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedUsers(AppDbContext context)
    {
        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();

        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (user is null)
        {
            user = new User
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
            await context.SaveChangesAsync();
        }

        // Clean and Seed Demo User Profile
        var existingProfile = await context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (existingProfile is null)
        {
            var profile = new UserProfile
            {
                UserId = user.Id,
                NameEnglish = "Demo User",
                Email = "demo@jobtracker.dev",
                Nationality = "Bangladeshi",
                Religion = "Islam",
                Gender = "Male",
                MaritalStatus = "Single",
                BioSummary = "Senior Full Stack Engineer with 4+ years of experience building high-scale web platforms using React, Next.js, .NET 10 Web APIs, and PostgreSQL.",
                PresentDivision = "Dhaka",
                PresentDistrict = "Dhaka",
                PresentArea = "Gulshan 2",
                PresentLocation = "Road 45",
                PresentHouse = "Building 12",
                PresentUpazila = "Gulshan",
                PresentPoliceStation = "Gulshan",
                PresentPostOffice = "Gulshan",
                PresentPostCode = "1212",
                PermanentDivision = "Dhaka",
                PermanentDistrict = "Dhaka",
                PermanentUpazila = "Dhaka North",
                PermanentUnion = "Ward 19",
                PermanentVillage = "Central City",
                PermanentPostOffice = "Central",
                PermanentPoliceStation = "Central",
                PermanentPostCode = "1200",
                EducationDetailsJson = "[{\"degree\":\"B.Sc in Computer Science & Engineering\",\"institution\":\"University of Technology\",\"year\":\"2022\",\"result\":\"3.85 / 4.00\"}]",
                CodingProfilesJson = "[{\"platform\":\"GitHub\",\"url\":\"https://github.com/demo-dev\",\"username\":\"demo-dev\"},{\"platform\":\"LeetCode\",\"url\":\"https://leetcode.com/demo-dev\",\"username\":\"demo-dev\"}]"
            };
            await context.UserProfiles.AddAsync(profile);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedJobApplications(AppDbContext context)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (user is null) return;

        // Clean and re-seed 12 showcase applications for Demo User
        var existingApps = await context.JobApplications.Where(j => j.UserId == user.Id).ToListAsync();
        if (existingApps.Count == 12) return;

        if (existingApps.Any())
        {
            context.JobApplications.RemoveRange(existingApps);
            await context.SaveChangesAsync();
        }

        var companies = await context.Companies.ToListAsync();
        var priorities = await context.Priorities.ToListAsync();
        var jobTypes = await context.JobTypes.ToListAsync();
        var statuses = await context.ApplicationStatuses.ToListAsync();
        var platforms = await context.SourcePlatforms.ToListAsync();
        var workTypes = await context.WorkTypes.ToListAsync();

        Company GetCompany(string name) =>
            companies.FirstOrDefault(c => string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? companies.First();

        Priority GetPriority(string name) =>
            priorities.FirstOrDefault(p => string.Equals(p.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? priorities.First();

        JobType GetJobType(string name) =>
            jobTypes.FirstOrDefault(j => string.Equals(j.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? jobTypes.First();

        ApplicationStatus GetStatus(string name) =>
            statuses.FirstOrDefault(s => string.Equals(s.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? statuses.First();

        SourcePlatform GetPlatform(string name) =>
            platforms.FirstOrDefault(p => string.Equals(p.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? platforms.First();

        WorkType GetWorkType(string name) =>
            workTypes.FirstOrDefault(w => string.Equals(w.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? workTypes.First();

        var applications = new List<JobApplication>
        {
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Google").Id,
                Role = "Senior Frontend Engineer",
                JobUrl = "https://careers.google.com/jobs/results/12345",
                Location = "Remote",
                SalaryRange = "$140,000 - $175,000",
                Notes = "## Technical Assessment Round\n- Passed initial recruiter screening\n- System Design focus: Micro-frontend architecture and Web Vitals LCP/INP optimization\n- Coding interview scheduled for next Tuesday",
                AppliedAt = DateTime.UtcNow.AddDays(-14),
                FollowUpDate = DateTime.UtcNow.AddDays(2),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Interview").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Vercel").Id,
                Role = "Fullstack Engineer (Next.js)",
                JobUrl = "https://vercel.com/careers/fullstack-eng",
                Location = "San Francisco, CA (Remote)",
                SalaryRange = "$150,000 - $185,000",
                Notes = "## Offer Received! 🎉\n- Base Salary: $165,000\n- Stock Options: 20,000 shares (4-year vest)\n- Unlimited PTO & $3,000 home office budget\n- Decision deadline: End of month",
                AppliedAt = DateTime.UtcNow.AddDays(-28),
                FollowUpDate = DateTime.UtcNow.AddDays(5),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Company Website").Id,
                ApplicationStatusId = GetStatus("Offer").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Stripe").Id,
                Role = "Backend Engineer - Payments Infrastructure",
                JobUrl = "https://stripe.com/jobs/listing/45678",
                Location = "Remote",
                SalaryRange = "$145,000 - $180,000",
                Notes = "## Technical Onsite Prep\n- Distributed systems API idempotency\n- PostgreSQL transaction isolation levels & Redis caching\n- Interviewers: Staff Infrastructure Architect",
                AppliedAt = DateTime.UtcNow.AddDays(-10),
                FollowUpDate = DateTime.UtcNow.AddDays(1),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Referral").Id,
                ApplicationStatusId = GetStatus("Interview").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Shopify").Id,
                Role = "Staff Software Engineer",
                JobUrl = "https://shopify.com/careers/staff-eng",
                Location = "Remote",
                SalaryRange = "$135,000 - $160,000",
                Notes = "Applied directly through referral link from team lead. Resume focused on React Query & .NET microservices architecture.",
                AppliedAt = DateTime.UtcNow.AddDays(-5),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Referral").Id,
                ApplicationStatusId = GetStatus("Applied").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Datadog").Id,
                Role = "Backend Engineer (Go/.NET)",
                JobUrl = "https://datadoghq.com/careers/backend-dev",
                Location = "New York, NY (Remote)",
                SalaryRange = "$130,000 - $155,000",
                Notes = "Screening call completed with Engineering Manager. Discussion on high-throughput metric ingestion pipelines.",
                AppliedAt = DateTime.UtcNow.AddDays(-8),
                FollowUpDate = DateTime.UtcNow.AddDays(4),
                PriorityId = GetPriority("Medium").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Interview").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Microsoft").Id,
                Role = "Senior Cloud Solution Architect",
                JobUrl = "https://careers.microsoft.com/job/78910",
                Location = "Hybrid",
                SalaryRange = "$140,000 - $170,000",
                Notes = "Submitted custom cover letter focusing on Azure Enterprise deployments and EF Core ORM optimizations.",
                AppliedAt = DateTime.UtcNow.AddDays(-12),
                PriorityId = GetPriority("Medium").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Company Website").Id,
                ApplicationStatusId = GetStatus("Applied").Id,
                WorkTypeId = GetWorkType("Hybrid").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Figma").Id,
                Role = "Frontend Systems Engineer",
                JobUrl = "https://figma.com/careers/frontend-systems",
                Location = "Hybrid",
                SalaryRange = "$150,000 - $180,000",
                Notes = "Saved role for Q3 applications. Requires WebAssembly and Canvas API optimization experience.",
                AppliedAt = DateTime.UtcNow.AddDays(-2),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Saved").Id,
                WorkTypeId = GetWorkType("Hybrid").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Linear").Id,
                Role = "Product Engineer (TypeScript)",
                JobUrl = "https://linear.app/careers/product-engineer",
                Location = "Remote",
                SalaryRange = "$140,000 - $170,000",
                Notes = "High priority saved listing. Love their sync engine and keyboard-first UI architecture.",
                AppliedAt = DateTime.UtcNow.AddDays(-1),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Company Website").Id,
                ApplicationStatusId = GetStatus("Saved").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Airbnb").Id,
                Role = "Full Stack Platform Engineer",
                JobUrl = "https://careers.airbnb.com/positions/345",
                Location = "Remote",
                SalaryRange = "$135,000 - $165,000",
                Notes = "Role closed due to head-count freeze. Received polite automated update.",
                AppliedAt = DateTime.UtcNow.AddDays(-40),
                PriorityId = GetPriority("Low").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Rejected").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Uber").Id,
                Role = "Senior Realtime Systems Engineer",
                JobUrl = "https://uber.com/careers/list/9012",
                Location = "Onsite",
                SalaryRange = "$130,000 - $155,000",
                Notes = "Applied 3 weeks ago via Indeed. No recruiter response received yet.",
                AppliedAt = DateTime.UtcNow.AddDays(-21),
                PriorityId = GetPriority("Low").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Indeed").Id,
                ApplicationStatusId = GetStatus("Ghosted").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Netflix").Id,
                Role = "UI Infrastructure Engineer",
                JobUrl = "https://jobs.netflix.com/jobs/56789",
                Location = "Remote",
                SalaryRange = "$160,000 - $190,000",
                Notes = "Submitted application with video submission requirement.",
                AppliedAt = DateTime.UtcNow.AddDays(-6),
                PriorityId = GetPriority("Medium").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Company Website").Id,
                ApplicationStatusId = GetStatus("Applied").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Meta").Id,
                Role = "Software Engineer - React Native & Mobile Web",
                JobUrl = "https://metacareers.com/v2/jobs/112233",
                Location = "Menlo Park, CA",
                SalaryRange = "$145,000 - $175,000",
                Notes = "Application submitted via employee referral. Awaiting initial screening email.",
                AppliedAt = DateTime.UtcNow.AddDays(-4),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Referral").Id,
                ApplicationStatusId = GetStatus("Applied").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            }
        };

        await context.JobApplications.AddRangeAsync(applications);
        await context.SaveChangesAsync();
    }
}
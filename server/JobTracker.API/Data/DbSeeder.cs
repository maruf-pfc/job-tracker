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
            new() { Name = "Senior Frontend Developer" },
            new() { Name = "Backend Engineer (.NET / Go)" },
            new() { Name = "Fullstack Engineer (React & Node)" },
            new() { Name = "Assistant Programmer / IT Officer (Govt)" },
            new() { Name = "Senior Officer (IT) - Govt Bank" },
            new() { Name = "DevOps & Cloud Engineer" },
            new() { Name = "AI / ML Engineer" }
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
            new() { Name = "Govt / Cadre Service" },
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
        var existingPlatforms = await context.SourcePlatforms.Select(p => p.Name).ToListAsync();
        var platformsToSeed = new List<SourcePlatform>
        {
            new() { Name = "LinkedIn" },
            new() { Name = "Indeed" },
            new() { Name = "Bdjobs" },
            new() { Name = "Teletalk AllJobs" },
            new() { Name = "BPSC (bpsc.gov.bd)" },
            new() { Name = "Bangladesh Bank eRecruitment" },
            new() { Name = "Company Website" },
            new() { Name = "Referral" }
        };

        var newPlatforms = platformsToSeed.Where(p => !existingPlatforms.Contains(p.Name, StringComparer.OrdinalIgnoreCase)).ToList();
        if (newPlatforms.Any())
        {
            await context.SourcePlatforms.AddRangeAsync(newPlatforms);
            await context.SaveChangesAsync();
        }
    }

    // Statuses
    private static async Task SeedApplicationStatuses(AppDbContext context)
    {
        var existingStatuses = await context.ApplicationStatuses.Select(s => s.Name).ToListAsync();
        var statusesToSeed = new List<ApplicationStatus>
        {
            new() { Name = "Saved" },
            new() { Name = "Applied" },
            new() { Name = "MCQ / Preliminary" },
            new() { Name = "Written Exam" },
            new() { Name = "Practical / Skill Test" },
            new() { Name = "Viva Voce" },
            new() { Name = "Medical & Verification" },
            new() { Name = "Interview" },
            new() { Name = "Offer" },
            new() { Name = "Rejected" },
            new() { Name = "Ghosted" }
        };

        var newStatuses = statusesToSeed.Where(s => !existingStatuses.Contains(s.Name, StringComparer.OrdinalIgnoreCase)).ToList();
        if (newStatuses.Any())
        {
            await context.ApplicationStatuses.AddRangeAsync(newStatuses);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedCompanies(AppDbContext context)
    {
        var existingCompanyNames = await context.Companies.Select(c => c.Name).ToListAsync();
        var companiesToSeed = new List<Company>
        {
            new() { Name = "Google", CareerPageUrl = "https://careers.google.com", WebsiteUrl = "https://google.com", Location = "Mountain View, CA (Remote)" },
            new() { Name = "Microsoft", CareerPageUrl = "https://careers.microsoft.com", WebsiteUrl = "https://microsoft.com", Location = "Redmond, WA (Hybrid)" },
            new() { Name = "Bangladesh Bank", CareerPageUrl = "https://erecruiter.bb.org.bd", WebsiteUrl = "https://bb.org.bd", Location = "Motijheel, Dhaka" },
            new() { Name = "BPDB (Power Board)", CareerPageUrl = "http://bpdb.teletalk.com.bd", WebsiteUrl = "http://bpdb.gov.bd", Location = "Dhaka, Bangladesh" },
            new() { Name = "Vercel", CareerPageUrl = "https://vercel.com/careers", WebsiteUrl = "https://vercel.com", Location = "San Francisco, CA (Remote)" },
            new() { Name = "Stripe", CareerPageUrl = "https://stripe.com/jobs", WebsiteUrl = "https://stripe.com", Location = "San Francisco, CA (Hybrid)" }
        };

        var newCompanies = companiesToSeed.Where(c => !existingCompanyNames.Contains(c.Name, StringComparer.OrdinalIgnoreCase)).ToList();
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
                BioSummary = "Full Stack Engineer & Govt IT Aspirant with experience in React, .NET 10 Web APIs, PostgreSQL, and Competitive Govt/Bank Recruitment Exams.",
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
                EducationDetailsJson = "[{\"degree\":\"B.Sc in Computer Science & Engineering\",\"institution\":\"University of Dhaka / BUET\",\"year\":\"2022\",\"result\":\"3.85 / 4.00\"}]",
                CodingProfilesJson = "[{\"platform\":\"GitHub\",\"url\":\"https://github.com/demo-dev\",\"username\":\"demo-dev\"}]"
            };
            await context.UserProfiles.AddAsync(profile);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedJobApplications(AppDbContext context)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (user is null) return;

        var existingApps = await context.JobApplications.Where(j => j.UserId == user.Id).ToListAsync();
        if (existingApps.Count >= 5) return;

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
                CompanyId = GetCompany("Bangladesh Bank").Id,
                Role = "Assistant Programmer (Govt)",
                JobUrl = "https://erecruiter.bb.org.bd/job_circular.php",
                Location = "Motijheel, Dhaka",
                SalaryRange = "Grade-9 (22,000 - 53,060 BDT)",
                Notes = "## Bangladesh Bank Written Exam Details\n- Passed MCQ Preliminary screening (Marks: 72/100)\n- Written Exam Date: Friday, 10:00 AM at BUET Campus\n- Focus: Data Structures, C++, SQL, Networking, and ICT Policy",
                AppliedAt = DateTime.UtcNow.AddDays(-14),
                FollowUpDate = DateTime.UtcNow.AddDays(2),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Govt / Cadre Service").Id,
                SourcePlatformId = GetPlatform("Bangladesh Bank eRecruitment").Id,
                ApplicationStatusId = GetStatus("Written Exam").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("BPDB (Power Board)").Id,
                Role = "Assistant Engineer (IT)",
                JobUrl = "http://bpdb.teletalk.com.bd",
                Location = "Dhaka, Bangladesh",
                SalaryRange = "Grade-9 (22,000 - 53,060 BDT)",
                Notes = "## Viva Voce & Document Verification Round\n- Qualified MCQ & Written Subjective Exam!\n- Viva Board: BPDB Headquarters, Abdul Gani Road\n- Documents: All Academic Certificates, NID, Citizenship Certificate",
                AppliedAt = DateTime.UtcNow.AddDays(-28),
                FollowUpDate = DateTime.UtcNow.AddDays(5),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Govt / Cadre Service").Id,
                SourcePlatformId = GetPlatform("Teletalk AllJobs").Id,
                ApplicationStatusId = GetStatus("Viva Voce").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            },
            new()
            {
                UserId = user.Id,
                CompanyId = GetCompany("Google").Id,
                Role = "Senior Frontend Engineer",
                JobUrl = "https://careers.google.com/jobs/results/12345",
                Location = "Remote",
                SalaryRange = "$140,000 - $175,000",
                Notes = "## Technical Assessment Round\n- System Design focus: Micro-frontend architecture and Web Vitals LCP/INP optimization",
                AppliedAt = DateTime.UtcNow.AddDays(-10),
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
                Notes = "## Offer Received! 🎉\n- Base Salary: $165,000\n- Stock Options: 20,000 shares (4-year vest)",
                AppliedAt = DateTime.UtcNow.AddDays(-25),
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
                Notes = "Saved role for upcoming Q3 applications.",
                AppliedAt = DateTime.UtcNow.AddDays(-2),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Referral").Id,
                ApplicationStatusId = GetStatus("Saved").Id,
                WorkTypeId = GetWorkType("Remote").Id
            }
        };

        await context.JobApplications.AddRangeAsync(applications);
        await context.SaveChangesAsync();
    }
}
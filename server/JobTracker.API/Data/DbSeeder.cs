using System.Text.Json;
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
        await SeedRejectionRetrospectives(context);
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
            new() { Name = "BPSC (Public Service)", CareerPageUrl = "http://bpsc.teletalk.com.bd", WebsiteUrl = "http://bpsc.gov.bd", Location = "Agargaon, Dhaka" },
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

        // 1. Seed / Sync Admin User from environment variables (e.g. .env)
        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL")?.Trim();
        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD")?.Trim();

        if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
        {
            var normalizedEmail = adminEmail.ToLowerInvariant();
            var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (adminUser is null)
            {
                adminUser = new User
                {
                    UserName = normalizedEmail,
                    NormalizedUserName = normalizedEmail.ToUpperInvariant(),
                    Email = normalizedEmail,
                    NormalizedEmail = normalizedEmail.ToUpperInvariant(),
                    Name = "Administrator",
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                adminUser.PasswordHash = hasher.HashPassword(adminUser, adminPassword);
                await context.Users.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }
            else
            {
                // Sync password to ensure login always succeeds with ADMIN_PASSWORD from .env
                adminUser.PasswordHash = hasher.HashPassword(adminUser, adminPassword);
                await context.SaveChangesAsync();
            }

            // Clean and Seed Admin User Profile
            var adminProfile = await context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == adminUser.Id);
            if (adminProfile is null)
            {
                adminProfile = new UserProfile
                {
                    UserId = adminUser.Id,
                    NameEnglish = adminUser.Name,
                    Email = normalizedEmail,
                    Nationality = "Bangladeshi",
                    Religion = "Islam",
                    Gender = "Male",
                    MaritalStatus = "Single",
                    BioSummary = "Full Stack Engineer & Career Aspirant. Experienced with .NET 10, React, PostgreSQL, and Competitive Govt/Bank ICT Recruitment Exams.",
                    PresentDivision = "Dhaka",
                    PresentDistrict = "Dhaka",
                    PresentArea = "Gulshan",
                    PresentLocation = "Main Road",
                    PresentHouse = "HQ",
                    PresentUpazila = "Gulshan",
                    PresentPoliceStation = "Gulshan",
                    PresentPostOffice = "Gulshan",
                    PresentPostCode = "1212",
                    PermanentDivision = "Dhaka",
                    PermanentDistrict = "Dhaka",
                    PermanentUpazila = "Dhaka North",
                    PermanentUnion = "Ward 1",
                    PermanentVillage = "Central",
                    PermanentPostOffice = "Central",
                    PermanentPoliceStation = "Central",
                    PermanentPostCode = "1200",
                    EducationDetailsJson = "[{\"degree\":\"B.Sc in Computer Science & Engineering\",\"institution\":\"University / Engineering College\",\"year\":\"2022\",\"result\":\"3.85 / 4.00\"}]",
                    CodingProfilesJson = "[]"
                };
                await context.UserProfiles.AddAsync(adminProfile);
                await context.SaveChangesAsync();
            }
        }

        // 2. Seed Demo User
        var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (demoUser is null)
        {
            demoUser = new User
            {
                UserName = "demo@jobtracker.dev",
                NormalizedUserName = "DEMO@JOBTRACKER.DEV",
                Email = "demo@jobtracker.dev",
                NormalizedEmail = "DEMO@JOBTRACKER.DEV",
                Name = "Demo User",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            demoUser.PasswordHash = hasher.HashPassword(demoUser, "Demo@123");
            await context.Users.AddAsync(demoUser);
            await context.SaveChangesAsync();
        }

        // Clean and Seed Demo User Profile
        var demoProfile = await context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == demoUser.Id);
        if (demoProfile is null)
        {
            var profile = new UserProfile
            {
                UserId = demoUser.Id,
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
        // Ensure Admin account is clean and has NO dummy applications
        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL")?.Trim();
        if (!string.IsNullOrWhiteSpace(adminEmail))
        {
            var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail.ToLowerInvariant());
            if (adminUser != null)
            {
                var adminDummyApps = await context.JobApplications.Where(j => j.UserId == adminUser.Id).ToListAsync();
                if (adminDummyApps.Any())
                {
                    var adminRetros = await context.RejectionRetrospectives.Where(r => r.UserId == adminUser.Id).ToListAsync();
                    context.RejectionRetrospectives.RemoveRange(adminRetros);
                    context.JobApplications.RemoveRange(adminDummyApps);
                    await context.SaveChangesAsync();
                }
            }
        }

        var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (demoUser is null) return;

        var existingApps = await context.JobApplications.Where(j => j.UserId == demoUser.Id).ToListAsync();
        if (existingApps.Count >= 6) return;

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
                UserId = demoUser.Id,
                CompanyId = GetCompany("Bangladesh Bank").Id,
                Role = "Assistant Programmer (Govt)",
                JobUrl = "https://erecruiter.bb.org.bd/job_circular.php",
                Location = "Motijheel, Dhaka",
                SalaryRange = "Grade-9 (22,000 - 53,060 BDT)",
                Notes = "## Bangladesh Bank Written Exam Details\n- Passed MCQ Preliminary screening (Marks: 72/100)\n- Written Exam Date: Friday, 10:00 AM at BUET Campus\n- Focus: Data Structures, C++, SQL, Networking, and ICT Policy",
                AppliedAt = DateTime.UtcNow.AddDays(-14),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Govt / Cadre Service").Id,
                SourcePlatformId = GetPlatform("Bangladesh Bank eRecruitment").Id,
                ApplicationStatusId = GetStatus("Written Exam").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            },
            new()
            {
                UserId = demoUser.Id,
                CompanyId = GetCompany("Google").Id,
                Role = "Senior Backend Engineer",
                JobUrl = "https://careers.google.com/jobs/results/123456",
                Location = "Mountain View, CA (Remote)",
                SalaryRange = "$170,000 - $210,000",
                Notes = "## Google Interview Notes\n- Recruiter reached out on LinkedIn\n- Passed initial technical screening round (Focus: Distributed Systems & Concurrency)\n- Next Round: Virtual Onsite Interview (3 Coding + 1 System Design + 1 Googliness)",
                AppliedAt = DateTime.UtcNow.AddDays(-10),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Interview").Id,
                WorkTypeId = GetWorkType("Remote").Id
            },
            new()
            {
                UserId = demoUser.Id,
                CompanyId = GetCompany("Sonali Bank PLC").Id,
                Role = "Senior Officer (IT)",
                JobUrl = "https://erecruiter.bb.org.bd",
                Location = "Dhaka, Bangladesh",
                SalaryRange = "Grade-8 (23,000 - 55,470 BDT)",
                Notes = "Passed both MCQ & Written Exams. Viva Voce Board scheduled next week at Bankers Selection Committee Secretariat.",
                AppliedAt = DateTime.UtcNow.AddDays(-25),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Bank (Govt/Private)").Id,
                SourcePlatformId = GetPlatform("Bangladesh Bank eRecruitment").Id,
                ApplicationStatusId = GetStatus("Viva Voce").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            },
            new()
            {
                UserId = demoUser.Id,
                CompanyId = GetCompany("Brain Station 23").Id,
                Role = "Lead .NET & Cloud Architect",
                JobUrl = "https://brainstation-23.com/careers/lead-architect",
                Location = "Mohakhali DOHS, Dhaka",
                SalaryRange = "220,000 - 280,000 BDT/month",
                Notes = "Final negotiation completed. Received official offer letter with stock options.",
                AppliedAt = DateTime.UtcNow.AddDays(-18),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Bdjobs").Id,
                ApplicationStatusId = GetStatus("Offer").Id,
                WorkTypeId = GetWorkType("Hybrid").Id
            },
            new()
            {
                UserId = demoUser.Id,
                CompanyId = GetCompany("Microsoft").Id,
                Role = "Staff Software Engineer",
                JobUrl = "https://careers.microsoft.com/us/en/job/987654",
                Location = "Redmond, WA (Hybrid)",
                SalaryRange = "$180,000 - $220,000",
                Notes = "Rejected after System Design round on distributed consensus and high-availability partitioning.",
                AppliedAt = DateTime.UtcNow.AddDays(-30),
                PriorityId = GetPriority("High").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("Company Website").Id,
                ApplicationStatusId = GetStatus("Rejected").Id,
                WorkTypeId = GetWorkType("Hybrid").Id
            },
            new()
            {
                UserId = demoUser.Id,
                CompanyId = GetCompany("BPSC (Public Service)").Id,
                Role = "Assistant Network Engineer (Govt)",
                JobUrl = "http://bpsc.teletalk.com.bd",
                Location = "Agargaon, Dhaka",
                SalaryRange = "Grade-9 (22,000 - 53,060 BDT)",
                Notes = "Failed in preliminary MCQ test due to negative marking on analytical math shortcuts.",
                AppliedAt = DateTime.UtcNow.AddDays(-35),
                PriorityId = GetPriority("Medium").Id,
                JobTypeId = GetJobType("Govt / Cadre Service").Id,
                SourcePlatformId = GetPlatform("BPSC (bpsc.gov.bd)").Id,
                ApplicationStatusId = GetStatus("Rejected").Id,
                WorkTypeId = GetWorkType("Onsite").Id
            }
        };

        await context.JobApplications.AddRangeAsync(applications);
        await context.SaveChangesAsync();
    }

    private static async Task SeedRejectionRetrospectives(AppDbContext context)
    {
        var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (demoUser is null) return;

        if (await context.RejectionRetrospectives.AnyAsync(r => r.UserId == demoUser.Id))
        {
            return;
        }

        var rejectedApps = await context.JobApplications
            .Include(j => j.Company)
            .Include(j => j.ApplicationStatus)
            .Where(j => j.UserId == demoUser.Id && j.ApplicationStatus.Name == "Rejected")
            .ToListAsync();

        var retrospectives = new List<RejectionRetrospective>();

        foreach (var app in rejectedApps)
        {
            if (app.Company.Name.Contains("Microsoft", StringComparison.OrdinalIgnoreCase))
            {
                retrospectives.Add(new RejectionRetrospective
                {
                    Id = Guid.NewGuid(),
                    JobApplicationId = app.Id,
                    UserId = demoUser.Id,
                    JobDomain = "Corporate",
                    FailedStage = "System Design Round",
                    PrimaryRootCause = "Technical Depth & Core Concepts",
                    PreparationTime = "1-3 months",
                    MockCount = "1-3 mocks",
                    DifficultyRating = 4,
                    TimePressureRating = 3,
                    ConfidenceRating = 6,
                    FeedbackStatus = "Yes detailed feedback",
                    SpecificWeaknessTagsJson = JsonSerializer.Serialize(new List<string> { "System Design", "Scalability", "Distributed Locking" }),
                    SurveyDataJson = JsonSerializer.Serialize(new
                    {
                        TechnicalTopicGaps = new List<string> { "System Design - Scalability & Partitioning", "Microservices & Distributed Transactions", "Database Query Optimization & Indexing" },
                        BehavioralFactors = new List<string> { "Weak Explanation of Past Projects" },
                        ExternalBlockers = new List<string> { "High Competition / Extreme Cutoff" },
                        StudyMaterialsUsed = new List<string> { "Alex Xu System Design", "LeetCode / NeetCode" }
                    }),
                    WhatWentWell = "Cleared coding and behavioral rounds smoothly with strong praise on clean code.",
                    WhatFailed = "Struggled with deep dive into multi-region database failover and consensus algorithms under high write loads.",
                    ActionablePlan = "Read Alex Xu System Design Vol 2. Practice diagramming rate limiters and Redis caching layers.",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-20)
                });
            }
            else if (app.Company.Name.Contains("BPSC", StringComparison.OrdinalIgnoreCase) || app.Role.Contains("Network", StringComparison.OrdinalIgnoreCase))
            {
                retrospectives.Add(new RejectionRetrospective
                {
                    Id = Guid.NewGuid(),
                    JobApplicationId = app.Id,
                    UserId = demoUser.Id,
                    JobDomain = "Govt & Bank",
                    FailedStage = "MCQ / Preliminary Test",
                    PrimaryRootCause = "Exam Speed & Time Management",
                    PreparationTime = "3-6 months",
                    MockCount = "4-10 mocks",
                    DifficultyRating = 4,
                    TimePressureRating = 5,
                    ConfidenceRating = 5,
                    EstimatedScore = 64.5,
                    ExpectedCutoffScore = 72.0,
                    NegativeMarksLost = 6.0,
                    FeedbackStatus = "Score published on website",
                    SpecificWeaknessTagsJson = JsonSerializer.Serialize(new List<string> { "MCQ Speed Drill", "Math Shortcuts", "Negative Marking" }),
                    SurveyDataJson = JsonSerializer.Serialize(new
                    {
                        TechnicalTopicGaps = new List<string> { "Analytical Math & Shortcuts", "Computer Networks & Subnetting" },
                        BehavioralFactors = new List<string> { "Nervousness / Hesitation" },
                        ExternalBlockers = new List<string> { "Exam Hall Rush / Traffic" },
                        StudyMaterialsUsed = new List<string> { "Previous Year Questions", "Online Mock Test Platform" }
                    }),
                    WhatWentWell = "Scored 100% on English and General Knowledge sections.",
                    WhatFailed = "Spent 8 minutes stuck on 3 analytical geometry problems and lost marks to negative penalty.",
                    ActionablePlan = "Practice 100-question timed mocks with a strict 45-second cap per question. Never guess blindly on negative mark exams.",
                    CreatedAt = DateTime.UtcNow.AddDays(-28),
                    UpdatedAt = DateTime.UtcNow.AddDays(-28)
                });
            }
        }

        if (retrospectives.Any())
        {
            await context.RejectionRetrospectives.AddRangeAsync(retrospectives);
            await context.SaveChangesAsync();
        }
    }
}
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
        await SeedUsers(context);
        await SeedJobRoles(context);
        await SeedCompanies(context);
        await SeedJobApplications(context);
        await SeedRejectionRetrospectives(context);
    }

    private static async Task SeedJobRoles(AppDbContext context)
    {
        var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (demoUser is null) return;

        // Reassign any legacy unassigned roles to demoUser so they are isolated from regular users
        var orphanedRoles = await context.JobRoles.Where(r => r.UserId == null).ToListAsync();
        foreach (var r in orphanedRoles)
        {
            r.UserId = demoUser.Id;
        }
        if (orphanedRoles.Any())
        {
            await context.SaveChangesAsync();
        }

        var existingRoles = await context.JobRoles
            .Where(r => r.UserId == demoUser.Id)
            .Select(r => r.Name)
            .ToListAsync();

        var rolesToSeed = new List<JobRole>
        {
            new() { Name = "Senior Frontend Developer", UserId = demoUser.Id },
            new() { Name = "Backend Engineer (.NET / Go)", UserId = demoUser.Id },
            new() { Name = "Fullstack Engineer (React & Node)", UserId = demoUser.Id },
            new() { Name = "Assistant Programmer / IT Officer (Govt)", UserId = demoUser.Id },
            new() { Name = "Senior Officer (IT) - Govt Bank", UserId = demoUser.Id },
            new() { Name = "DevOps & Cloud Engineer", UserId = demoUser.Id },
            new() { Name = "AI / ML Engineer", UserId = demoUser.Id }
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
            new() { Name = "Facebook" },
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
        var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (demoUser is null) return;

        // Reassign any legacy unassigned companies to demoUser so they are isolated from regular users
        var orphanedCompanies = await context.Companies.Where(c => c.UserId == null).ToListAsync();
        foreach (var c in orphanedCompanies)
        {
            c.UserId = demoUser.Id;
        }
        if (orphanedCompanies.Any())
        {
            await context.SaveChangesAsync();
        }

        var existingCompanyNames = await context.Companies
            .Where(c => c.UserId == demoUser.Id)
            .Select(c => c.Name)
            .ToListAsync();

        var companiesToSeed = new List<Company>
        {
            new() { Name = "Google", CareerPageUrl = "https://careers.google.com", WebsiteUrl = "https://google.com", Location = "Mountain View, CA (Remote)", UserId = demoUser.Id },
            new() { Name = "Microsoft", CareerPageUrl = "https://careers.microsoft.com", WebsiteUrl = "https://microsoft.com", Location = "Redmond, WA (Hybrid)", UserId = demoUser.Id },
            new() { Name = "Bangladesh Bank", CareerPageUrl = "https://erecruiter.bb.org.bd", WebsiteUrl = "https://bb.org.bd", Location = "Motijheel, Dhaka", UserId = demoUser.Id },
            new() { Name = "BPDB (Power Board)", CareerPageUrl = "http://bpdb.teletalk.com.bd", WebsiteUrl = "http://bpdb.gov.bd", Location = "Dhaka, Bangladesh", UserId = demoUser.Id },
            new() { Name = "BPSC (Public Service)", CareerPageUrl = "http://bpsc.teletalk.com.bd", WebsiteUrl = "http://bpsc.gov.bd", Location = "Agargaon, Dhaka", UserId = demoUser.Id },
            new() { Name = "Vercel", CareerPageUrl = "https://vercel.com/careers", WebsiteUrl = "https://vercel.com", Location = "San Francisco, CA (Remote)", UserId = demoUser.Id },
            new() { Name = "Stripe", CareerPageUrl = "https://stripe.com/jobs", WebsiteUrl = "https://stripe.com", Location = "San Francisco, CA (Hybrid)", UserId = demoUser.Id }
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

            // Ensure Admin User Profile has NO dummy bio data
            var adminProfile = await context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == adminUser.Id);
            if (adminProfile is null)
            {
                adminProfile = new UserProfile
                {
                    UserId = adminUser.Id,
                    NameEnglish = adminUser.Name,
                    Email = normalizedEmail,
                    BioSummary = string.Empty,
                    EducationDetailsJson = "[]",
                    CodingProfilesJson = "[]"
                };
                await context.UserProfiles.AddAsync(adminProfile);
                await context.SaveChangesAsync();
            }
            else if (adminProfile.BioSummary?.Contains("Full Stack Engineer & Career Aspirant") == true)
            {
                adminProfile.BioSummary = string.Empty;
                adminProfile.EducationDetailsJson = "[]";
                adminProfile.CodingProfilesJson = "[]";
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

        // Clean any seeded dummy profile data from non-demo users
        var nonDemoProfiles = await context.UserProfiles
            .Where(p => p.UserId != demoUser.Id)
            .ToListAsync();

        foreach (var p in nonDemoProfiles)
        {
            if (p.BioSummary != null && (
                p.BioSummary.Contains("Full Stack Engineer") ||
                p.BioSummary.Contains("Career Aspirant") ||
                p.BioSummary.Contains("Aspirant") ||
                p.EducationDetailsJson?.Contains("University of Dhaka / BUET") == true
            ))
            {
                p.BioSummary = string.Empty;
                p.EducationDetailsJson = "[]";
                p.CodingProfilesJson = "[]";
                p.PresentDivision = null;
                p.PresentDistrict = null;
                p.PresentArea = null;
                p.PresentLocation = null;
                p.PresentHouse = null;
                p.PresentUpazila = null;
                p.PresentPoliceStation = null;
                p.PresentPostOffice = null;
                p.PresentPostCode = null;
                p.PermanentDivision = null;
                p.PermanentDistrict = null;
                p.PermanentUpazila = null;
                p.PermanentUnion = null;
                p.PermanentVillage = null;
                p.PermanentPostOffice = null;
                p.PermanentPoliceStation = null;
                p.PermanentPostCode = null;
                p.Nationality = null;
                p.Religion = null;
                p.Gender = null;
                p.MaritalStatus = null;
            }
        }
        if (nonDemoProfiles.Any())
        {
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedJobApplications(AppDbContext context)
    {
        var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "demo@jobtracker.dev");
        if (demoUser is null) return;

        // 1. Purge all dummy applications, rounds, and retrospectives from any non-demo users
        var dummyRoles = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "Assistant Programmer (Govt)",
            "Senior Backend Engineer",
            "Senior Officer (IT)",
            "Lead .NET & Cloud Architect",
            "Staff Software Engineer",
            "Lead Cloud Architect & Staff Engineer"
        };

        var nonDemoDummyApps = await context.JobApplications
            .Where(j => j.UserId != demoUser.Id && dummyRoles.Contains(j.Role))
            .ToListAsync();

        if (nonDemoDummyApps.Any())
        {
            var appIds = nonDemoDummyApps.Select(a => a.Id).ToList();
            var retros = await context.RejectionRetrospectives.Where(r => appIds.Contains(r.JobApplicationId) || r.UserId != demoUser.Id).ToListAsync();
            var rounds = await context.InterviewRounds.Where(ir => appIds.Contains(ir.JobApplicationId)).ToListAsync();

            context.RejectionRetrospectives.RemoveRange(retros);
            context.InterviewRounds.RemoveRange(rounds);
            context.JobApplications.RemoveRange(nonDemoDummyApps);
            await context.SaveChangesAsync();
        }

        var existingApps = await context.JobApplications.Where(j => j.UserId == demoUser.Id).ToListAsync();
        if (existingApps.Count >= 6) return;

        if (existingApps.Any())
        {
            context.JobApplications.RemoveRange(existingApps);
            await context.SaveChangesAsync();
        }

        var companies = await context.Companies.Where(c => c.UserId == demoUser.Id).ToListAsync();
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
                JobUrl = "https://careers.microsoft.com",
                Location = "Redmond, WA (Hybrid)",
                SalaryRange = "$180,000 - $220,000",
                Notes = "Completed System Design and Algorithms on-site loops.",
                AppliedAt = DateTime.UtcNow.AddDays(-30),
                PriorityId = GetPriority("Medium").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Rejected").Id,
                WorkTypeId = GetWorkType("Hybrid").Id
            },
            new()
            {
                UserId = demoUser.Id,
                CompanyId = GetCompany("bKash Limited").Id,
                Role = "Lead Cloud Architect & Staff Engineer",
                JobUrl = "https://www.bkash.com/career",
                Location = "Dhaka, Bangladesh",
                SalaryRange = "250,000 - 320,000 BDT/month",
                Notes = "Exploratory bookmark for fintech microservices architecture.",
                AppliedAt = DateTime.UtcNow.AddDays(-2),
                PriorityId = GetPriority("Low").Id,
                JobTypeId = GetJobType("Full Time").Id,
                SourcePlatformId = GetPlatform("LinkedIn").Id,
                ApplicationStatusId = GetStatus("Saved").Id,
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

        // Clean any retrospectives not belonging to demoUser if created from dummy data
        var nonDemoRetros = await context.RejectionRetrospectives
            .Where(r => r.UserId != demoUser.Id && (r.JobDomain == "Corporate" || r.JobDomain == "Govt & Bank") && (
                r.FailedStage == "System Design Round" || r.FailedStage == "MCQ / Preliminary Test"
            ))
            .ToListAsync();

        if (nonDemoRetros.Any())
        {
            context.RejectionRetrospectives.RemoveRange(nonDemoRetros);
            await context.SaveChangesAsync();
        }

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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.AiAdvisor;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JobTracker.API.Services;

public class AiAdvisorService : IAiAdvisorService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AiAdvisorService> _logger;
    private readonly HttpClient _httpClient;

    public AiAdvisorService(
        AppDbContext context,
        ICurrentUserService currentUser,
        IConfiguration configuration,
        ILogger<AiAdvisorService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _currentUser = currentUser;
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _httpClient.Timeout = TimeSpan.FromSeconds(45);
    }

    public async Task<AiCareerInsightDto> GetCareerAdvisorInsightsAsync(bool forceRefresh = false, CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;
        if (!userId.HasValue)
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }

        // Fetch User's Applications and Retrospectives
        var applications = await _context.JobApplications
            .AsNoTracking()
            .Include(j => j.Company)
            .Include(j => j.ApplicationStatus)
            .Include(j => j.JobType)
            .Include(j => j.SourcePlatform)
            .Include(j => j.Priority)
            .Include(j => j.WorkType)
            .Where(j => j.UserId == userId.Value)
            .OrderByDescending(j => j.AppliedAt)
            .ToListAsync();

        var retrospectives = await _context.RejectionRetrospectives
            .AsNoTracking()
            .Include(r => r.JobApplication!)
                .ThenInclude(j => j.Company)
            .Where(r => r.UserId == userId.Value)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var userProfile = await _context.UserProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId.Value);

        // If user has 0 applications and 0 retrospectives, return starter guidance
        if (!applications.Any() && !retrospectives.Any())
        {
            return new AiCareerInsightDto
            {
                ExecutiveSummary = "Your Career Operations workspace is initialized and ready. Record your initial job circulars, corporate applications, and exam dates to activate AI-driven pipeline intelligence.",
                GovtVsCorporateStrategy = "Track target government cadre/bank examinations alongside corporate tech roles to dynamically benchmark your preparation and application velocity.",
                KeyStrengths = new List<string>
                {
                    "Workspace initialized with active multi-track tracking",
                    "Ready to record structured circular notices and job posts"
                },
                CriticalGaps = new List<string>
                {
                    "No active applications submitted in current pipeline",
                    "No exam or interview rounds logged"
                },
                ActionPlan = new List<AiActionItemDto>
                {
                    new()
                    {
                        Title = "Add 3-5 Target Opportunities",
                        Description = "Input your active corporate jobs or government recruitment circulars on the Applications page.",
                        Priority = "High",
                        Category = "Pipeline"
                    },
                    new()
                    {
                        Title = "Organize Target Companies & Roles",
                        Description = "Add key target organizations and dream job titles to customize tracking filters.",
                        Priority = "Medium",
                        Category = "Preparation"
                    }
                },
                IsCached = true,
                GeneratedAt = DateTime.UtcNow,
                TotalApplicationsAnalyzed = 0
            };
        }

        // Compute SHA-256 data hash of user's current data state
        var dataSignature = ComputeDataSignature(applications, retrospectives, userProfile);

        // Daily Refresh Policy: If not forcing refresh, check if we already have an analysis generated today
        if (!forceRefresh)
        {
            var cached = await _context.UserAiInsights
                .FirstOrDefaultAsync(i => i.UserId == userId.Value);

            if (cached != null)
            {
                var lastGenerated = cached.UpdatedAt;
                var isGeneratedToday = lastGenerated.Date == DateTime.UtcNow.Date;

                if (isGeneratedToday)
                {
                    _logger.LogInformation("Returning daily cached AI Career Insights for user {UserId} (Generated at: {Date})", userId, lastGenerated);
                    return MapFromEntity(cached, isCached: true);
                }
            }
        }

        // Generate fresh daily analysis via Gemini API
        _logger.LogInformation("Generating fresh daily AI Career Advisor analysis for user {UserId}", userId);
        var newInsight = await GenerateGeminiAnalysisAsync(applications, retrospectives, userProfile, dataSignature);

        // Upsert into Database Cache
        var existingInsight = await _context.UserAiInsights
            .FirstOrDefaultAsync(i => i.UserId == userId.Value);

        if (existingInsight != null)
        {
            existingInsight.DataHash = dataSignature;
            existingInsight.ExecutiveSummary = newInsight.ExecutiveSummary;
            existingInsight.GovtVsCorporateStrategy = newInsight.GovtVsCorporateStrategy;
            existingInsight.KeyStrengthsJson = JsonSerializer.Serialize(newInsight.KeyStrengths);
            existingInsight.CriticalGapsJson = JsonSerializer.Serialize(newInsight.CriticalGaps);
            existingInsight.ActionPlanJson = JsonSerializer.Serialize(newInsight.ActionPlan);
            existingInsight.TotalApplicationsAnalyzed = applications.Count;
            existingInsight.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var entity = new UserAiInsight
            {
                UserId = userId.Value,
                DataHash = dataSignature,
                ExecutiveSummary = newInsight.ExecutiveSummary,
                GovtVsCorporateStrategy = newInsight.GovtVsCorporateStrategy,
                KeyStrengthsJson = JsonSerializer.Serialize(newInsight.KeyStrengths),
                CriticalGapsJson = JsonSerializer.Serialize(newInsight.CriticalGaps),
                ActionPlanJson = JsonSerializer.Serialize(newInsight.ActionPlan),
                TotalApplicationsAnalyzed = applications.Count
            };
            _context.UserAiInsights.Add(entity);
        }

        await _context.SaveChangesAsync();
        newInsight.IsCached = false;
        newInsight.TotalApplicationsAnalyzed = applications.Count;
        return newInsight;
    }

    private string ComputeDataSignature(
        List<JobApplication> apps,
        List<RejectionRetrospective> retros,
        UserProfile? profile)
    {
        var sb = new StringBuilder();
        sb.Append($"Apps:{apps.Count}|");
        foreach (var a in apps.OrderBy(x => x.Id))
        {
            sb.Append($"{a.Id}:{a.ApplicationStatus?.Name}:{a.Priority?.Name}:{a.Company?.Name}:{a.Role}:{a.UpdatedAt:O};");
        }

        sb.Append($"|Retros:{retros.Count}|");
        foreach (var r in retros.OrderBy(x => x.Id))
        {
            sb.Append($"{r.Id}:{r.FailedStage}:{r.PrimaryRootCause}:{r.UpdatedAt:O};");
        }

        if (profile != null)
        {
            sb.Append($"|Profile:{profile.UpdatedAt:O}");
        }

        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(sb.ToString()));
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private async Task<AiCareerInsightDto> GenerateGeminiAnalysisAsync(
        List<JobApplication> applications,
        List<RejectionRetrospective> retrospectives,
        UserProfile? profile,
        string dataHash)
    {
        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY")
            ?? _configuration["Gemini:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY is not configured in environment or appsettings");
            return GenerateFallbackAnalysis(applications, retrospectives);
        }

        var candidateDataSummary = new
        {
            TotalApplications = applications.Count,
            StatusCounts = applications.GroupBy(a => a.ApplicationStatus?.Name ?? "Unknown").ToDictionary(g => g.Key, g => g.Count()),
            PriorityCounts = applications.GroupBy(a => a.Priority?.Name ?? "Medium").ToDictionary(g => g.Key, g => g.Count()),
            RecentApplications = applications.Take(12).Select(a => new
            {
                a.Role,
                Company = a.Company?.Name,
                Status = a.ApplicationStatus?.Name,
                JobType = a.JobType?.Name,
                Platform = a.SourcePlatform?.Name,
                Priority = a.Priority?.Name,
                AppliedDate = a.AppliedAt.ToString("yyyy-MM-dd"),
                Notes = a.Notes
            }),
            FailureRetrospectives = retrospectives.Take(8).Select(r => new
            {
                Company = r.JobApplication?.Company?.Name,
                Role = r.JobApplication?.Role,
                r.JobDomain,
                r.FailedStage,
                r.PrimaryRootCause,
                r.DifficultyRating,
                r.TimePressureRating,
                r.ConfidenceRating,
                r.WhatWentWell,
                r.WhatFailed,
                r.ActionablePlan
            }),
            Profile = profile != null ? new
            {
                profile.NameEnglish,
                profile.BioSummary,
                profile.PresentDivision
            } : null
        };

        var prompt = $@"
You are a Principal Career Operations Strategist and Tech/Govt Career Advisor. Analyze the candidate's current recruitment pipeline and failure post-mortems data:

```json
{JsonSerializer.Serialize(candidateDataSummary, new JsonSerializerOptions { WriteIndented = true })}
```

Provide a high-impact, strategic diagnostic assessment. Respond ONLY with valid JSON strictly adhering to this structure:
{{
  ""executiveSummary"": ""A concise 2-3 sentence strategic executive summary of their recruitment momentum, health, and trajectory."",
  ""govtVsCorporateStrategy"": ""Tailored guidance comparing Govt/Bank recruitment exams vs Corporate Tech roles based on their pipeline."",
  ""keyStrengths"": [""Strength 1 with specific observation"", ""Strength 2 with specific observation""],
  ""criticalGaps"": [""Critical gap/bottleneck 1 (e.g. MCQ speed, interview conversion, cadence)"", ""Critical gap 2""],
  ""actionPlan"": [
    {{
      ""title"": ""Concrete Action 1"",
      ""description"": ""Detailed step-by-step guidance"",
      ""priority"": ""High"",
      ""category"": ""Technical""
    }},
    {{
      ""title"": ""Concrete Action 2"",
      ""description"": ""Detailed step-by-step guidance"",
      ""priority"": ""High"",
      ""category"": ""Exam Speed / Mocks""
    }},
    {{
      ""title"": ""Concrete Action 3"",
      ""description"": ""Detailed step-by-step guidance"",
      ""priority"": ""Medium"",
      ""category"": ""Pipeline Cadence""
    }}
  ]
}}";

        var modelsToTry = new[] { "gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest" };
        foreach (var modelName in modelsToTry)
        {
            try
            {
                var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}";
                var payload = new
                {
                    contents = new[]
                    {
                        new { parts = new[] { new { text = prompt } } }
                    },
                    generationConfig = new
                    {
                        responseMimeType = "application/json",
                        temperature = 0.3
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(requestUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var parsedDoc = JsonDocument.Parse(responseJson);
                    var candidates = parsedDoc.RootElement.GetProperty("candidates");
                    if (candidates.GetArrayLength() > 0)
                    {
                        var textPart = candidates[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
                        if (!string.IsNullOrWhiteSpace(textPart))
                        {
                            var dto = JsonSerializer.Deserialize<AiCareerInsightDto>(textPart, new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });

                            if (dto != null && !string.IsNullOrWhiteSpace(dto.ExecutiveSummary))
                            {
                                dto.GeneratedAt = DateTime.UtcNow;
                                dto.TotalApplicationsAnalyzed = applications.Count;
                                return dto;
                            }
                        }
                    }
                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Gemini model {Model} failed with {Status}: {Body}", modelName, response.StatusCode, errorBody);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing Gemini API call on model {Model}", modelName);
            }
        }

        return GenerateFallbackAnalysis(applications, retrospectives);
    }

    private AiCareerInsightDto GenerateFallbackAnalysis(
        List<JobApplication> applications,
        List<RejectionRetrospective> retrospectives)
    {
        var total = applications.Count;
        var offers = applications.Count(a => a.ApplicationStatus?.Name?.Equals("Offer", StringComparison.OrdinalIgnoreCase) == true);
        var interviews = applications.Count(a => a.ApplicationStatus?.Name?.Contains("Interview", StringComparison.OrdinalIgnoreCase) == true);
        var govtApps = applications.Count(a => a.JobType?.Name?.Contains("Govt", StringComparison.OrdinalIgnoreCase) == true || a.SourcePlatform?.Name?.Contains("Teletalk", StringComparison.OrdinalIgnoreCase) == true);

        return new AiCareerInsightDto
        {
            ExecutiveSummary = $"You are actively managing {total} recruitment applications with {interviews} interview/exam stage(s) and {offers} job offer(s). Keep optimizing application submission cadence to maintain strong interview funnel conversion.",
            GovtVsCorporateStrategy = govtApps > 0
                ? "Your pipeline features both Bangladesh Govt/Bank recruitment exams and Corporate opportunities. Maintain timed MCQ drills alongside modern fullstack architectural practice."
                : "Your pipeline is currently concentrated on Corporate roles. Emphasize System Design and distributed architecture deep dives to maximize onsite interview pass rates.",
            KeyStrengths = new List<string>
            {
                $"Active pipeline tracking with {total} opportunity notices logged",
                "Structured prioritization across targeted corporate entities and institutions"
            },
            CriticalGaps = new List<string>
            {
                retrospectives.Any()
                    ? $"Analyzed {retrospectives.Count} post-mortem(s) identifying specific preparation and mock test gaps"
                    : "No post-mortems logged yet; ensure failure surveys are recorded to unblock exam bottlenecks",
                "Maintain consistent follow-ups for applications pending over 14 days"
            },
            ActionPlan = new List<AiActionItemDto>
            {
                new()
                {
                    Title = "Weekly Application Target",
                    Description = "Submit 3-5 high-priority applications weekly to ensure continuous funnel momentum.",
                    Priority = "High",
                    Category = "Pipeline Cadence"
                },
                new()
                {
                    Title = "Focused Technical / MCQ Drills",
                    Description = "Dedicate 45 minutes daily to your primary weakness topics identified in retrospectives.",
                    Priority = "High",
                    Category = "Technical"
                },
                new()
                {
                    Title = "Follow-up Cadence",
                    Description = "Send polite professional follow-ups on applications submitted over 10 business days ago.",
                    Priority = "Medium",
                    Category = "Networking"
                }
            },
            IsCached = false,
            GeneratedAt = DateTime.UtcNow,
            TotalApplicationsAnalyzed = total
        };
    }

    private AiCareerInsightDto MapFromEntity(UserAiInsight entity, bool isCached)
    {
        return new AiCareerInsightDto
        {
            ExecutiveSummary = entity.ExecutiveSummary,
            GovtVsCorporateStrategy = entity.GovtVsCorporateStrategy,
            KeyStrengths = JsonSerializer.Deserialize<List<string>>(entity.KeyStrengthsJson) ?? new(),
            CriticalGaps = JsonSerializer.Deserialize<List<string>>(entity.CriticalGapsJson) ?? new(),
            ActionPlan = JsonSerializer.Deserialize<List<AiActionItemDto>>(entity.ActionPlanJson) ?? new(),
            IsCached = isCached,
            GeneratedAt = entity.UpdatedAt,
            TotalApplicationsAnalyzed = entity.TotalApplicationsAnalyzed
        };
    }
}

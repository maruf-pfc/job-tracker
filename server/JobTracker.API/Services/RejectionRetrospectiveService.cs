using System.Text.Json;
using JobTracker.API.Configs;
using JobTracker.API.DTOs.Rejection;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class RejectionRetrospectiveService : IRejectionRetrospectiveService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RejectionRetrospectiveService(AppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    private Task<Guid> GetEffectiveUserIdAsync()
    {
        var userId = _currentUserService.UserId;
        if (userId.HasValue && userId.Value != Guid.Empty)
        {
            return Task.FromResult(userId.Value);
        }

        throw new UnauthorizedAccessException("User not authenticated.");
    }

    private class SurveyExtraData
    {
        public List<string> TechnicalTopicGaps { get; set; } = new();
        public List<string> BehavioralFactors { get; set; } = new();
        public List<string> ExternalBlockers { get; set; } = new();
        public List<string> StudyMaterialsUsed { get; set; } = new();
    }

    public async Task<RejectionRetrospectiveResponseDto> UpsertRetrospectiveAsync(
        Guid applicationId,
        CreateRejectionRetrospectiveDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = await GetEffectiveUserIdAsync();

        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j => j.Id == applicationId && j.UserId == userId);

        if (application == null)
        {
            throw new KeyNotFoundException("Job application not found.");
        }

        var existing = await _context.RejectionRetrospectives
            .FirstOrDefaultAsync(r => r.JobApplicationId == applicationId && r.UserId == userId);

        var tagsJson = JsonSerializer.Serialize(dto.SpecificWeaknessTags ?? new List<string>());
        var extraData = new SurveyExtraData
        {
            TechnicalTopicGaps = dto.TechnicalTopicGaps ?? new List<string>(),
            BehavioralFactors = dto.BehavioralFactors ?? new List<string>(),
            ExternalBlockers = dto.ExternalBlockers ?? new List<string>(),
            StudyMaterialsUsed = dto.StudyMaterialsUsed ?? new List<string>()
        };
        var surveyJson = JsonSerializer.Serialize(extraData);

        if (existing != null)
        {
            existing.JobDomain = dto.JobDomain;
            existing.FailedStage = dto.FailedStage;
            existing.PrimaryRootCause = dto.PrimaryRootCause;
            existing.SpecificWeaknessTagsJson = tagsJson;
            existing.SurveyDataJson = surveyJson;
            existing.PreparationTime = dto.PreparationTime;
            existing.MockCount = dto.MockCount;
            existing.DifficultyRating = dto.DifficultyRating;
            existing.TimePressureRating = dto.TimePressureRating;
            existing.ConfidenceRating = dto.ConfidenceRating;
            existing.EstimatedScore = dto.EstimatedScore;
            existing.ExpectedCutoffScore = dto.ExpectedCutoffScore;
            existing.NegativeMarksLost = dto.NegativeMarksLost;
            existing.FeedbackStatus = dto.FeedbackStatus;
            existing.WhatWentWell = dto.WhatWentWell;
            existing.WhatFailed = dto.WhatFailed;
            existing.ActionablePlan = dto.ActionablePlan;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponse(existing, dto.SpecificWeaknessTags ?? new List<string>(), extraData);
        }

        var entity = new RejectionRetrospective
        {
            Id = Guid.NewGuid(),
            JobApplicationId = applicationId,
            UserId = userId,
            JobDomain = dto.JobDomain,
            FailedStage = dto.FailedStage,
            PrimaryRootCause = dto.PrimaryRootCause,
            SpecificWeaknessTagsJson = tagsJson,
            SurveyDataJson = surveyJson,
            PreparationTime = dto.PreparationTime,
            MockCount = dto.MockCount,
            DifficultyRating = dto.DifficultyRating,
            TimePressureRating = dto.TimePressureRating,
            ConfidenceRating = dto.ConfidenceRating,
            EstimatedScore = dto.EstimatedScore,
            ExpectedCutoffScore = dto.ExpectedCutoffScore,
            NegativeMarksLost = dto.NegativeMarksLost,
            FeedbackStatus = dto.FeedbackStatus,
            WhatWentWell = dto.WhatWentWell,
            WhatFailed = dto.WhatFailed,
            ActionablePlan = dto.ActionablePlan,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.RejectionRetrospectives.AddAsync(entity);
        await _context.SaveChangesAsync();

        return MapToResponse(entity, dto.SpecificWeaknessTags ?? new List<string>(), extraData);
    }

    public async Task<RejectionRetrospectiveResponseDto?> GetByApplicationIdAsync(Guid applicationId, CancellationToken cancellationToken = default)
    {
        var userId = await GetEffectiveUserIdAsync();

        var entity = await _context.RejectionRetrospectives
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.JobApplicationId == applicationId && r.UserId == userId, cancellationToken);

        if (entity == null) return null;

        var tags = DeserializeTags(entity.SpecificWeaknessTagsJson);
        var extra = DeserializeExtra(entity.SurveyDataJson);
        return MapToResponse(entity, tags, extra);
    }

    public async Task<FailureAnalyticsDto> GetFailureAnalyticsAsync(CancellationToken cancellationToken = default)
    {
        var userId = await GetEffectiveUserIdAsync();

        var retrospectives = await _context.RejectionRetrospectives
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .ToListAsync(cancellationToken);

        var total = retrospectives.Count;
        if (total == 0)
        {
            return new FailureAnalyticsDto();
        }

        var corporateCount = retrospectives.Count(r => string.Equals(r.JobDomain, "Corporate", StringComparison.OrdinalIgnoreCase));
        var govtCount = retrospectives.Count(r => string.Equals(r.JobDomain, "Govt & Bank", StringComparison.OrdinalIgnoreCase) || string.Equals(r.JobDomain, "Govt", StringComparison.OrdinalIgnoreCase));

        var avgDifficulty = Math.Round(retrospectives.Average(r => r.DifficultyRating), 1);
        var avgTimePressure = Math.Round(retrospectives.Average(r => r.TimePressureRating), 1);
        var avgConfidence = Math.Round(retrospectives.Average(r => r.ConfidenceRating), 1);

        var scorePairs = retrospectives
            .Where(r => r.EstimatedScore.HasValue && r.ExpectedCutoffScore.HasValue)
            .Select(r => r.ExpectedCutoffScore!.Value - r.EstimatedScore!.Value)
            .ToList();
        var avgDeficit = scorePairs.Any() ? Math.Round(scorePairs.Average(), 1) : 0.0;

        // Stage breakdown
        var stageBreakdown = retrospectives
            .GroupBy(r => r.FailedStage)
            .Select(g => new StageFailureCountDto
            {
                Stage = g.Key,
                Count = g.Count(),
                Percentage = Math.Round((double)g.Count() / total * 100, 1)
            })
            .OrderByDescending(s => s.Count)
            .ToList();

        // Root cause breakdown
        var rootCauseBreakdown = retrospectives
            .GroupBy(r => r.PrimaryRootCause)
            .Select(g => new RootCauseCountDto
            {
                Cause = g.Key,
                Count = g.Count(),
                Percentage = Math.Round((double)g.Count() / total * 100, 1)
            })
            .OrderByDescending(r => r.Count)
            .ToList();

        // Topic gaps aggregation
        var allTopicGaps = new List<string>();
        var allExternalBlockers = new List<string>();

        foreach (var r in retrospectives)
        {
            var extra = DeserializeExtra(r.SurveyDataJson);
            allTopicGaps.AddRange(extra.TechnicalTopicGaps);
            allTopicGaps.AddRange(extra.BehavioralFactors);
            allTopicGaps.AddRange(DeserializeTags(r.SpecificWeaknessTagsJson));
            allExternalBlockers.AddRange(extra.ExternalBlockers);
        }

        var topTopicGaps = allTopicGaps
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .GroupBy(t => t)
            .Select(g => new TopicGapCountDto
            {
                Topic = g.Key,
                Count = g.Count(),
                Category = "Technical / Domain Gap"
            })
            .OrderByDescending(t => t.Count)
            .Take(12)
            .ToList();

        var topExternalBlockers = allExternalBlockers
            .Where(b => !string.IsNullOrWhiteSpace(b))
            .GroupBy(b => b)
            .Select(g => new TopicGapCountDto
            {
                Topic = g.Key,
                Count = g.Count(),
                Category = "Environmental / External"
            })
            .OrderByDescending(t => t.Count)
            .Take(6)
            .ToList();

        // Prep correlation
        var prepCorrelation = retrospectives
            .Where(r => !string.IsNullOrWhiteSpace(r.PreparationTime))
            .GroupBy(r => r.PreparationTime)
            .Select(g => new PrepCorrelationDto
            {
                PrepDuration = g.Key,
                Count = g.Count(),
                AvgConfidence = Math.Round(g.Average(x => x.ConfidenceRating), 1)
            })
            .OrderByDescending(p => p.Count)
            .ToList();

        // Generate research-grade remediation action plan
        var remediationPlan = GenerateActionableRemediation(stageBreakdown, rootCauseBreakdown, topTopicGaps, avgTimePressure, avgDeficit);

        return new FailureAnalyticsDto
        {
            TotalRetrospectives = total,
            CorporateFailures = corporateCount,
            GovtFailures = govtCount,
            AvgDifficultyRating = avgDifficulty,
            AvgTimePressureRating = avgTimePressure,
            AvgConfidenceRating = avgConfidence,
            AvgCutoffDeficit = avgDeficit,
            StageBreakdown = stageBreakdown,
            RootCauseBreakdown = rootCauseBreakdown,
            TopTopicGaps = topTopicGaps,
            TopExternalBlockers = topExternalBlockers,
            PreparationCorrelation = prepCorrelation,
            RemediationActionPlan = remediationPlan
        };
    }

    private static List<ActionableRemediationItemDto> GenerateActionableRemediation(
        List<StageFailureCountDto> stages,
        List<RootCauseCountDto> rootCauses,
        List<TopicGapCountDto> topics,
        double avgTimePressure,
        double avgDeficit)
    {
        var plan = new List<ActionableRemediationItemDto>();

        var stageNames = stages.Select(s => s.Stage.ToLowerInvariant()).ToList();
        var causeNames = rootCauses.Select(c => c.Cause.ToLowerInvariant()).ToList();
        var topicNames = topics.Select(t => t.Topic.ToLowerInvariant()).ToList();

        // Rule 1: High Cutoff Gap Deficit / Negative Marking Penalties
        if (avgDeficit > 5 || topicNames.Any(t => t.Contains("negative marking") || t.Contains("shortcuts")))
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "Exam Score Strategy",
                Title = $"Cutoff Deficit Closing Strategy (Avg Gap: ~{avgDeficit} marks)",
                Description = "Candidates lost significant ground to negative marking or skipped high-yield questions.",
                RecommendedAction = "Adopt the '2-Pass Strategy': Pass 1 (0-35 mins) answers only 100% certain questions to establish base cutoff marks. Pass 2 (35-55 mins) tackles 50/50 eliminations with calculated risks. Never guess blindly on questions with >0.25 negative penalty.",
                Priority = "High",
                Tag = "Cutoff Optimization"
            });
        }

        // Rule 2: MCQ / Preliminary Exam Speed or Severe Time Pressure
        if (avgTimePressure >= 3.5 || stageNames.Any(s => s.Contains("mcq") || s.Contains("preliminary")) || causeNames.Any(c => c.Contains("speed") || c.Contains("time management")))
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "Govt & Bank Recruitment",
                Title = "Timed MCQ Mock Drills & OMR Sheet Bubbling Optimization",
                Description = "Detected recurring time deficits and rushed final question sets in preliminary screening exams.",
                RecommendedAction = "Execute 5 full 100-question timed mocks weekly with a physical OMR sheet. Enforce a hard 45-second limit per analytical/math item; if a question cannot be formulated within 15 seconds, flag and move forward immediately.",
                Priority = "High",
                Tag = "MCQ Speed Drill"
            });
        }

        // Rule 3: Subjective Written Technical Exam
        if (stageNames.Any(s => s.Contains("written") || s.Contains("subjective")) || topicNames.Any(t => t.Contains("sql") || t.Contains("c++") || t.Contains("normalization") || t.Contains("subnetting")))
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "Govt Written Strategy",
                Title = "Handwritten CSE & Core Engineering Mastery (BUET / BPSC Standard)",
                Description = "Critical marks dropped on written proofs, manual SQL joins, subqueries, and handwritten algorithm tracing.",
                RecommendedAction = "Solve past 5-year written question banks from BUET, BPSC, and Combined 8-Bank Officer exams. Practice writing syntactic C++, complex SQL subqueries, and subnetting calculations by hand on paper without IDE autocompletion.",
                Priority = "High",
                Tag = "Written Exam Prep"
            });
        }

        // Rule 4: System Design / Scalability
        if (stageNames.Any(s => s.Contains("system design") || s.Contains("architecture")) || topicNames.Any(t => t.Contains("system design") || t.Contains("scalability") || t.Contains("caching") || t.Contains("microservices")))
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "Corporate Tech Architecture",
                Title = "Distributed Systems & Scalability Frameworks (Senior Bar)",
                Description = "Eliminated during high-level design, database sharding, or real-time event-driven discussions.",
                RecommendedAction = "Work through Alex Xu's System Design Interview Vol 1 & 2. Practice diagramming end-to-end architectures (Redis write-through cache, rate limiting with Token Bucket, read-replica failovers, and Kafka event brokers) on Excalidraw.",
                Priority = "High",
                Tag = "System Design"
            });
        }

        // Rule 5: Coding Assessment / DSA Patterns
        if (stageNames.Any(s => s.Contains("coding") || s.Contains("oa") || s.Contains("algorithm")) || topicNames.Any(t => t.Contains("dynamic programming") || t.Contains("graphs") || t.Contains("leetcode")))
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "Algorithms & Data Structures",
                Title = "Pattern-Based LeetCode Drills (NeetCode 150)",
                Description = "Struggled with algorithmic efficiency and edge cases during timed live coding.",
                RecommendedAction = "Drill patterns rather than individual problems: Two Pointers, Sliding Window, Monotonic Stack, Dynamic Programming (Bottom-Up), and Graph Topo Sort. Cap time to 25 mins per medium problem.",
                Priority = "High",
                Tag = "LeetCode Patterns"
            });
        }

        // Rule 6: Viva Voce / Board Presentation
        if (stageNames.Any(s => s.Contains("viva") || s.Contains("board")) || topicNames.Any(t => t.Contains("nervousness") || t.Contains("viva voce") || t.Contains("star")))
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "Viva & Board Presentation",
                Title = "STAR Technique & Concise Oral Presentation Under Pressure",
                Description = "Hesitation or unstructured explanations before the examination board.",
                RecommendedAction = "Record 2-minute mock viva answers. Use STAR (Situation, Task, Action, Result). Practice concise 2-sentence answers, maintain upright posture, and revise recent national ICT initiatives & monetary policy fundamentals.",
                Priority = "High",
                Tag = "Viva Voce"
            });
        }

        // Fallback default
        if (!plan.Any())
        {
            plan.Add(new ActionableRemediationItemDto
            {
                Category = "General Interview Strategy",
                Title = "Continuous Post-Mortem Feedback Loop",
                Description = "Maintain active retrospective logging to identify systemic patterns.",
                RecommendedAction = "Log every interview question immediately after rounds in your notes. Schedule dedicated 4-hour weekend blocks targeting your primary failure points.",
                Priority = "Medium",
                Tag = "Retrospective Habit"
            });
        }

        return plan;
    }

    private static List<string> DeserializeTags(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new List<string>();
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    private static SurveyExtraData DeserializeExtra(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new SurveyExtraData();
        try
        {
            return JsonSerializer.Deserialize<SurveyExtraData>(json) ?? new SurveyExtraData();
        }
        catch
        {
            return new SurveyExtraData();
        }
    }

    private static RejectionRetrospectiveResponseDto MapToResponse(
        RejectionRetrospective entity,
        List<string> tags,
        SurveyExtraData extra)
    {
        return new RejectionRetrospectiveResponseDto
        {
            Id = entity.Id,
            JobApplicationId = entity.JobApplicationId,
            JobDomain = entity.JobDomain,
            FailedStage = entity.FailedStage,
            PrimaryRootCause = entity.PrimaryRootCause,
            SpecificWeaknessTags = tags,
            PreparationTime = entity.PreparationTime,
            MockCount = entity.MockCount,
            DifficultyRating = entity.DifficultyRating,
            TimePressureRating = entity.TimePressureRating,
            ConfidenceRating = entity.ConfidenceRating,
            EstimatedScore = entity.EstimatedScore,
            ExpectedCutoffScore = entity.ExpectedCutoffScore,
            NegativeMarksLost = entity.NegativeMarksLost,
            FeedbackStatus = entity.FeedbackStatus,
            TechnicalTopicGaps = extra.TechnicalTopicGaps,
            BehavioralFactors = extra.BehavioralFactors,
            ExternalBlockers = extra.ExternalBlockers,
            StudyMaterialsUsed = extra.StudyMaterialsUsed,
            WhatWentWell = entity.WhatWentWell,
            WhatFailed = entity.WhatFailed,
            ActionablePlan = entity.ActionablePlan,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}

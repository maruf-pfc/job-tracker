using System;
using System.Collections.Generic;

namespace JobTracker.API.DTOs.AiAdvisor;

public class AiActionItemDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "High"; // High, Medium, Low
    public string Category { get; set; } = "Strategy"; // Technical, Speed, Networking, Preparation
}

public class AiCareerInsightDto
{
    public string ExecutiveSummary { get; set; } = string.Empty;
    public string GovtVsCorporateStrategy { get; set; } = string.Empty;
    public List<string> KeyStrengths { get; set; } = new();
    public List<string> CriticalGaps { get; set; } = new();
    public List<AiActionItemDto> ActionPlan { get; set; } = new();
    public bool IsCached { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public int TotalApplicationsAnalyzed { get; set; }
}

public class RefreshAiInsightRequestDto
{
    public bool ForceRefresh { get; set; } = true;
}

using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.Rejection;

public class CreateRejectionRetrospectiveDto
{
    [Required]
    [MaxLength(50)]
    public string JobDomain { get; set; } = "Corporate"; // "Corporate" | "Govt & Bank"

    [Required]
    [MaxLength(100)]
    public string FailedStage { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string PrimaryRootCause { get; set; } = string.Empty;

    public List<string> SpecificWeaknessTags { get; set; } = new();

    // Detailed Questionnaire Inputs
    public string PreparationTime { get; set; } = string.Empty;
    public string MockCount { get; set; } = string.Empty;
    public int DifficultyRating { get; set; } = 3;
    public int TimePressureRating { get; set; } = 3;
    public int ConfidenceRating { get; set; } = 5;
    public double? EstimatedScore { get; set; }
    public double? ExpectedCutoffScore { get; set; }
    public double? NegativeMarksLost { get; set; }
    public string FeedbackStatus { get; set; } = string.Empty;
    public List<string> TechnicalTopicGaps { get; set; } = new();
    public List<string> BehavioralFactors { get; set; } = new();
    public List<string> ExternalBlockers { get; set; } = new();
    public List<string> StudyMaterialsUsed { get; set; } = new();

    [MaxLength(2000)]
    public string? WhatWentWell { get; set; }

    [MaxLength(2000)]
    public string? WhatFailed { get; set; }

    [MaxLength(2000)]
    public string? ActionablePlan { get; set; }
}

public class RejectionRetrospectiveResponseDto
{
    public Guid Id { get; set; }
    public Guid JobApplicationId { get; set; }
    public string JobDomain { get; set; } = string.Empty;
    public string FailedStage { get; set; } = string.Empty;
    public string PrimaryRootCause { get; set; } = string.Empty;
    public List<string> SpecificWeaknessTags { get; set; } = new();
    public string PreparationTime { get; set; } = string.Empty;
    public string MockCount { get; set; } = string.Empty;
    public int DifficultyRating { get; set; }
    public int TimePressureRating { get; set; }
    public int ConfidenceRating { get; set; }
    public double? EstimatedScore { get; set; }
    public double? ExpectedCutoffScore { get; set; }
    public double? NegativeMarksLost { get; set; }
    public string FeedbackStatus { get; set; } = string.Empty;
    public List<string> TechnicalTopicGaps { get; set; } = new();
    public List<string> BehavioralFactors { get; set; } = new();
    public List<string> ExternalBlockers { get; set; } = new();
    public List<string> StudyMaterialsUsed { get; set; } = new();
    public string? WhatWentWell { get; set; }
    public string? WhatFailed { get; set; }
    public string? ActionablePlan { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class StageFailureCountDto
{
    public string Stage { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class RootCauseCountDto
{
    public string Cause { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class TopicGapCountDto
{
    public string Topic { get; set; } = string.Empty;
    public int Count { get; set; }
    public string Category { get; set; } = string.Empty; // "Technical", "Behavioral", "External"
}

public class PrepCorrelationDto
{
    public string PrepDuration { get; set; } = string.Empty;
    public int Count { get; set; }
    public double AvgConfidence { get; set; }
}

public class ActionableRemediationItemDto
{
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RecommendedAction { get; set; } = string.Empty;
    public string Priority { get; set; } = "High"; // "High" | "Medium"
    public string Tag { get; set; } = string.Empty;
}

public class FailureAnalyticsDto
{
    public int TotalRetrospectives { get; set; }
    public int CorporateFailures { get; set; }
    public int GovtFailures { get; set; }
    public double AvgDifficultyRating { get; set; }
    public double AvgTimePressureRating { get; set; }
    public double AvgConfidenceRating { get; set; }
    public double AvgCutoffDeficit { get; set; } // Difference between expected cutoff and estimated score
    public List<StageFailureCountDto> StageBreakdown { get; set; } = new();
    public List<RootCauseCountDto> RootCauseBreakdown { get; set; } = new();
    public List<TopicGapCountDto> TopTopicGaps { get; set; } = new();
    public List<TopicGapCountDto> TopExternalBlockers { get; set; } = new();
    public List<PrepCorrelationDto> PreparationCorrelation { get; set; } = new();
    public List<ActionableRemediationItemDto> RemediationActionPlan { get; set; } = new();
}

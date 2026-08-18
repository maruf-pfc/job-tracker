using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobTracker.API.Models;

[Table("RejectionRetrospectives")]
public class RejectionRetrospective : BaseEntity
{
    [Required]
    public Guid JobApplicationId { get; set; }

    [ForeignKey(nameof(JobApplicationId))]
    public JobApplication? JobApplication { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    [MaxLength(50)]
    public string JobDomain { get; set; } = "Corporate"; // "Corporate" | "Govt & Bank"

    [Required]
    [MaxLength(100)]
    public string FailedStage { get; set; } = string.Empty; 

    [Required]
    [MaxLength(100)]
    public string PrimaryRootCause { get; set; } = string.Empty;

    public string SpecificWeaknessTagsJson { get; set; } = "[]";

    // Google-Form-Style Granular Diagnostic Survey Data (JSON Payload)
    public string SurveyDataJson { get; set; } = "{}";

    [MaxLength(50)]
    public string PreparationTime { get; set; } = string.Empty; // "< 1 month", "1-3 months", "3-6 months", "6+ months"

    [MaxLength(50)]
    public string MockCount { get; set; } = string.Empty; // "0", "1-3 mocks", "4-10 mocks", "10+"

    public int DifficultyRating { get; set; } = 3; // 1-5
    public int TimePressureRating { get; set; } = 3; // 1-5
    public int ConfidenceRating { get; set; } = 5; // 1-10

    public double? EstimatedScore { get; set; }
    public double? ExpectedCutoffScore { get; set; }
    public double? NegativeMarksLost { get; set; }

    [MaxLength(100)]
    public string FeedbackStatus { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? WhatWentWell { get; set; }

    [MaxLength(2000)]
    public string? WhatFailed { get; set; }

    [MaxLength(2000)]
    public string? ActionablePlan { get; set; }
}

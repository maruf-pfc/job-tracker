using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobTracker.API.Models;

public class UserAiInsight : BaseEntity
{
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Required]
    [MaxLength(128)]
    public string DataHash { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string ExecutiveSummary { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string GovtVsCorporateStrategy { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string KeyStrengthsJson { get; set; } = "[]";

    [MaxLength(5000)]
    public string CriticalGapsJson { get; set; } = "[]";

    [MaxLength(15000)]
    public string ActionPlanJson { get; set; } = "[]";

    public int TotalApplicationsAnalyzed { get; set; }
}

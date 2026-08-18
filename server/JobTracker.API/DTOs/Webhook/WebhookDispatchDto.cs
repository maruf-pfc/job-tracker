namespace JobTracker.API.DTOs.Webhook;

public class WebhookApplicationDto
{
    public string? Id { get; set; }
    public string? Company { get; set; }
    public string? Role { get; set; }
    public string? Status { get; set; }
    public string? JobUrl { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? AppliedAt { get; set; }
    public string? FollowUpDate { get; set; }
    public string? Priority { get; set; }
    public string? WorkType { get; set; }
    public string? JobType { get; set; }
    public string? Notes { get; set; }
}

public class WebhookDispatchDto
{
    public string? N8nWebhookUrl { get; set; }
    public string? DiscordWebhookUrl { get; set; }
    public string? TelegramToken { get; set; }
    public string? TelegramChatId { get; set; }
    public string Event { get; set; } = "application_created";
    public string EventLabel { get; set; } = "Job Application Event";
    public WebhookApplicationDto? Application { get; set; }
}

public class WebhookResultDto
{
    public string Provider { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? Error { get; set; }
}

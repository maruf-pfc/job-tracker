using System.Text;
using System.Text.Json;
using JobTracker.API.Common;
using JobTracker.API.DTOs.Webhook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(IHttpClientFactory httpClientFactory, ILogger<WebhooksController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpPost("dispatch")]
    public async Task<IActionResult> Dispatch([FromBody] WebhookDispatchDto dto)
    {
        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(10);
        var results = new List<WebhookResultDto>();

        var app = dto.Application ?? new WebhookApplicationDto();
        var company = !string.IsNullOrWhiteSpace(app.Company) ? app.Company : "Sample Company";
        var role = !string.IsNullOrWhiteSpace(app.Role) ? app.Role : "Software Engineer";
        var status = !string.IsNullOrWhiteSpace(app.Status) ? app.Status : "Applied";
        var timestamp = DateTime.UtcNow.ToString("o");

        // 1. Dispatch to Discord Webhook
        if (!string.IsNullOrWhiteSpace(dto.DiscordWebhookUrl))
        {
            try
            {
                var color = dto.Event switch
                {
                    "application_created" => 0x10b981, // Emerald Green
                    "status_updated" => 0x6366f1,     // Indigo
                    "application_updated" => 0x3b82f6,// Blue
                    _ => 0x8b5cf6                     // Purple / Default
                };

                var fields = new List<object>
                {
                    new { name = "Status", value = status, inline = true },
                    new { name = "Salary Range", value = !string.IsNullOrWhiteSpace(app.SalaryRange) ? app.SalaryRange : "N/A", inline = true },
                    new { name = "Location", value = !string.IsNullOrWhiteSpace(app.Location) ? app.Location : "N/A", inline = true }
                };

                if (!string.IsNullOrWhiteSpace(app.AppliedAt))
                {
                    fields.Add(new { name = "Applied Date", value = app.AppliedAt, inline = true });
                }

                if (!string.IsNullOrWhiteSpace(app.FollowUpDate))
                {
                    fields.Add(new { name = "Application Deadline", value = app.FollowUpDate, inline = true });
                }

                if (!string.IsNullOrWhiteSpace(app.JobUrl))
                {
                    fields.Add(new { name = "Job / Circular URL", value = app.JobUrl, inline = false });
                }

                var discordPayload = new
                {
                    username = "JobTracker Bot",
                    avatar_url = "https://cdn-icons-png.flaticon.com/512/3850/3850285.png",
                    embeds = new[]
                    {
                        new
                        {
                            title = $"💼 {dto.EventLabel}",
                            color = color,
                            description = $"**{role}** at **{company}**",
                            fields = fields,
                            footer = new { text = "JobTracker Automation Engine" },
                            timestamp = timestamp
                        }
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(discordPayload), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(dto.DiscordWebhookUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    results.Add(new WebhookResultDto { Provider = "Discord", Success = true });
                }
                else
                {
                    var errBody = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Discord Webhook failed with status {StatusCode}: {Error}", response.StatusCode, errBody);
                    results.Add(new WebhookResultDto
                    {
                        Provider = "Discord",
                        Success = false,
                        Error = $"HTTP {response.StatusCode}: {errBody}"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch Discord webhook");
                results.Add(new WebhookResultDto { Provider = "Discord", Success = false, Error = ex.Message });
            }
        }

        // 2. Dispatch to n8n / Excel Webhook
        if (!string.IsNullOrWhiteSpace(dto.N8nWebhookUrl))
        {
            try
            {
                var n8nPayload = new
                {
                    @event = dto.Event,
                    eventLabel = dto.EventLabel,
                    timestamp = timestamp,
                    application = app
                };

                var content = new StringContent(JsonSerializer.Serialize(n8nPayload), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(dto.N8nWebhookUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    results.Add(new WebhookResultDto { Provider = "n8n", Success = true });
                }
                else
                {
                    var errBody = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("n8n Webhook failed with status {StatusCode}: {Error}", response.StatusCode, errBody);
                    results.Add(new WebhookResultDto
                    {
                        Provider = "n8n",
                        Success = false,
                        Error = $"HTTP {response.StatusCode}: {errBody}"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch n8n webhook");
                results.Add(new WebhookResultDto { Provider = "n8n", Success = false, Error = ex.Message });
            }
        }

        // 3. Dispatch to Telegram Bot
        if (!string.IsNullOrWhiteSpace(dto.TelegramToken) && !string.IsNullOrWhiteSpace(dto.TelegramChatId))
        {
            try
            {
                var sb = new StringBuilder();
                sb.AppendLine($"💼 *JobTracker Alert: {dto.EventLabel}*");
                sb.AppendLine();
                sb.AppendLine($"🏢 *Company:* {company}");
                sb.AppendLine($"🎯 *Role:* {role}");
                sb.AppendLine($"📊 *Status:* {status}");

                if (!string.IsNullOrWhiteSpace(app.SalaryRange))
                    sb.AppendLine($"💰 *Salary Range:* {app.SalaryRange}");
                if (!string.IsNullOrWhiteSpace(app.Location))
                    sb.AppendLine($"📍 *Location:* {app.Location}");
                if (!string.IsNullOrWhiteSpace(app.AppliedAt))
                    sb.AppendLine($"📅 *Applied Date:* {app.AppliedAt}");
                if (!string.IsNullOrWhiteSpace(app.FollowUpDate))
                    sb.AppendLine($"⏰ *Deadline:* {app.FollowUpDate}");
                if (!string.IsNullOrWhiteSpace(app.JobUrl))
                    sb.AppendLine($"🔗 [Job / Circular Link]({app.JobUrl})");

                sb.AppendLine();
                sb.AppendLine($"⏰ _{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC_");

                var telegramPayload = new
                {
                    chat_id = dto.TelegramChatId,
                    text = sb.ToString(),
                    parse_mode = "Markdown"
                };

                var telegramUrl = $"https://api.telegram.org/bot{dto.TelegramToken}/sendMessage";
                var content = new StringContent(JsonSerializer.Serialize(telegramPayload), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(telegramUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    results.Add(new WebhookResultDto { Provider = "Telegram", Success = true });
                }
                else
                {
                    var errBody = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Telegram webhook failed with status {StatusCode}: {Error}", response.StatusCode, errBody);
                    results.Add(new WebhookResultDto
                    {
                        Provider = "Telegram",
                        Success = false,
                        Error = $"HTTP {response.StatusCode}: {errBody}"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch Telegram webhook");
                results.Add(new WebhookResultDto { Provider = "Telegram", Success = false, Error = ex.Message });
            }
        }

        return Ok(ApiResponse<List<WebhookResultDto>>.SuccessResponse(results, "Webhooks dispatched successfully"));
    }
}

using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using JobTracker.API.DTOs.Webhook;
using JobTracker.API.Interfaces;

namespace JobTracker.API.Services;

public class WebhookDispatcherService : IWebhookDispatcherService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<WebhookDispatcherService> _logger;

    public WebhookDispatcherService(IHttpClientFactory httpClientFactory, ILogger<WebhookDispatcherService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<List<WebhookResultDto>> DispatchAsync(WebhookDispatchDto dto, CancellationToken cancellationToken = default)
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
            results.Add(await DispatchDiscordWebhookAsync(client, dto, app, company, role, status, timestamp, cancellationToken));
        }

        // 2. Dispatch to n8n / Excel Webhook
        if (!string.IsNullOrWhiteSpace(dto.N8nWebhookUrl))
        {
            results.Add(await DispatchN8nWebhookAsync(client, dto, app, timestamp, cancellationToken));
        }

        // 3. Dispatch to Telegram Bot
        if (!string.IsNullOrWhiteSpace(dto.TelegramToken) && !string.IsNullOrWhiteSpace(dto.TelegramChatId))
        {
            results.Add(await DispatchTelegramWebhookAsync(client, dto, app, company, role, status, cancellationToken));
        }

        return results;
    }

    private async Task<WebhookResultDto> DispatchDiscordWebhookAsync(
        HttpClient client,
        WebhookDispatchDto dto,
        WebhookApplicationDto app,
        string company,
        string role,
        string status,
        string timestamp,
        CancellationToken cancellationToken)
    {
        try
        {
            var urlError = ValidateDiscordWebhookUrl(dto.DiscordWebhookUrl!);
            if (urlError != null)
            {
                return new WebhookResultDto { Provider = "Discord", Success = false, Error = urlError };
            }

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
            var response = await client.PostAsync(dto.DiscordWebhookUrl, content, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return new WebhookResultDto { Provider = "Discord", Success = true };
            }

            var errBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("Discord Webhook failed with status {StatusCode}: {Error}", response.StatusCode, errBody);
            return new WebhookResultDto
            {
                Provider = "Discord",
                Success = false,
                Error = $"HTTP {response.StatusCode}: {errBody}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to dispatch Discord webhook");
            return new WebhookResultDto { Provider = "Discord", Success = false, Error = ex.Message };
        }
    }

    private async Task<WebhookResultDto> DispatchN8nWebhookAsync(
        HttpClient client,
        WebhookDispatchDto dto,
        WebhookApplicationDto app,
        string timestamp,
        CancellationToken cancellationToken)
    {
        try
        {
            var urlError = ValidateSafeUrl(dto.N8nWebhookUrl!);
            if (urlError != null)
            {
                return new WebhookResultDto { Provider = "n8n", Success = false, Error = urlError };
            }

            var n8nPayload = new
            {
                @event = dto.Event,
                eventLabel = dto.EventLabel,
                timestamp = timestamp,
                application = app
            };

            var content = new StringContent(JsonSerializer.Serialize(n8nPayload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(dto.N8nWebhookUrl, content, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return new WebhookResultDto { Provider = "n8n", Success = true };
            }

            var errBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("n8n Webhook failed with status {StatusCode}: {Error}", response.StatusCode, errBody);
            return new WebhookResultDto
            {
                Provider = "n8n",
                Success = false,
                Error = $"HTTP {response.StatusCode}: {errBody}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to dispatch n8n webhook");
            return new WebhookResultDto { Provider = "n8n", Success = false, Error = ex.Message };
        }
    }

    private async Task<WebhookResultDto> DispatchTelegramWebhookAsync(
        HttpClient client,
        WebhookDispatchDto dto,
        WebhookApplicationDto app,
        string company,
        string role,
        string status,
        CancellationToken cancellationToken)
    {
        try
        {
            // Validate Telegram token format: alphanumeric and colons only
            if (dto.TelegramToken!.Any(c => !char.IsLetterOrDigit(c) && c != ':' && c != '_' && c != '-'))
            {
                return new WebhookResultDto { Provider = "Telegram", Success = false, Error = "Invalid Telegram bot token format." };
            }

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
            var response = await client.PostAsync(telegramUrl, content, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return new WebhookResultDto { Provider = "Telegram", Success = true };
            }

            var errBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("Telegram webhook failed with status {StatusCode}: {Error}", response.StatusCode, errBody);
            return new WebhookResultDto
            {
                Provider = "Telegram",
                Success = false,
                Error = $"HTTP {response.StatusCode}: {errBody}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to dispatch Telegram webhook");
            return new WebhookResultDto { Provider = "Telegram", Success = false, Error = ex.Message };
        }
    }

    public static string? ValidateDiscordWebhookUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return "Invalid Discord webhook URL format.";
        }

        if (uri.Scheme != Uri.UriSchemeHttps)
        {
            return "Discord webhook URL must use HTTPS.";
        }

        var host = uri.Host.ToLowerInvariant();
        if (host != "discord.com" && host != "discordapp.com" && !host.EndsWith(".discord.com"))
        {
            return "Discord webhook URL must point to discord.com or discordapp.com.";
        }

        if (!uri.AbsolutePath.StartsWith("/api/webhooks/", StringComparison.OrdinalIgnoreCase))
        {
            return "Discord webhook URL must start with /api/webhooks/.";
        }

        return null;
    }

    public static string? ValidateSafeUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return "Invalid webhook URL format.";
        }

        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
        {
            return "Webhook URL must use HTTP or HTTPS protocol.";
        }

        var host = uri.Host.ToLowerInvariant();

        // Check if host is direct IP or localhost
        if (host is "localhost" or "127.0.0.1" or "::1")
        {
            return "Webhook URL cannot point to localhost.";
        }

        if (IPAddress.TryParse(host, out var ip))
        {
            if (IsPrivateOrInternalIp(ip))
            {
                return "Webhook URL cannot target private or loopback IP ranges.";
            }
        }

        return null;
    }

    private static bool IsPrivateOrInternalIp(IPAddress ip)
    {
        if (IPAddress.IsLoopback(ip)) return true;

        var bytes = ip.GetAddressBytes();

        // IPv4 checks
        if (ip.AddressFamily == AddressFamily.InterNetwork)
        {
            // 10.0.0.0/8
            if (bytes[0] == 10) return true;
            // 172.16.0.0/12
            if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) return true;
            // 192.168.0.0/16
            if (bytes[0] == 192 && bytes[1] == 168) return true;
            // 169.254.0.0/16 (Link Local / Cloud Metadata)
            if (bytes[0] == 169 && bytes[1] == 254) return true;
            // 0.0.0.0
            if (bytes[0] == 0) return true;
        }
        else if (ip.AddressFamily == AddressFamily.InterNetworkV6)
        {
            // IPv6 loopback, link local (fe80::), unique local (fc00::/7)
            if (ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6UniqueLocal) return true;
        }

        return false;
    }
}

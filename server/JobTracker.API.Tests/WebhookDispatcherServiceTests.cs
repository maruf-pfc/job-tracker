using System.Net;
using JobTracker.API.DTOs.Webhook;
using JobTracker.API.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using Xunit;

namespace JobTracker.API.Tests;

public class WebhookDispatcherServiceTests
{
    private readonly Mock<ILogger<WebhookDispatcherService>> _mockLogger = new();

    [Theory]
    [InlineData("http://discord.com/api/webhooks/123/abc", "Discord webhook URL must use HTTPS.")]
    [InlineData("https://evil.com/api/webhooks/123/abc", "Discord webhook URL must point to discord.com or discordapp.com.")]
    [InlineData("https://discord.com/other/path", "Discord webhook URL must start with /api/webhooks/.")]
    [InlineData("not-a-valid-url", "Invalid Discord webhook URL format.")]
    public void ValidateDiscordWebhookUrl_ShouldRejectInvalidUrls(string url, string expectedErrorSubstring)
    {
        var error = WebhookDispatcherService.ValidateDiscordWebhookUrl(url);
        Assert.NotNull(error);
        Assert.Contains(expectedErrorSubstring, error);
    }

    [Theory]
    [InlineData("https://discord.com/api/webhooks/123456/abcdef")]
    [InlineData("https://discordapp.com/api/webhooks/123456/abcdef")]
    public void ValidateDiscordWebhookUrl_ShouldAcceptValidUrls(string url)
    {
        var error = WebhookDispatcherService.ValidateDiscordWebhookUrl(url);
        Assert.Null(error);
    }

    [Theory]
    [InlineData("http://localhost:5000/webhook", "Webhook URL cannot point to localhost.")]
    [InlineData("http://127.0.0.1:8080/webhook", "Webhook URL cannot point to localhost.")]
    [InlineData("http://10.0.0.1/webhook", "Webhook URL cannot target private or loopback IP ranges.")]
    [InlineData("http://192.168.1.100/webhook", "Webhook URL cannot target private or loopback IP ranges.")]
    [InlineData("http://172.16.0.5/webhook", "Webhook URL cannot target private or loopback IP ranges.")]
    [InlineData("http://169.254.169.254/latest/meta-data", "Webhook URL cannot target private or loopback IP ranges.")]
    [InlineData("ftp://example.com/webhook", "Webhook URL must use HTTP or HTTPS protocol.")]
    public void ValidateSafeUrl_ShouldRejectSsrfTargets(string url, string expectedErrorSubstring)
    {
        var error = WebhookDispatcherService.ValidateSafeUrl(url);
        Assert.NotNull(error);
        Assert.Contains(expectedErrorSubstring, error);
    }

    [Theory]
    [InlineData("https://n8n.example.com/webhook/job-events")]
    [InlineData("https://api.mycompany.com/webhook")]
    public void ValidateSafeUrl_ShouldAcceptValidPublicUrls(string url)
    {
        var error = WebhookDispatcherService.ValidateSafeUrl(url);
        Assert.Null(error);
    }

    [Fact]
    public async Task DispatchAsync_ShouldReturnSuccess_WhenDiscordSucceeds()
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{}")
            });

        var httpClient = new HttpClient(handlerMock.Object);
        var mockFactory = new Mock<IHttpClientFactory>();
        mockFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);

        var service = new WebhookDispatcherService(mockFactory.Object, _mockLogger.Object);

        var dto = new WebhookDispatchDto
        {
            DiscordWebhookUrl = "https://discord.com/api/webhooks/123/abc",
            Event = "application_created",
            EventLabel = "New Application",
            Application = new WebhookApplicationDto
            {
                Company = "Google",
                Role = "Staff Engineer"
            }
        };

        var results = await service.DispatchAsync(dto);

        Assert.Single(results);
        Assert.True(results[0].Success);
        Assert.Equal("Discord", results[0].Provider);
    }
}

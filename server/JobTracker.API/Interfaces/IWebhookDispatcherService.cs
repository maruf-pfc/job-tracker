using JobTracker.API.DTOs.Webhook;

namespace JobTracker.API.Interfaces;

public interface IWebhookDispatcherService
{
    Task<List<WebhookResultDto>> DispatchAsync(WebhookDispatchDto dto, CancellationToken cancellationToken = default);
}

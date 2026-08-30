using JobTracker.API.Common;
using JobTracker.API.DTOs.Webhook;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IWebhookDispatcherService _webhookDispatcherService;

    public WebhooksController(IWebhookDispatcherService webhookDispatcherService)
    {
        _webhookDispatcherService = webhookDispatcherService;
    }

    [HttpPost("dispatch")]
    public async Task<IActionResult> Dispatch([FromBody] WebhookDispatchDto dto, CancellationToken cancellationToken)
    {
        var results = await _webhookDispatcherService.DispatchAsync(dto, cancellationToken);
        return Ok(ApiResponse<List<WebhookResultDto>>.SuccessResponse(results, "Webhooks dispatched successfully"));
    }
}

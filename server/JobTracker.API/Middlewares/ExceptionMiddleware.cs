using System.Net;
using System.Text.Json;
using JobTracker.API.Common;

namespace JobTracker.API.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

            context.Response.ContentType = "application/json";

            var (statusCode, message) = exception switch
            {
                UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, exception.Message),
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, exception.Message),
                BadHttpRequestException => ((int)HttpStatusCode.BadRequest, exception.Message),
                ArgumentException => ((int)HttpStatusCode.BadRequest, exception.Message),
                InvalidOperationException => ((int)HttpStatusCode.BadRequest, exception.Message),
                _ => ((int)HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again.")
            };

            context.Response.StatusCode = statusCode;

            var response = ApiResponse<string>.FailureResponse(message);
            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            await context.Response.WriteAsync(json);
        }
    }
}
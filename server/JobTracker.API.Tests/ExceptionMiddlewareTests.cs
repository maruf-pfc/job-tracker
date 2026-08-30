using System.Net;
using System.Text.Json;
using JobTracker.API.Common;
using JobTracker.API.Exceptions;
using JobTracker.API.Middlewares;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace JobTracker.API.Tests;

public class ExceptionMiddlewareTests
{
    private readonly Mock<ILogger<ExceptionMiddleware>> _mockLogger = new();

    [Fact]
    public async Task InvokeAsync_ShouldReturn404_WhenNotFoundExceptionThrown()
    {
        var middleware = new ExceptionMiddleware(
            next: (innerContext) => throw new NotFoundException("Resource was not found."),
            logger: _mockLogger.Object);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.NotFound, context.Response.StatusCode);
        Assert.Equal("application/json", context.Response.ContentType);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var body = await reader.ReadToEndAsync();

        var response = JsonSerializer.Deserialize<ApiResponse<string>>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(response);
        Assert.False(response.Success);
        Assert.Equal("Resource was not found.", response.Message);
    }

    [Fact]
    public async Task InvokeAsync_ShouldReturn400_WhenBadRequestExceptionThrown()
    {
        var middleware = new ExceptionMiddleware(
            next: (innerContext) => throw new BadRequestException("Invalid payload provided."),
            logger: _mockLogger.Object);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.BadRequest, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var body = await reader.ReadToEndAsync();

        var response = JsonSerializer.Deserialize<ApiResponse<string>>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(response);
        Assert.False(response.Success);
        Assert.Equal("Invalid payload provided.", response.Message);
    }

    [Fact]
    public async Task InvokeAsync_ShouldReturn401_WhenUnauthorizedExceptionThrown()
    {
        var middleware = new ExceptionMiddleware(
            next: (innerContext) => throw new UnauthorizedException("User is unauthenticated."),
            logger: _mockLogger.Object);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.Unauthorized, context.Response.StatusCode);
    }

    [Fact]
    public async Task InvokeAsync_ShouldReturn500WithoutLeakingDetails_WhenUnhandledExceptionThrown()
    {
        var middleware = new ExceptionMiddleware(
            next: (innerContext) => throw new Exception("Database connection string: Server=secret;User=admin;Password=supersecret"),
            logger: _mockLogger.Object);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var body = await reader.ReadToEndAsync();

        var response = JsonSerializer.Deserialize<ApiResponse<string>>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(response);
        Assert.False(response.Success);
        Assert.DoesNotContain("secret", response.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Equal("An unexpected error occurred. Please try again.", response.Message);
    }
}

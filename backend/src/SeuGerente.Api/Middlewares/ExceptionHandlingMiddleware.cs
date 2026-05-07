using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace SeuGerente.Api.Middlewares;

/// <summary>
/// Middleware para tratamento global de exceções seguindo RFC 7807 (Problem+JSON)
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
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
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var correlationId = context.Items["X-Correlation-ID"]?.ToString() ?? Guid.NewGuid().ToString();
        
        _logger.LogError(exception, 
            "Erro não tratado. CorrelationId: {CorrelationId}", correlationId);

        var problemDetails = new ProblemDetails
        {
            Instance = context.Request.Path,
            Status = (int)HttpStatusCode.InternalServerError,
            Title = "Erro interno do servidor",
            Detail = exception.Message,
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1"
        };

        problemDetails.Extensions["correlationId"] = correlationId;
        problemDetails.Extensions["timestamp"] = DateTime.UtcNow;

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}

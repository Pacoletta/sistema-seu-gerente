using System.Text;
using Hangfire.Dashboard;

namespace SeuGerente.Api;

/// <summary>
/// Filtro de autorização para o dashboard do Hangfire.
/// Usa Basic Auth com a senha definida em HANGFIRE_DASHBOARD_PASSWORD.
/// </summary>
public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        // Em desenvolvimento, permite acesso sem autenticação
        var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        if (env == "Development")
            return true;

        var config = httpContext.RequestServices.GetRequiredService<IConfiguration>();

        var password = config["Hangfire:DashboardPassword"]
            ?? Environment.GetEnvironmentVariable("HANGFIRE_DASHBOARD_PASSWORD")
            ?? "Admin@123456";

        var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();

        if (authHeader != null && authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                var encoded = authHeader["Basic ".Length..].Trim();
                var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(encoded));
                var colonIndex = decoded.IndexOf(':');
                if (colonIndex > 0)
                {
                    var user = decoded[..colonIndex];
                    var pass = decoded[(colonIndex + 1)..];
                    if (user == "admin" && pass == password)
                        return true;
                }
            }
            catch
            {
                // Token inválido, segue para desafio de autenticação
            }
        }

        httpContext.Response.Headers["WWW-Authenticate"] = "Basic realm=\"Hangfire Dashboard\"";
        httpContext.Response.StatusCode = 401;
        return false;
    }
}

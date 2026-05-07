using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SeuGerente.Domain.Interfaces;
using System.Security.Claims;

namespace SeuGerente.Api.Middlewares;

/// <summary>
/// Atributo para proteger endpoints que requerem permissão administrativa
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireAdminAttribute : Attribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var logger = context.HttpContext.RequestServices.GetService<ILogger<RequireAdminAttribute>>();
        
        logger?.LogInformation("🔐 RequireAdmin - Iniciando validação");
        logger?.LogInformation($"🔍 User.Identity.IsAuthenticated: {context.HttpContext.User?.Identity?.IsAuthenticated}");
        logger?.LogInformation($"🔍 Total de Claims: {context.HttpContext.User?.Claims?.Count() ?? 0}");
        
        foreach (var claim in context.HttpContext.User?.Claims ?? Enumerable.Empty<System.Security.Claims.Claim>())
        {
            logger?.LogInformation($"📋 Claim: {claim.Type} = {claim.Value}");
        }
        
        // Verificar se o usuário está autenticado
        // Tentar vários tipos de claims de email
        var userEmail = context.HttpContext.User?.FindFirst(ClaimTypes.Email)?.Value
                     ?? context.HttpContext.User?.FindFirst("email")?.Value
                     ?? context.HttpContext.User?.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email)?.Value;
        
        logger?.LogInformation($"📧 Email extraído do claim: {userEmail ?? "(nulo)"}");

        if (string.IsNullOrEmpty(userEmail))
        {
            logger?.LogWarning("❌ Usuário não autenticado - claim 'email' não encontrado");
            context.Result = new UnauthorizedObjectResult(new { error = "Usuário não autenticado" });
            return;
        }

        // Obter o repositório administrativo
        var adminRepo = context.HttpContext.RequestServices
            .GetService<IAdministrativoRepository>();

        if (adminRepo == null)
        {
            logger?.LogError("❌ IAdministrativoRepository não encontrado");
            context.Result = new StatusCodeResult(500);
            return;
        }

        // Verificar se o email tem permissão administrativa
        var isAdmin = await adminRepo.IsAdminAsync(userEmail);
        
        logger?.LogInformation($"👤 {userEmail} é admin? {isAdmin}");

        if (!isAdmin)
        {
            logger?.LogWarning($"⛔ Acesso negado para {userEmail} - não é admin");
            context.Result = new ObjectResult(new 
            { 
                error = "Acesso negado", 
                message = "Você não tem permissão para acessar esta área" 
            })
            {
                StatusCode = 403
            };
            return;
        }

        logger?.LogInformation($"✅ Acesso permitido para admin: {userEmail}");
        // Usuário é admin - permitir acesso
    }
}

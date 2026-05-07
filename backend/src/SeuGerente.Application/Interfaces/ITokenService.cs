using System.Security.Claims;

namespace SeuGerente.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(Guid usuarioId, string email, string? role = null);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}

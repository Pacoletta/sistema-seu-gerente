using Microsoft.AspNetCore.Mvc;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminAuthController : ControllerBase
{
    private readonly IAdministrativoRepository _adminRepo;
    private readonly ILogger<AdminAuthController> _logger;

    public AdminAuthController(IAdministrativoRepository adminRepo, ILogger<AdminAuthController> logger)
    {
        _adminRepo = adminRepo;
        _logger = logger;
    }

    [HttpPost("set-password")]
    public async Task<IActionResult> SetPassword([FromBody] SetPasswordRequest request)
    {
        try
        {
            var admin = await _adminRepo.GetByEmailAsync(request.Email);

            if (admin == null)
                return NotFound(new { message = "Administrador não encontrado" });

            admin.SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.NovaSenha);
            await _adminRepo.UpdateAsync(admin);

            _logger.LogInformation("Senha atualizada para admin: {Email}", request.Email);
            return Ok(new { message = "Senha atualizada com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar senha do admin: {Email}", request.Email);
            return StatusCode(500, new { message = "Erro ao atualizar senha" });
        }
    }
}

public class SetPasswordRequest
{
    public string Email { get; set; } = string.Empty;
    public string NovaSenha { get; set; } = string.Empty;
}

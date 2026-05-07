using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Api.Controllers;

/// <summary>
/// Utilitários de sincronização e manutenção do sistema.
/// Supabase removido — auth é próprio via JWT + BCrypt.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SyncController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SyncController> _logger;

    public SyncController(ApplicationDbContext context, ILogger<SyncController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista usuários sem senha definida (migração de sistema legado).
    /// </summary>
    [HttpGet("usuarios/sem-senha")]
    public async Task<IActionResult> UsuariosSemSenha()
    {
        var usuarios = await _context.Cadastros
            .Where(c => string.IsNullOrEmpty(c.SenhaHash))
            .Select(c => new { c.Id, c.Email, c.Nome, c.Status, c.CreatedAt })
            .ToListAsync();

        return Ok(new { total = usuarios.Count, usuarios });
    }
}

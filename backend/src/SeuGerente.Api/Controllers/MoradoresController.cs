using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MoradoresController : ControllerBase
{
    private readonly MoradorService _moradorService;
    private readonly ILogger<MoradoresController> _logger;

    public MoradoresController(MoradorService moradorService, ILogger<MoradoresController> logger)
    {
        _moradorService = moradorService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Lista todos os moradores do usuário autenticado
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MoradorDTO>>> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            _logger.LogInformation("🏢 Buscando moradores para usuário: {UsuarioId}", usuarioId);
            
            var moradores = await _moradorService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
            
            _logger.LogInformation("✅ Encontrados {Count} moradores", moradores.Count());
            return Ok(moradores);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao buscar moradores");
            return StatusCode(500, new { error = "Erro ao buscar moradores", details = ex.Message });
        }
    }

    /// <summary>
    /// Busca morador por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<MoradorDTO>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var morador = await _moradorService.GetByIdAsync(id, cancellationToken);
        if (morador == null)
        {
            return NotFound(new { message = "Morador não encontrado" });
        }
        return Ok(morador);
    }

    /// <summary>
    /// Cria novo morador
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<MoradorDTO>> Create([FromBody] CreateMoradorDTO createDto, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var morador = await _moradorService.CreateAsync(createDto, usuarioId, cancellationToken);
        
        _logger.LogInformation("Morador criado: {MoradorId} - {Nome}", morador.Id, morador.Nome);
        return CreatedAtAction(nameof(GetById), new { id = morador.Id }, morador);
    }

    /// <summary>
    /// Atualiza morador existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateMoradorDTO updateDto, CancellationToken cancellationToken)
    {
        try
        {
            await _moradorService.UpdateAsync(id, updateDto, cancellationToken);
            _logger.LogInformation("Morador atualizado: {MoradorId}", id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Exclui morador
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _moradorService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Morador excluído: {MoradorId}", id);
        return NoContent();
    }
}

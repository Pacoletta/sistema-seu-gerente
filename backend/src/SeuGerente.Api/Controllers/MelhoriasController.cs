using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MelhoriasController : ControllerBase
{
    private readonly MelhoriaService _melhoriaService;
    private readonly ILogger<MelhoriasController> _logger;

    public MelhoriasController(MelhoriaService melhoriaService, ILogger<MelhoriasController> logger)
    {
        _melhoriaService = melhoriaService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MelhoriaDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var melhorias = await _melhoriaService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
        return Ok(melhorias);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MelhoriaDTO>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var melhoria = await _melhoriaService.GetByIdAsync(id, cancellationToken);
        if (melhoria == null)
        {
            return NotFound(new { message = "Melhoria não encontrada" });
        }
        return Ok(melhoria);
    }

    [HttpPost]
    public async Task<ActionResult<MelhoriaDTO>> Create([FromBody] CreateMelhoriaDTO createDto, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var melhoria = await _melhoriaService.CreateAsync(createDto, usuarioId, cancellationToken);

        _logger.LogInformation("Melhoria criada: {MelhoriaId}", melhoria.Id);
        return CreatedAtAction(nameof(GetById), new { id = melhoria.Id }, melhoria);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateMelhoriaDTO updateDto, CancellationToken cancellationToken)
    {
        try
        {
            await _melhoriaService.UpdateAsync(id, updateDto, cancellationToken);
            _logger.LogInformation("Melhoria atualizada: {MelhoriaId}", id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _melhoriaService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Melhoria excluída: {MelhoriaId}", id);
        return NoContent();
    }
}

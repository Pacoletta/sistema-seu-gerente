using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SugestoesController : ControllerBase
{
    private readonly SugestaoService _sugestaoService;
    private readonly ILogger<SugestoesController> _logger;

    public SugestoesController(SugestaoService sugestaoService, ILogger<SugestoesController> logger)
    {
        _sugestaoService = sugestaoService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SugestaoDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var sugestoes = await _sugestaoService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
        return Ok(sugestoes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SugestaoDTO>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var sugestao = await _sugestaoService.GetByIdAsync(id, cancellationToken);
        if (sugestao == null)
        {
            return NotFound(new { message = "Sugestão não encontrada" });
        }
        return Ok(sugestao);
    }

    [HttpPost]
    public async Task<ActionResult<SugestaoDTO>> Create([FromBody] CreateSugestaoDTO createDto, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var sugestao = await _sugestaoService.CreateAsync(createDto, usuarioId, cancellationToken);

        _logger.LogInformation("Sugestão criada: {SugestaoId}", sugestao.Id);
        return CreatedAtAction(nameof(GetById), new { id = sugestao.Id }, sugestao);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateSugestaoDTO updateDto, CancellationToken cancellationToken)
    {
        try
        {
            await _sugestaoService.UpdateAsync(id, updateDto, cancellationToken);
            _logger.LogInformation("Sugestão atualizada: {SugestaoId}", id);
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
        await _sugestaoService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Sugestão excluída: {SugestaoId}", id);
        return NoContent();
    }
}

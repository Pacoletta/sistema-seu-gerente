using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReceitasController : ControllerBase
{
    private readonly ReceitaService _receitaService;
    private readonly ILogger<ReceitasController> _logger;

    public ReceitasController(ReceitaService receitaService, ILogger<ReceitasController> logger)
    {
        _receitaService = receitaService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReceitaDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var receitas = await _receitaService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
        return Ok(receitas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReceitaDTO>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var receita = await _receitaService.GetByIdAsync(id, cancellationToken);
        if (receita == null)
        {
            return NotFound(new { message = "Receita não encontrada" });
        }
        return Ok(receita);
    }

    [HttpPost]
    public async Task<ActionResult<ReceitaDTO>> Create([FromBody] CreateReceitaDTO createDto, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var receita = await _receitaService.CreateAsync(createDto, usuarioId, cancellationToken);

        _logger.LogInformation("Receita criada: {ReceitaId}", receita.Id);
        return CreatedAtAction(nameof(GetById), new { id = receita.Id }, receita);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateReceitaDTO updateDto, CancellationToken cancellationToken)
    {
        try
        {
            await _receitaService.UpdateAsync(id, updateDto, cancellationToken);
            _logger.LogInformation("Receita atualizada: {ReceitaId}", id);
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
        await _receitaService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Receita excluída: {ReceitaId}", id);
        return NoContent();
    }
}

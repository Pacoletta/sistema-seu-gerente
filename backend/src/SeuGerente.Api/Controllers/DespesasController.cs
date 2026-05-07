using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DespesasController : ControllerBase
{
    private readonly DespesaService _despesaService;
    private readonly ILogger<DespesasController> _logger;

    public DespesasController(DespesaService despesaService, ILogger<DespesasController> logger)
    {
        _despesaService = despesaService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Lista todas as despesas do usuário autenticado
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DespesaDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var despesas = await _despesaService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
        return Ok(despesas);
    }

    /// <summary>
    /// Lista despesas por mês/ano
    /// </summary>
    [HttpGet("mes/{mesAno}")]
    public async Task<ActionResult<IEnumerable<DespesaDTO>>> GetByMesAno(string mesAno, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var despesas = await _despesaService.GetByMesAnoAsync(mesAno, usuarioId, cancellationToken);
        return Ok(despesas);
    }

    /// <summary>
    /// Busca despesa por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DespesaDTO>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var despesa = await _despesaService.GetByIdAsync(id, cancellationToken);
        if (despesa == null)
        {
            return NotFound(new { message = "Despesa não encontrada" });
        }
        return Ok(despesa);
    }

    /// <summary>
    /// Cria nova despesa
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DespesaDTO>> Create([FromBody] CreateDespesaDTO createDto, CancellationToken cancellationToken)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            
            _logger.LogInformation("📝 Criando despesa - Descricao: {Descricao}, TipoDivisao: {TipoDivisao}, Status: {Status}, ValoresPorAp: {ValoresPorAp}", 
                createDto.Descricao, 
                createDto.TipoDivisao, 
                createDto.Status,
                createDto.ValoresPorAp != null ? string.Join(",", createDto.ValoresPorAp) : "null");
            
            var despesa = await _despesaService.CreateAsync(createDto, usuarioId, cancellationToken);
            
            _logger.LogInformation("✅ Despesa criada: {DespesaId} - {Descricao}", despesa.Id, despesa.Descricao);
            return CreatedAtAction(nameof(GetById), new { id = despesa.Id }, despesa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "⚠️ Erro ao criar despesa: {Message}", ex.Message);
            return StatusCode(500, new 
            { 
                message = "Erro ao criar despesa",
                error = ex.Message,
                innerError = ex.InnerException?.Message
            });
        }
    }

    /// <summary>
    /// Atualiza despesa existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateDespesaDTO updateDto, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("📝 Atualizando despesa {DespesaId} - Status: {Status}", id, updateDto.Status);
            await _despesaService.UpdateAsync(id, updateDto, cancellationToken);
            _logger.LogInformation("✅ Despesa atualizada: {DespesaId}", id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("⚠️ Despesa não encontrada: {DespesaId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao atualizar despesa {DespesaId}: {Message}", id, ex.Message);
            return StatusCode(500, new 
            { 
                message = "Erro ao atualizar despesa",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Exclui despesa
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _despesaService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Despesa excluída: {DespesaId}", id);
        return NoContent();
    }
}

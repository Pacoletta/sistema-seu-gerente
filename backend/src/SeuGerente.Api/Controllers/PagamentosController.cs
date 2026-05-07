using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PagamentosController : ControllerBase
{
    private readonly PagamentoService _pagamentoService;
    private readonly ILogger<PagamentosController> _logger;

    public PagamentosController(PagamentoService pagamentoService, ILogger<PagamentosController> logger)
    {
        _pagamentoService = pagamentoService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Lista todos os pagamentos do usuário autenticado
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PagamentoDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var pagamentos = await _pagamentoService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
        return Ok(pagamentos);
    }

    /// <summary>
    /// Lista pagamentos por mês/ano
    /// </summary>
    [HttpGet("mes/{mesAno}")]
    public async Task<ActionResult<IEnumerable<PagamentoDTO>>> GetByMesAno(string mesAno, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var pagamentos = await _pagamentoService.GetByMesAnoAsync(mesAno, usuarioId, cancellationToken);
        return Ok(pagamentos);
    }

    /// <summary>
    /// Busca pagamento por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PagamentoDTO>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var pagamento = await _pagamentoService.GetByIdAsync(id, cancellationToken);
        if (pagamento == null)
        {
            return NotFound(new { message = "Pagamento não encontrado" });
        }
        return Ok(pagamento);
    }

    /// <summary>
    /// Cria novo pagamento
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PagamentoDTO>> Create([FromBody] CreatePagamentoDTO createDto, CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        
        _logger.LogInformation("📝 Criando pagamento - MoradorId: {MoradorId}, Valor: {Valor}, MesAno: {MesAno}, DataVencimento: {DataVencimento}", 
            createDto.MoradorId, createDto.Valor, createDto.MesAno, createDto.DataVencimento);
        
        try
        {
            var pagamento = await _pagamentoService.CreateAsync(createDto, usuarioId, cancellationToken);
            
            _logger.LogInformation("✅ Pagamento criado: {PagamentoId} - Morador {MoradorId}", pagamento.Id, pagamento.MoradorId);
            return CreatedAtAction(nameof(GetById), new { id = pagamento.Id }, pagamento);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("⚠️ {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza pagamento (campos arbitrários)
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdatePagamentoDTO updateDto, CancellationToken cancellationToken)
    {
        try
        {
            await _pagamentoService.UpdateAsync(id, updateDto, cancellationToken);
            _logger.LogInformation("Pagamento atualizado: {PagamentoId}", id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza status do pagamento
    /// </summary>
    [HttpPut("{id}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdatePagamentoStatusDTO statusDto, CancellationToken cancellationToken)
    {
        try
        {
            await _pagamentoService.UpdateStatusAsync(id, statusDto, cancellationToken);
            _logger.LogInformation("Status do pagamento atualizado: {PagamentoId} - {Status}", id, statusDto.Status);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gera pagamentos mensais para todos os moradores
    /// </summary>
    [HttpPost("gerar-mensais")]
    public async Task<ActionResult<IEnumerable<PagamentoDTO>>> GerarPagamentosMensais(
        [FromBody] GerarPagamentosMensaisDTO dto, 
        CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var pagamentos = await _pagamentoService.GerarPagamentosMensaisAsync(dto, usuarioId, cancellationToken);
        
        _logger.LogInformation("Pagamentos mensais gerados: {Quantidade} para o mês {MesAno}", 
            pagamentos.Count(), dto.MesAno);
        
        return Ok(pagamentos);
    }

    /// <summary>
    /// Exclui pagamento
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _pagamentoService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Pagamento excluído: {PagamentoId}", id);
        return NoContent();
    }
}

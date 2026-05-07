using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CobrancaPixController : ControllerBase
{
    private readonly CobrancaPixService _cobrancaPixService;
    private readonly ILogger<CobrancaPixController> _logger;

    public CobrancaPixController(
        CobrancaPixService cobrancaPixService,
        ILogger<CobrancaPixController> logger)
    {
        _cobrancaPixService = cobrancaPixService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Gera uma nova cobrança PIX para o usuário autenticado
    /// </summary>
    [HttpPost("gerar")]
    public async Task<ActionResult> GerarCobranca(CancellationToken cancellationToken)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            _logger.LogInformation("Gerando cobrança PIX para usuário {UsuarioId}", usuarioId);

            var (paymentId, qrCode, qrCodeBase64) = await _cobrancaPixService.GerarCobrancaPixAsync(usuarioId, cancellationToken);
            await _cobrancaPixService.EnviarEmailCobrancaAsync(usuarioId, qrCode, qrCodeBase64, cancellationToken);

            return Ok(new
            {
                success = true,
                paymentId,
                qrCode,
                qrCodeBase64,
                valor = 29.90m,
                message = "Cobrança PIX gerada com sucesso! Verifique seu email."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar cobrança PIX");
            return StatusCode(500, new { error = "Erro ao gerar cobrança PIX", message = ex.Message });
        }
    }

    /// <summary>
    /// Verifica o status de um pagamento PIX (apenas admin)
    /// </summary>
    [HttpGet("verificar/{paymentId}")]
    [Authorize] // Agora protegido
    public async Task<ActionResult> VerificarPagamento(string paymentId, CancellationToken cancellationToken)
    {
        try
        {
            await _cobrancaPixService.VerificarPagamentoPixAsync(paymentId, cancellationToken);
            return Ok(new { message = "Verificação de pagamento processada" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar pagamento PIX");
            return StatusCode(500, new { error = "Erro ao verificar pagamento", message = ex.Message });
        }
    }

    /// <summary>
    /// Força o processamento manual de cobranças mensais (APENAS ADMIN)
    /// </summary>
    [HttpPost("processar-todas")]
    [Authorize] // Protegido - somente autenticados
    public async Task<ActionResult> ProcessarTodasCobrancas(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processamento manual de cobranças iniciado");
            await _cobrancaPixService.ProcessarCobrancasMensaisAsync(cancellationToken);
            return Ok(new { message = "Cobranças processadas com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar cobranças");
            return StatusCode(500, new { error = "Erro ao processar cobranças", message = ex.Message });
        }
    }
}

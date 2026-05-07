using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssinaturaController : ControllerBase
{
    private readonly ILogger<AssinaturaController> _logger;
    private readonly SeuGerente.Application.Services.CadastroService _cadastroService;

    public AssinaturaController(
        ILogger<AssinaturaController> logger,
        SeuGerente.Application.Services.CadastroService cadastroService)
    {
        _logger = logger;
        _cadastroService = cadastroService;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Processa pagamento de assinatura
    /// </summary>
    [HttpPost("processar")]
    public async Task<ActionResult> ProcessarPagamento([FromBody] ProcessarPagamentoRequest request)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            _logger.LogInformation("Processando pagamento para usuário {UsuarioId}", usuarioId);

            // TODO: Implementar lógica de processamento com Mercado Pago
            // Por enquanto, retornando sucesso simulado e ativando assinatura

            // Ativar assinatura automaticamente após pagamento aprovado
            await _cadastroService.AtivarAssinaturaAsync(usuarioId);
            _logger.LogInformation("✅ Assinatura ativada para usuário {UsuarioId}", usuarioId);

            var response = new
            {
                success = true,
                payment = new
                {
                    id = Guid.NewGuid().ToString(),
                    status = "approved",
                    statusDetail = "accredited",
                    amount = request.Amount,
                    transactionAmount = request.Amount,
                    paymentMethodId = request.PaymentMethodId ?? "credit_card",
                    description = "Assinatura Premium - Seu Gerente",
                    merchantOrderId = Guid.NewGuid().ToString()
                },
                subscription = new
                {
                    id = Guid.NewGuid().ToString(),
                    status = "active",
                    planId = request.PlanId,
                    startDate = DateTime.UtcNow,
                    nextBillingDate = DateTime.UtcNow.AddMonths(1)
                }
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar pagamento");
            return StatusCode(500, new { error = "Erro ao processar pagamento", message = ex.Message });
        }
    }

    /// <summary>
    /// Lista cartões salvos do usuário
    /// </summary>
    [HttpGet("cartoes-salvos")]
    public async Task<ActionResult> GetCartoesSalvos([FromQuery] Guid userId)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            _logger.LogInformation("Buscando cartões salvos para usuário {UsuarioId}", usuarioId);

            // TODO: Implementar lógica para buscar cartões salvos
            // Por enquanto, retornando lista vazia

            return Ok(new { cards = new List<object>() });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cartões salvos");
            return StatusCode(500, new { error = "Erro ao buscar cartões salvos", message = ex.Message });
        }
    }
}

public class ProcessarPagamentoRequest
{
    public decimal Amount { get; set; }
    public string? PaymentMethodId { get; set; }
    public string? Token { get; set; }
    public string? PlanId { get; set; }
    public string? Email { get; set; }
    public CardHolderInfo? CardHolder { get; set; }
}

public class CardHolderInfo
{
    public string? Name { get; set; }
    public IdentificationInfo? Identification { get; set; }
}

public class IdentificationInfo
{
    public string? Type { get; set; }
    public string? Number { get; set; }
}

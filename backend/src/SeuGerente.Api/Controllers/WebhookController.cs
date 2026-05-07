using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.Interfaces;
using SeuGerente.Application.Services;
using SeuGerente.Domain.Interfaces;
using System.Text.Json;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhookController : ControllerBase
{
    private readonly IMercadoPagoService _mercadoPagoService;
    private readonly ILogger<WebhookController> _logger;
    private readonly CadastroService _cadastroService;
    private readonly ICadastroRepository _cadastroRepository;
    private readonly CobrancaPixService _cobrancaPixService;

    public WebhookController(
        IMercadoPagoService mercadoPagoService,
        ILogger<WebhookController> logger,
        CadastroService cadastroService,
        ICadastroRepository cadastroRepository,
        CobrancaPixService cobrancaPixService)
    {
        _mercadoPagoService = mercadoPagoService;
        _logger = logger;
        _cadastroService = cadastroService;
        _cadastroRepository = cadastroRepository;
        _cobrancaPixService = cobrancaPixService;
    }

    /// <summary>
    /// Webhook para receber notificações do Mercado Pago
    /// </summary>
    [HttpPost("mercadopago")]
    [AllowAnonymous]
    public async Task<IActionResult> MercadoPago([FromBody] object payload, CancellationToken cancellationToken)
    {
        try
        {
            var payloadString = payload.ToString() ?? string.Empty;
            _logger.LogInformation("Webhook Mercado Pago recebido: {Payload}", payloadString);
            
            await _mercadoPagoService.ProcessWebhookAsync(payloadString, cancellationToken);
            
            // Tentar extrair informações do pagamento para ativar assinatura
            try
            {
                var payloadJson = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(payloadString);
                if (payloadJson != null)
                {
                    // Verificar se é notificação de pagamento
                    string? type = payloadJson.ContainsKey("type") ? payloadJson["type"].GetString() : null;
                    string? action = payloadJson.ContainsKey("action") ? payloadJson["action"].GetString() : null;
                    
                    if (type == "payment" && (action == "payment.updated" || action == "payment.created"))
                    {
                        // Extrair ID do pagamento
                        string? paymentId = null;
                        if (payloadJson.ContainsKey("data") && payloadJson["data"].ValueKind == JsonValueKind.Object)
                        {
                            var data = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(payloadJson["data"].GetRawText());
                            paymentId = data?.ContainsKey("id") == true ? data["id"].GetString() : null;
                        }

                        if (!string.IsNullOrEmpty(paymentId))
                        {
                            _logger.LogInformation("🔍 Processando pagamento PIX {PaymentId}", paymentId);
                            
                            // Verificar se o pagamento foi aprovado e ativar assinatura
                            await _cobrancaPixService.VerificarPagamentoPixAsync(paymentId, cancellationToken);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Erro ao processar ativação de assinatura via webhook (não crítico)");
            }
            
            return Ok(new { message = "Webhook processado" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar webhook Mercado Pago");
            return StatusCode(500, new { message = "Erro ao processar webhook" });
        }
    }

    /// <summary>
    /// Health check do webhook
    /// </summary>
    [HttpGet("health")]
    [AllowAnonymous]
    public IActionResult Health()
    {
        return Ok(new { status = "Webhook endpoint ativo", timestamp = DateTime.UtcNow });
    }
}

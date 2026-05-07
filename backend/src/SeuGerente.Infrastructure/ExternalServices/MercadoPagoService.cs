using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Interfaces;
using SeuGerente.Infrastructure.Common;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace SeuGerente.Infrastructure.ExternalServices;

/// <summary>
/// Serviço de integração com Mercado Pago
/// </summary>
public class MercadoPagoService : IMercadoPagoService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<MercadoPagoService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _accessToken;
    private readonly string _publicKey;
    private readonly string _baseUrl;

    public MercadoPagoService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<MercadoPagoService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        
        // GetValue retorna string.Empty (não null) — usar IsNullOrEmpty para o fallback
        var mpBaseUrl = ConfigurationHelper.GetValue(configuration,
            "MercadoPago:BaseUrl",
            "MERCADO_PAGO_BASE_URL",
            "MercadoPago__BaseUrl");
        _baseUrl = string.IsNullOrEmpty(mpBaseUrl) ? "https://api.mercadopago.com" : mpBaseUrl;
        
        _accessToken = ConfigurationHelper.GetRequiredValue(configuration,
            "MercadoPago:AccessToken",
            "MERCADO_PAGO_ACCESS_TOKEN",
            "MercadoPago__AccessToken");
        
        _publicKey = ConfigurationHelper.GetRequiredValue(configuration,
            "MercadoPago:PublicKey",
            "MERCADO_PAGO_PUBLIC_KEY",
            "MercadoPago__PublicKey");

        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_accessToken}");
    }

    public async Task<string> CreatePreferenceAsync(CreatePagamentoDTO pagamento, CancellationToken cancellationToken = default)
    {
        try
        {
            var apiUrl = _configuration["ApiUrl"] ?? "http://localhost:5000";
            
            var preference = new
            {
                items = new[]
                {
                    new
                    {
                        title = $"Pagamento - {pagamento.MesAno}",
                        quantity = 1,
                        currency_id = "BRL",
                        unit_price = pagamento.Valor
                    }
                },
                back_urls = new
                {
                    success = $"{apiUrl}/api/pagamento/success",
                    failure = $"{apiUrl}/api/pagamento/failure",
                    pending = $"{apiUrl}/api/pagamento/pending"
                },
                auto_return = "approved",
                notification_url = $"{apiUrl}/api/webhook/mercadopago",
                external_reference = Guid.NewGuid().ToString()
            };

            var response = await _httpClient.PostAsJsonAsync("/checkout/preferences", preference, cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            var preferenceId = result.GetProperty("id").GetString();

            _logger.LogInformation("Preferência criada no Mercado Pago: {PreferenceId}", preferenceId);
            return preferenceId ?? throw new Exception("PreferenceId não retornado");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar preferência no Mercado Pago");
            throw;
        }
    }

    public async Task ProcessWebhookAsync(string payload, CancellationToken cancellationToken = default)
    {
        try
        {
            var webhookData = JsonSerializer.Deserialize<JsonElement>(payload);
            
            if (webhookData.TryGetProperty("type", out var typeProperty))
            {
                var type = typeProperty.GetString();
                
                if (type == "payment")
                {
                    var paymentId = webhookData.GetProperty("data").GetProperty("id").GetString();
                    _logger.LogInformation("Webhook de pagamento recebido: {PaymentId}", paymentId);
                    
                    // Aqui você processaria o pagamento
                    // Poderia chamar outro serviço para atualizar o status no banco
                }
            }

            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar webhook do Mercado Pago");
            throw;
        }
    }

    public async Task<object> GetPaymentInfoAsync(string paymentId, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/v1/payments/{paymentId}", cancellationToken);
            response.EnsureSuccessStatusCode();

            var paymentInfo = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            
            _logger.LogInformation("Informações do pagamento {PaymentId} obtidas", paymentId);
            return paymentInfo;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar informações do pagamento {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<bool> RefundPaymentAsync(string paymentId, decimal amount, CancellationToken cancellationToken = default)
    {
        try
        {
            var refundData = new { amount };
            var response = await _httpClient.PostAsJsonAsync($"/v1/payments/{paymentId}/refunds", refundData, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Reembolso processado para pagamento {PaymentId}: R$ {Amount}", paymentId, amount);
                return true;
            }

            _logger.LogWarning("Falha ao processar reembolso para pagamento {PaymentId}", paymentId);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar reembolso do pagamento {PaymentId}", paymentId);
            return false;
        }
    }

    /// <summary>
    /// Cria um pagamento PIX para cobrança mensal
    /// </summary>
    public async Task<(string PaymentId, string QrCode, string QrCodeBase64)> CreatePixPaymentAsync(
        string email,
        string nome,
        decimal valor,
        string descricao,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var paymentData = new
            {
                transaction_amount = valor,
                description = descricao,
                payment_method_id = "pix",
                payer = new
                {
                    email = email,
                    first_name = nome.Split(' ')[0],
                    last_name = nome.Contains(' ') ? string.Join(" ", nome.Split(' ').Skip(1)) : ""
                }
            };

            var response = await _httpClient.PostAsJsonAsync("/v1/payments", paymentData, cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            
            var paymentId = result.GetProperty("id").GetInt64().ToString();
            var qrCode = result.GetProperty("point_of_interaction")
                .GetProperty("transaction_data")
                .GetProperty("qr_code").GetString() ?? "";
            var qrCodeBase64 = result.GetProperty("point_of_interaction")
                .GetProperty("transaction_data")
                .GetProperty("qr_code_base64").GetString() ?? "";

            _logger.LogInformation("PIX criado - PaymentId: {PaymentId}, Email: {Email}, Valor: {Valor}", 
                paymentId, email, valor);

            return (paymentId, qrCode, qrCodeBase64);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar pagamento PIX para {Email}", email);
            throw;
        }
    }

    /// <summary>
    /// Verifica o status de um pagamento PIX
    /// </summary>
    public async Task<(string Status, DateTime? DateApproved)> GetPixPaymentStatusAsync(
        string paymentId, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/v1/payments/{paymentId}", cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            
            var status = result.GetProperty("status").GetString() ?? "unknown";
            DateTime? dateApproved = null;

            if (result.TryGetProperty("date_approved", out var dateApprovedProp) && 
                dateApprovedProp.ValueKind != JsonValueKind.Null)
            {
                dateApproved = dateApprovedProp.GetDateTime();
            }

            return (status, dateApproved);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar status do PIX {PaymentId}", paymentId);
            throw;
        }
    }
}

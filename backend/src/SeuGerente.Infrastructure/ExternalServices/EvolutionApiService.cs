using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.Interfaces;

namespace SeuGerente.Infrastructure.ExternalServices;

/// <summary>
/// Serviço de envio via Evolution Go API.
/// Cada instância se autentica com seu próprio token no header "apikey".
/// Endpoints sem instanceName no path — o token identifica a instância.
/// </summary>
public class EvolutionApiService : IWhatsAppService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EvolutionApiService> _logger;
    private readonly string _baseUrl;

    public EvolutionApiService(HttpClient httpClient, IConfiguration configuration, ILogger<EvolutionApiService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _baseUrl = (configuration["EvolutionApi:BaseUrl"]
            ?? Environment.GetEnvironmentVariable("EVOLUTION_API_BASE_URL")
            ?? "https://evogo.sistemaseugerente.com.br").TrimEnd('/');

        var instanceToken = configuration["EvolutionApi:ApiKey"]
            ?? Environment.GetEnvironmentVariable("EVOLUTION_API_KEY")
            ?? "";

        if (!string.IsNullOrEmpty(instanceToken))
            _httpClient.DefaultRequestHeaders.Add("apikey", instanceToken);
        else
            logger.LogWarning("EvolutionApi:ApiKey não configurado — envio automático de WhatsApp desabilitado");
    }

    private static string FormatPhone(string phone)
    {
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        if (digits.Length == 11 || digits.Length == 10) digits = "55" + digits;
        return digits;
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string path, object? body = null)
    {
        var request = new HttpRequestMessage(method, $"{_baseUrl}{path}");
        if (body != null)
            request.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
        return request;
    }

    public async Task<bool> SendMessageAsync(string to, string message, CancellationToken cancellationToken = default)
    {
        try
        {
            var phone = FormatPhone(to);
            using var req = CreateRequest(HttpMethod.Post, "/send/text", new
            {
                number = phone,
                text = message
            });

            var res = await _httpClient.SendAsync(req, cancellationToken);
            if (!res.IsSuccessStatusCode)
            {
                var error = await res.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Evolution Go sendText erro: {Status} - {Error}", res.StatusCode, error);
                return false;
            }

            _logger.LogInformation("WhatsApp enviado para {Phone}", phone);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar WhatsApp para {Phone}", to);
            return false;
        }
    }

    public async Task<bool> SendCobrancaAsync(
        string to,
        string nomeDevedor,
        decimal valor,
        DateTime vencimento,
        CancellationToken cancellationToken = default)
    {
        var mensagem = $"Olá, *{nomeDevedor}*! 👋\n\n" +
                       $"Aviso de vencimento do condomínio referente ao mês de *{DateTime.Now:MMMM/yyyy}*.\n\n" +
                       $"💰 *Valor:* R$ {valor:N2}\n" +
                       $"📅 *Vencimento:* {vencimento:dd/MM/yyyy}\n\n" +
                       "Em caso de dúvidas, entre em contato com a administração.";

        return await SendMessageAsync(to, mensagem, cancellationToken);
    }

    public async Task<bool> SendDocumentAsync(
        string to,
        string documentUrl,
        string caption,
        string filename,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var phone = FormatPhone(to);
            using var req = CreateRequest(HttpMethod.Post, "/send/media", new
            {
                number = phone,
                media = documentUrl,
                mimetype = "application/pdf",
                fileName = filename,
                caption = caption
            });

            var res = await _httpClient.SendAsync(req, cancellationToken);
            if (!res.IsSuccessStatusCode)
            {
                var error = await res.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Evolution Go sendMedia erro: {Status} - {Error}", res.StatusCode, error);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar documento WhatsApp para {Phone}", to);
            return false;
        }
    }

    public async Task<bool> SendBase64DocumentAsync(
        string phoneNumber,
        string base64Data,
        string fileName,
        string caption,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var phone = FormatPhone(phoneNumber);
            var media = base64Data.StartsWith("data:") ? base64Data : $"data:application/pdf;base64,{base64Data}";

            using var req = CreateRequest(HttpMethod.Post, "/send/media", new
            {
                number = phone,
                media = media,
                mimetype = "application/pdf",
                fileName = fileName,
                caption = caption
            });

            var res = await _httpClient.SendAsync(req, cancellationToken);
            if (!res.IsSuccessStatusCode)
            {
                var error = await res.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Evolution Go sendBase64 erro: {Status} - {Error}", res.StatusCode, error);
                return false;
            }

            _logger.LogInformation("PDF enviado via WhatsApp para {Phone}", phone);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar PDF WhatsApp para {Phone}", phoneNumber);
            return false;
        }
    }

    public async Task<bool> GetInstanceStatusAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            using var req = CreateRequest(HttpMethod.Get, "/instance/status");
            var res = await _httpClient.SendAsync(req, cancellationToken);
            if (res.IsSuccessStatusCode)
            {
                _logger.LogInformation("Evolution Go instância conectada");
                return true;
            }
            _logger.LogWarning("Evolution Go instância offline: {Status}", res.StatusCode);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar status Evolution Go");
            return false;
        }
    }
}

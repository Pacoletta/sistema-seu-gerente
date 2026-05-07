using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.Interfaces;

namespace SeuGerente.Infrastructure.ExternalServices;

public class WhatsAppMetaService : IWhatsAppService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<WhatsAppMetaService> _logger;
    private readonly string _phoneNumberId;
    private readonly string _accessToken;
    private readonly string _apiVersion;

    public WhatsAppMetaService(HttpClient httpClient, IConfiguration configuration, ILogger<WhatsAppMetaService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _phoneNumberId = configuration["WhatsApp:PhoneNumberId"]
            ?? Environment.GetEnvironmentVariable("WHATSAPP_PHONE_NUMBER_ID")
            ?? throw new InvalidOperationException("WhatsApp:PhoneNumberId não configurado");

        _accessToken = configuration["WhatsApp:AccessToken"]
            ?? Environment.GetEnvironmentVariable("WHATSAPP_ACCESS_TOKEN")
            ?? throw new InvalidOperationException("WhatsApp:AccessToken não configurado");

        _apiVersion = configuration["WhatsApp:ApiVersion"]
            ?? Environment.GetEnvironmentVariable("WHATSAPP_API_VERSION")
            ?? "v21.0";
    }

    private string MessagesUrl => $"https://graph.facebook.com/{_apiVersion}/{_phoneNumberId}/messages";

    private static string FormatPhone(string phone)
    {
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        // Adiciona DDI Brasil se não tiver
        if (digits.Length == 11) digits = "55" + digits;
        if (digits.Length == 10) digits = "55" + digits;
        return digits;
    }

    private async Task<bool> PostAsync(object payload, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, MessagesUrl);
        request.Headers.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken);
        request.Content = new StringContent(
            JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(ct);
            _logger.LogError("WhatsApp Meta API erro: {Status} - {Error}", response.StatusCode, error);
            return false;
        }

        return true;
    }

    public Task<bool> SendMessageAsync(string to, string message, CancellationToken cancellationToken = default)
    {
        var payload = new
        {
            messaging_product = "whatsapp",
            to = FormatPhone(to),
            type = "text",
            text = new { body = message }
        };
        return PostAsync(payload, cancellationToken);
    }

    public Task<bool> SendCobrancaAsync(string to, string nomeDevedor, decimal valor, DateTime vencimento, CancellationToken cancellationToken = default)
    {
        var mensagem = $"Olá, {nomeDevedor}! 🏠\n\n" +
                       $"Lembramos que você tem uma cobrança pendente:\n\n" +
                       $"💰 Valor: R$ {valor:F2}\n" +
                       $"📅 Vencimento: {vencimento:dd/MM/yyyy}\n\n" +
                       $"Qualquer dúvida, entre em contato conosco.";
        return SendMessageAsync(to, mensagem, cancellationToken);
    }

    public Task<bool> SendDocumentAsync(string to, string documentUrl, string caption, string filename, CancellationToken cancellationToken = default)
    {
        var payload = new
        {
            messaging_product = "whatsapp",
            to = FormatPhone(to),
            type = "document",
            document = new { link = documentUrl, caption, filename }
        };
        return PostAsync(payload, cancellationToken);
    }

    public async Task<bool> SendBase64DocumentAsync(string phoneNumber, string base64Data, string fileName, string caption, CancellationToken cancellationToken = default)
    {
        // A Meta API exige upload de mídia primeiro para obter o media_id
        var uploadUrl = $"https://graph.facebook.com/{_apiVersion}/{_phoneNumberId}/media";
        var bytes = Convert.FromBase64String(base64Data);

        using var uploadRequest = new HttpRequestMessage(HttpMethod.Post, uploadUrl);
        uploadRequest.Headers.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken);

        using var form = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(bytes);
        fileContent.Headers.ContentType =
            new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
        form.Add(new StringContent("whatsapp"), "messaging_product");
        form.Add(fileContent, "file", fileName);
        form.Add(new StringContent("application/pdf"), "type");
        uploadRequest.Content = form;

        var uploadResponse = await _httpClient.SendAsync(uploadRequest, cancellationToken);
        if (!uploadResponse.IsSuccessStatusCode)
        {
            var err = await uploadResponse.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Falha ao fazer upload de mídia no WhatsApp: {Error}", err);
            return false;
        }

        var uploadJson = await uploadResponse.Content.ReadAsStringAsync(cancellationToken);
        using var doc = JsonDocument.Parse(uploadJson);
        var mediaId = doc.RootElement.GetProperty("id").GetString();

        var payload = new
        {
            messaging_product = "whatsapp",
            to = FormatPhone(phoneNumber),
            type = "document",
            document = new { id = mediaId, caption, filename = fileName }
        };
        return await PostAsync(payload, cancellationToken);
    }

    public Task<bool> GetInstanceStatusAsync(CancellationToken cancellationToken = default)
    {
        var configured = !string.IsNullOrEmpty(_accessToken) && !string.IsNullOrEmpty(_phoneNumberId);
        return Task.FromResult(configured);
    }
}

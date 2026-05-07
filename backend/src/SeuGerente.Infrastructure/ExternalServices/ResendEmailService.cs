using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.Interfaces;
using SeuGerente.Infrastructure.Common;
using SeuGerente.Infrastructure.EmailTemplates;

namespace SeuGerente.Infrastructure.ExternalServices;

/// <summary>
/// Serviço de envio de emails via Resend.com API
/// </summary>
public class ResendEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ResendEmailService> _logger;
    private readonly string _baseUrl;
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public ResendEmailService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<ResendEmailService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        // GetValue retorna string.Empty (não null) — usar IsNullOrEmpty para o fallback
        var resendBaseUrl = ConfigurationHelper.GetValue(configuration,
            "Resend:BaseUrl",
            "RESEND_BASE_URL",
            "Resend__BaseUrl");
        _baseUrl = string.IsNullOrEmpty(resendBaseUrl) ? "https://api.resend.com" : resendBaseUrl;

        _apiKey = ConfigurationHelper.GetRequiredValue(configuration,
            "Resend:ApiKey",
            "RESEND_API_KEY",
            "Resend__ApiKey");
        
        _fromEmail = ConfigurationHelper.GetValue(configuration,
            "Resend:FromEmail",
            "RESEND_FROM_EMAIL",
            "Resend__FromEmail");
        if (string.IsNullOrEmpty(_fromEmail))
            logger.LogWarning("RESEND_FROM_EMAIL não configurado — envio de emails desabilitado");
        
        var fromNameRaw = ConfigurationHelper.GetValue(configuration,
            "Resend:FromName",
            "RESEND_FROM_NAME",
            "Resend__FromName");
        _fromName = string.IsNullOrEmpty(fromNameRaw) ? "Sistema Seu Gerente" : fromNameRaw;

        // Configurar HttpClient
        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
    }

    public async Task<bool> EnviarRelatorioAsync(
        string destinatario,
        string nomeDestinatario,
        byte[] pdfRelatorio,
        CancellationToken cancellationToken = default)
    {
        var mesAtual = DateTime.Now.ToString("MMMM/yyyy");
        var assunto = $"📊 Relatório Mensal - {mesAtual}";
        var corpo = HtmlTemplates.GetRelatorioTemplate(nomeDestinatario, mesAtual);

        return await EnviarComAnexoAsync(
            destinatario,
            assunto,
            corpo,
            pdfRelatorio,
            $"relatorio-{DateTime.Now:yyyy-MM}.pdf",
            cancellationToken);
    }

    public async Task<bool> EnviarCobrancaAsync(
        string destinatario,
        string nomeDevedor,
        decimal valor,
        DateTime vencimento,
        CancellationToken cancellationToken = default)
    {
        var vencido = vencimento < DateTime.Now;
        var assunto = vencido ? "⚠️ Cobrança Vencida - Sistema Seu Gerente" : "💰 Cobrança Pendente - Sistema Seu Gerente";
        var corpo = HtmlTemplates.GetCobrancaTemplate(nomeDevedor, valor, vencimento);

        return await EnviarNotificacaoAsync(destinatario, assunto, corpo, cancellationToken);
    }

    public async Task<bool> EnviarCobrancaComPdfAsync(
        string destinatario,
        string nomeDevedor,
        byte[] pdfCobranca,
        DateTime vencimento,
        decimal valorTotal,
        string? chavePix = null,
        string? pixNomeBeneficiario = null,
        CancellationToken cancellationToken = default)
    {
        var mesAtual = DateTime.Now.ToString("MMMM/yyyy");
        var assunto = $"🔔 Aviso de Vencimento - {mesAtual}";

        var pixInfo = "";
        if (!string.IsNullOrWhiteSpace(chavePix))
        {
            pixInfo = $@"
                    <div style='background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-top: 15px;'>
                        <p style='font-size: 13px; color: #1e40af; font-weight: bold; margin: 0 0 8px 0;'>💳 Dados para pagamento via PIX</p>
                        <p style='font-size: 15px; color: #1d4ed8; margin: 4px 0;'><strong>Chave:</strong> {chavePix}</p>
                        {(!string.IsNullOrWhiteSpace(pixNomeBeneficiario) ? $"<p style='font-size: 15px; color: #1d4ed8; margin: 4px 0;'><strong>Favorecido:</strong> {pixNomeBeneficiario}</p>" : "")}
                    </div>";
        }

        var corpo = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;'>
                <div style='background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 30px; border-radius: 12px 12px 0 0; text-align: center;'>
                    <h1 style='color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;'>Aviso de Vencimento</h1>
                    <p style='color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;'>{mesAtual}</p>
                </div>
                <div style='background-color: white; padding: 32px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>
                    <p style='font-size: 17px; color: #1e293b; margin: 0 0 8px;'>Olá, <strong>{nomeDevedor}</strong>!</p>
                    <p style='font-size: 15px; color: #64748b; margin: 0 0 24px;'>Segue abaixo o resumo do seu condomínio referente a <strong>{mesAtual}</strong>. O relatório detalhado está anexado a este email.</p>
                    <div style='background-color: #f1f5f9; border-radius: 10px; padding: 20px 24px; margin-bottom: 20px;'>
                        <div style='display: flex; justify-content: space-between; margin-bottom: 10px;'>
                            <span style='font-size: 14px; color: #64748b;'>Valor total</span>
                            <span style='font-size: 22px; font-weight: 700; color: #059669;'>R$ {valorTotal:N2}</span>
                        </div>
                        <div style='border-top: 1px solid #e2e8f0; padding-top: 10px;'>
                            <span style='font-size: 14px; color: #64748b;'>Vencimento: </span>
                            <span style='font-size: 14px; font-weight: 600; color: #dc2626;'>{vencimento:dd/MM/yyyy}</span>
                        </div>
                        {pixInfo}
                    </div>
                    <p style='font-size: 14px; color: #94a3b8; margin-top: 28px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;'>Em caso de dúvidas, entre em contato com a administração do condomínio.<br>Esta é uma mensagem automática.</p>
                </div>
            </div>";

        return await EnviarComAnexoAsync(
            destinatario,
            assunto,
            corpo,
            pdfCobranca,
            $"relatorio-condominio-{DateTime.Now:yyyy-MM}.pdf",
            cancellationToken);
    }

    public async Task<bool> EnviarNotificacaoAsync(
        string destinatario,
        string assunto,
        string corpo,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(_fromEmail))
        {
            _logger.LogWarning("Email não enviado para {Destinatario} — RESEND_FROM_EMAIL não configurado", destinatario);
            return false;
        }

        try
        {
            var request = new ResendEmailRequest
            {
                From = $"{_fromName} <{_fromEmail}>",
                To = new[] { destinatario },
                Subject = assunto,
                Html = corpo
            };

            var response = await _httpClient.PostAsJsonAsync("/emails", request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("✅ Email enviado via Resend para {Destinatario}: {Assunto}", destinatario, assunto);
                return true;
            }

            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("❌ Erro ao enviar email via Resend: {StatusCode} - {Error}", response.StatusCode, errorContent);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Exceção ao enviar email via Resend para {Destinatario}", destinatario);
            return false;
        }
    }

    public async Task<bool> EnviarResetPasswordAsync(
        string destinatario,
        string token,
        CancellationToken cancellationToken = default)
    {
        var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
        var resetLink = $"{frontendUrl}/nova-senha?token={token}";

        var assunto = "🔐 Recuperação de Senha - Sistema Seu Gerente";
        var corpo = HtmlTemplates.GetResetPasswordTemplate(resetLink);

        return await EnviarNotificacaoAsync(destinatario, assunto, corpo, cancellationToken);
    }

    public async Task<bool> EnviarComAnexoAsync(
        string destinatario,
        string assunto,
        string corpo,
        byte[] anexo,
        string nomeAnexo,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var base64Anexo = Convert.ToBase64String(anexo);

            var request = new ResendEmailRequest
            {
                From = $"{_fromName} <{_fromEmail}>",
                To = new[] { destinatario },
                Subject = assunto,
                Html = corpo,
                Attachments = new[]
                {
                    new ResendAttachment
                    {
                        Filename = nomeAnexo,
                        Content = base64Anexo
                    }
                }
            };

            var response = await _httpClient.PostAsJsonAsync("/emails", request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ResendEmailResponse>(cancellationToken);
                _logger.LogInformation("✅ Email com anexo enviado via Resend para {Destinatario} - ID: {EmailId}", destinatario, result?.Id);
                return true;
            }

            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("❌ Erro ao enviar email com anexo via Resend: {StatusCode} - {Error}", response.StatusCode, errorContent);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Exceção ao enviar email com anexo via Resend para {Destinatario}", destinatario);
            return false;
        }
    }
}

// Classes auxiliares para serialização JSON
internal class ResendEmailRequest
{
    [JsonPropertyName("from")]
    public string From { get; set; } = string.Empty;

    [JsonPropertyName("to")]
    public string[] To { get; set; } = Array.Empty<string>();

    [JsonPropertyName("subject")]
    public string Subject { get; set; } = string.Empty;

    [JsonPropertyName("html")]
    public string Html { get; set; } = string.Empty;

    [JsonPropertyName("attachments")]
    public ResendAttachment[]? Attachments { get; set; }
}

internal class ResendAttachment
{
    [JsonPropertyName("filename")]
    public string Filename { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

internal class ResendEmailResponse
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
}

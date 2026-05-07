using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using SeuGerente.Application.Interfaces;

namespace SeuGerente.Infrastructure.ExternalServices;

/// <summary>
/// Serviço de envio de emails via SMTP
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPassword;
    private readonly string _fromName;
    private readonly string _fromEmail;
    private readonly bool _useSsl;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        _smtpHost = configuration["Email:SmtpHost"] ?? throw new ArgumentNullException("Email:SmtpHost");
        _smtpPort = int.Parse(configuration["Email:SmtpPort"] ?? "587");
        _smtpUser = configuration["Email:SmtpUser"] ?? throw new ArgumentNullException("Email:SmtpUser");
        _smtpPassword = configuration["Email:SmtpPassword"] ?? throw new ArgumentNullException("Email:SmtpPassword");
        _fromName = configuration["Email:FromName"] ?? "Sistema Seu Gerente";
        _fromEmail = configuration["Email:FromEmail"] ?? _smtpUser;
        _useSsl = bool.Parse(configuration["Email:UseSsl"] ?? "true");
    }

    public async Task<bool> EnviarRelatorioAsync(string destinatario, string nomeDestinatario, byte[] pdfRelatorio, CancellationToken cancellationToken = default)
    {
        var assunto = "Relatório Mensal - Sistema Seu Gerente";
        var corpo = $"""
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Olá, {nomeDestinatario}!</h2>
                <p>Segue em anexo o relatório mensal do seu condomínio.</p>
                <p>O relatório contém informações detalhadas sobre pagamentos, despesas e inadimplentes do período.</p>
                <br>
                <p>Atenciosamente,<br><strong>Sistema Seu Gerente</strong></p>
            </body>
            </html>
            """;

        return await EnviarComAnexoAsync(destinatario, assunto, corpo, pdfRelatorio, "relatorio-mensal.pdf", cancellationToken);
    }

    public async Task<bool> EnviarCobrancaAsync(string destinatario, string nomeDevedor, decimal valor, DateTime vencimento, CancellationToken cancellationToken = default)
    {
        var assunto = "Cobrança Pendente - Sistema Seu Gerente";
        var vencido = vencimento < DateTime.Now;
        
        var corpo = $"""
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Olá, {nomeDevedor}!</h2>
                <p>Você possui uma cobrança pendente:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>💰 Valor:</strong> R$ {valor:F2}</p>
                    <p><strong>📅 Vencimento:</strong> {vencimento:dd/MM/yyyy}</p>
                    {(vencido ? "<p style='color: red;'><strong>⚠️ ATENÇÃO: Pagamento vencido!</strong></p>" : "")}
                </div>
                <p>Para efetuar o pagamento, acesse o sistema ou entre em contato com a administração.</p>
                <br>
                <p>Atenciosamente,<br><strong>Sistema Seu Gerente</strong></p>
            </body>
            </html>
            """;

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
        var assunto = $"💰 Valor Condomínio - {mesAtual}";
        
        var pixInfo = "";
        if (!string.IsNullOrWhiteSpace(chavePix))
        {
            pixInfo = $"<p style='color: #2563eb; margin: 5px 0;'><strong>🔑 Chave PIX:</strong> {chavePix}</p>";
            if (!string.IsNullOrWhiteSpace(pixNomeBeneficiario))
            {
                pixInfo += $"<p style='color: #2563eb; margin: 5px 0;'><strong>👤 Beneficiário:</strong> {pixNomeBeneficiario}</p>";
            }
        }
            
        var corpo = $"""
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Olá, {nomeDevedor}!</h2>
                <p>Segue em anexo o relatório do condomínio referente ao mês de {mesAtual}.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style='margin: 5px 0; font-size: 18px; color: #059669;'><strong>💵 Valor Total:</strong> R$ {valorTotal:N2}</p>
                    <p style='margin: 5px 0;'><strong>📅 Vencimento:</strong> {vencimento:dd/MM/yyyy}</p>
                    {pixInfo}
                </div>
                <p>O PDF anexo contém todas as informações detalhadas sobre o valor e forma de pagamento.</p>
                <br>
                <p>Atenciosamente,<br><strong>Sistema Seu Gerente</strong></p>
            </body>
            </html>
            """;

        return await EnviarComAnexoAsync(
            destinatario,
            assunto,
            corpo,
            pdfCobranca,
            $"relatorio-condominio-{DateTime.Now:yyyy-MM}.pdf",
            cancellationToken);
    }

    public async Task<bool> EnviarNotificacaoAsync(string destinatario, string assunto, string corpo, CancellationToken cancellationToken = default)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _fromEmail));
            message.To.Add(MailboxAddress.Parse(destinatario));
            message.Subject = assunto;

            var builder = new BodyBuilder { HtmlBody = corpo };
            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpHost, _smtpPort, _useSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto, cancellationToken);
            await client.AuthenticateAsync(_smtpUser, _smtpPassword, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email enviado para {Destinatario}: {Assunto}", destinatario, assunto);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar email para {Destinatario}", destinatario);
            return false;
        }
    }

    public async Task<bool> EnviarResetPasswordAsync(string destinatario, string token, CancellationToken cancellationToken = default)
    {
        var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
        var resetLink = $"{frontendUrl}/nova-senha?token={token}";
        
        var assunto = "Recuperação de Senha - Sistema Seu Gerente";
        var corpo = $"""
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Recuperação de Senha</h2>
                <p>Você solicitou a recuperação de senha no Sistema Seu Gerente.</p>
                <p>Clique no link abaixo para criar uma nova senha:</p>
                <p><a href="{resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a></p>
                <p>Este link é válido por 1 hora.</p>
                <p>Se você não solicitou esta recuperação, ignore este email.</p>
                <br>
                <p>Atenciosamente,<br><strong>Sistema Seu Gerente</strong></p>
            </body>
            </html>
            """;

        return await EnviarNotificacaoAsync(destinatario, assunto, corpo, cancellationToken);
    }

    public async Task<bool> EnviarComAnexoAsync(string destinatario, string assunto, string corpo, byte[] anexo, string nomeAnexo, CancellationToken cancellationToken = default)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _fromEmail));
            message.To.Add(MailboxAddress.Parse(destinatario));
            message.Subject = assunto;

            var builder = new BodyBuilder { HtmlBody = corpo };
            
            // Adiciona anexo
            builder.Attachments.Add(nomeAnexo, anexo);
            
            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpHost, _smtpPort, _useSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto, cancellationToken);
            await client.AuthenticateAsync(_smtpUser, _smtpPassword, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email com anexo enviado para {Destinatario}: {Assunto}", destinatario, assunto);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar email com anexo para {Destinatario}", destinatario);
            return false;
        }
    }
}

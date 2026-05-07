namespace SeuGerente.Application.Interfaces;

/// <summary>
/// Interface para serviço de envio de emails
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Envia email de relatório mensal
    /// </summary>
    Task<bool> EnviarRelatorioAsync(string destinatario, string nomeDestinatario, byte[] pdfRelatorio, CancellationToken cancellationToken = default);

    /// <summary>
    /// Envia email de cobrança
    /// </summary>
    Task<bool> EnviarCobrancaAsync(string destinatario, string nomeDevedor, decimal valor, DateTime vencimento, CancellationToken cancellationToken = default);

    /// <summary>
    /// Envia email de cobrança com PDF anexado
    /// </summary>
    Task<bool> EnviarCobrancaComPdfAsync(string destinatario, string nomeDevedor, byte[] pdfCobranca, DateTime vencimento, decimal valorTotal, string? chavePix = null, string? pixNomeBeneficiario = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Envia email de notificação genérica
    /// </summary>
    Task<bool> EnviarNotificacaoAsync(string destinatario, string assunto, string corpo, CancellationToken cancellationToken = default);

    /// <summary>
    /// Envia email de reset de senha
    /// </summary>
    Task<bool> EnviarResetPasswordAsync(string destinatario, string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Envia email com anexo
    /// </summary>
    Task<bool> EnviarComAnexoAsync(string destinatario, string assunto, string corpo, byte[] anexo, string nomeAnexo, CancellationToken cancellationToken = default);
}

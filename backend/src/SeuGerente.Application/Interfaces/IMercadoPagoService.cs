using SeuGerente.Application.DTOs;

namespace SeuGerente.Application.Interfaces;

/// <summary>
/// Interface para integração com Mercado Pago
/// </summary>
public interface IMercadoPagoService
{
    /// <summary>
    /// Cria uma preferência de pagamento no Mercado Pago
    /// </summary>
    Task<string> CreatePreferenceAsync(CreatePagamentoDTO pagamento, CancellationToken cancellationToken = default);

    /// <summary>
    /// Processa webhook do Mercado Pago
    /// </summary>
    Task ProcessWebhookAsync(string payload, CancellationToken cancellationToken = default);

    /// <summary>
    /// Busca informações de um pagamento
    /// </summary>
    Task<object> GetPaymentInfoAsync(string paymentId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Processa reembolso
    /// </summary>
    Task<bool> RefundPaymentAsync(string paymentId, decimal amount, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cria um pagamento PIX para cobrança mensal
    /// </summary>
    Task<(string PaymentId, string QrCode, string QrCodeBase64)> CreatePixPaymentAsync(
        string email,
        string nome,
        decimal valor,
        string descricao,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifica o status de um pagamento PIX
    /// </summary>
    Task<(string Status, DateTime? DateApproved)> GetPixPaymentStatusAsync(
        string paymentId,
        CancellationToken cancellationToken = default);
}

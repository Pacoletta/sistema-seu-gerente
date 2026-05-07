namespace SeuGerente.Application.Interfaces;

public interface IWhatsAppService
{
    Task<bool> SendMessageAsync(string to, string message, CancellationToken cancellationToken = default);
    Task<bool> SendCobrancaAsync(string to, string nomeDevedor, decimal valor, DateTime vencimento, CancellationToken cancellationToken = default);
    Task<bool> SendDocumentAsync(string to, string documentUrl, string caption, string filename, CancellationToken cancellationToken = default);
    Task<bool> SendBase64DocumentAsync(string phoneNumber, string base64Data, string fileName, string caption, CancellationToken cancellationToken = default);
    Task<bool> GetInstanceStatusAsync(CancellationToken cancellationToken = default);
}

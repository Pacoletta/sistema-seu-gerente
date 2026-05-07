namespace SeuGerente.Domain.Entities;

public class WhatsAppInstancia
{
    public Guid Id { get; set; }
    public Guid? UsuarioId { get; set; }        // null = instância admin
    public bool IsAdmin { get; set; }
    public string InstanceName { get; set; } = string.Empty;
    public string? EvolutionInstanceId { get; set; } // id retornado pelo /instance/create
    public string? EvolutionToken { get; set; }      // token per-instância para autenticar chamadas
    public string? Status { get; set; }              // "connected", "disconnected", "connecting"
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

namespace SeuGerente.Domain.Entities;

/// <summary>
/// Logs do sistema para auditoria e debug
/// </summary>
public class LogSistema
{
    public Guid Id { get; set; }
    public DateTime Data { get; set; }
    public string Nivel { get; set; } = "INFO"; // INFO, WARNING, ERROR, CRITICAL
    public string? Categoria { get; set; }
    public string Mensagem { get; set; } = string.Empty;
    public string? Detalhes { get; set; }
    public Guid? UsuarioId { get; set; }
    public string? Email { get; set; }
    public DateTime? CreatedAt { get; set; }
}

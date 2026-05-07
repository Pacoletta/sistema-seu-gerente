namespace SeuGerente.Domain.Entities;

/// <summary>
/// Configuração de email (SMTP) do usuário
/// </summary>
public class ConfiguracaoEmail
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string? EmailRemetente { get; set; }
    public string? SenhaApp { get; set; }
    public bool Ativo { get; set; }
    public DateTime? CriadoEm { get; set; }
    public DateTime? AtualizadoEm { get; set; }
}

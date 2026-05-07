namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa uma sugestão de melhoria do condomínio
/// </summary>
public class Sugestao
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public Guid UsuarioId { get; set; }
    public string? Observacoes { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa uma receita do condomínio
/// </summary>
public class Receita
{
    public Guid Id { get; set; }
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string? Categoria { get; set; }
    public decimal Valor { get; set; }
    public Guid UsuarioId { get; set; }
    public DateTime? CreatedAt { get; set; }
}

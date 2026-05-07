namespace SeuGerente.Domain.Entities;

/// <summary>
/// Configurações globais do sistema (valores, preços, etc)
/// </summary>
public class ConfiguracaoSistema
{
    public Guid Id { get; set; }
    public string Chave { get; set; } = string.Empty;
    public string? Valor { get; set; }
    public string? Descricao { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

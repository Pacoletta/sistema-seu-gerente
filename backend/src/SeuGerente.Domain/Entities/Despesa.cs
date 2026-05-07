namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa uma despesa do condomínio
/// </summary>
public class Despesa
{
    public Guid Id { get; set; }
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string? Categoria { get; set; }
    public decimal Valor { get; set; }
    public decimal[]? ValoresPorAp { get; set; } // Array de valores por apartamento
    public Guid UsuarioId { get; set; }
    public string TipoDivisao { get; set; } = string.Empty;
    public string? ComprovanteUrl { get; set; }
    public string? Enviado { get; set; }
    public Guid? MelhoriaId { get; set; }
    public string? MelhoriaTitulo { get; set; }
    public string? Origem { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Métodos de domínio
    public bool PossuiDivisaoPersonalizada() => ValoresPorAp != null && ValoresPorAp.Length > 0;
    
    public decimal GetValorMensal() => Valor;
}

namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa uma despesa do sistema administrativo (SaaS)
/// Ex: servidores, licenças, marketing, etc.
/// </summary>
public class DespesaSistema
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Categoria { get; set; } = "outros";
    public DateTime DataLancamento { get; set; }
    public DateTime? DataPagamento { get; set; }
    public string Status { get; set; } = "pendente"; // pendente, pago
    public string? Observacao { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Métodos de domínio
    public void MarcarComoPago()
    {
        Status = "pago";
        DataPagamento = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool EstaPago() => Status == "pago";
}

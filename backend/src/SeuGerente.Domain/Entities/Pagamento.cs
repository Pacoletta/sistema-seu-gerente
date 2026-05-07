namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa um pagamento de um morador
/// </summary>
public class Pagamento
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid? MoradorId { get; set; }
    public string? MoradorNome { get; set; }
    public string? MoradorEmail { get; set; }
    public string? MoradorNumero { get; set; }
    public decimal Valor { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? DataPagamento { get; set; }
    public string Status { get; set; } = "pendente";
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? MesAno { get; set; }
    public string? UrlComprovante { get; set; }
    public decimal? Caixinha { get; set; }

    // Relacionamentos
    public virtual Morador? Morador { get; set; }

    // Métodos de domínio
    public bool EstaPago() => Status?.ToLower() == "pago";
    
    public bool EstaVencido() => !EstaPago() && DataVencimento < DateTime.UtcNow;
    
    public void MarcarComoPago(string? urlComprovante = null)
    {
        Status = "pago";
        DataPagamento = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(urlComprovante))
        {
            UrlComprovante = urlComprovante;
        }
    }

    public void MarcarComoPendente()
    {
        Status = "pendente";
        DataPagamento = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal GetValorTotal() => Valor + (Caixinha ?? 0);
}

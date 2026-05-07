namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa um morador do condomínio
/// </summary>
public class Morador
{
    public Guid Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Whatsapp { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public Guid? UsuarioId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Pagamento> Pagamentos { get; set; } = new List<Pagamento>();

    // Métodos de domínio
    public bool PossuiEmail() => !string.IsNullOrWhiteSpace(Email);
}

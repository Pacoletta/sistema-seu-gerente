namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa um usuário com permissões administrativas
/// </summary>
public class Administrativo
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Nome { get; set; }
    public string? SenhaHash { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Métodos de domínio
    public bool PodeAcessar() => Ativo && !string.IsNullOrWhiteSpace(Email);
    public bool TemSenha() => !string.IsNullOrWhiteSpace(SenhaHash);
}

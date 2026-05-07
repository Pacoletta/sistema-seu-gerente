namespace SeuGerente.Domain.Entities;

public class Cadastro
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? SenhaHash { get; set; }
    public string? Nome { get; set; }
    public string? CnpjCpf { get; set; }
    public string? Whatsapp { get; set; }
    public string? NomeCondominio { get; set; }
    public int? QuantidadeApartamentos { get; set; }
    public string Status { get; set; } = "pendente";
    public bool EmailConfirmado { get; set; } = false;
    public string? TokenConfirmacaoEmail { get; set; }
    public DateTime? TokenConfirmacaoExpiraEm { get; set; }
    public string? TokenResetSenha { get; set; }
    public DateTime? TokenResetSenhaExpiraEm { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

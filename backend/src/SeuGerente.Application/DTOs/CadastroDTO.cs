namespace SeuGerente.Application.DTOs;

public class CadastroDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Nome { get; set; }
    public string? CnpjCpf { get; set; }
    public string? Whatsapp { get; set; }
    public string? NomeCondominio { get; set; }
    public int? QuantidadeApartamentos { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool EmailConfirmado { get; set; }
}

public class CadastroStatusDTO
{
    public string Status { get; set; } = string.Empty;
}

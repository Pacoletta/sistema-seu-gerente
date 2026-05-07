namespace SeuGerente.Application.DTOs;

public class MoradorDTO
{
    public Guid Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? WhatsApp { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public Guid UsuarioId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateMoradorDTO
{
    public string Numero { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? WhatsApp { get; set; }
    public string Tipo { get; set; } = "morador";
}

public class UpdateMoradorDTO
{
    public string Numero { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? WhatsApp { get; set; }
    public string Tipo { get; set; } = "morador";
}

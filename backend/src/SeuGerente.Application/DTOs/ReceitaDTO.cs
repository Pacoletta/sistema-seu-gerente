namespace SeuGerente.Application.DTOs;

public class ReceitaDTO
{
    public Guid Id { get; set; }
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string? Categoria { get; set; }
    public decimal Valor { get; set; }
    public Guid UsuarioId { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class CreateReceitaDTO
{
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string? Categoria { get; set; }
    public decimal Valor { get; set; }
}

public class UpdateReceitaDTO
{
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string? Categoria { get; set; }
    public decimal Valor { get; set; }
}

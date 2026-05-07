namespace SeuGerente.Application.DTOs;

public class MelhoriaDTO
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Prioridade { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal? CustoEstimado { get; set; }
    public decimal? CustoReal { get; set; }
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFimPrevista { get; set; }
    public DateTime? DataFimReal { get; set; }
    public string? Responsavel { get; set; }
    public Guid UsuarioId { get; set; }
    public string? Observacoes { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateMelhoriaDTO
{
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Status { get; set; } = "planejada";
    public string Prioridade { get; set; } = "media";
    public string Categoria { get; set; } = string.Empty;
    public decimal? CustoEstimado { get; set; }
    public string? Responsavel { get; set; }
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFimPrevista { get; set; }
    public string? Observacoes { get; set; }
}

public class UpdateMelhoriaDTO
{
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Prioridade { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal? CustoEstimado { get; set; }
    public decimal? CustoReal { get; set; }
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFimPrevista { get; set; }
    public DateTime? DataFimReal { get; set; }
    public string? Responsavel { get; set; }
    public string? Observacoes { get; set; }
}

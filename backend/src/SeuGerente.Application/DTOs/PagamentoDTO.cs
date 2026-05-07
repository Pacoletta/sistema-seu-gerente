using SeuGerente.Domain.Enums;

namespace SeuGerente.Application.DTOs;

public class PagamentoDTO
{
    public Guid Id { get; set; }
    public Guid MoradorId { get; set; }
    public string MesAno { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public StatusPagamento Status { get; set; }
    public decimal? Caixinha { get; set; }
    public DateTime? DataPagamento { get; set; }
    public DateTime DataVencimento { get; set; }
    public string? UrlComprovante { get; set; }
    public Guid UsuarioId { get; set; }
    
    // Dados do morador (quando incluído)
    public MoradorDTO? Morador { get; set; }
    
    public DateTime CreatedAt { get; set; }
}

public class CreatePagamentoDTO
{
    public Guid MoradorId { get; set; }
    public string MesAno { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public decimal? Caixinha { get; set; }
    public DateTime DataVencimento { get; set; }
}

public class UpdatePagamentoStatusDTO
{
    public StatusPagamento Status { get; set; }
    public string? UrlComprovante { get; set; }
}

public class UpdatePagamentoDTO
{
    public decimal? Valor { get; set; }
    public decimal? Caixinha { get; set; }
    public DateTime? DataVencimento { get; set; }
    public DateTime? DataPagamento { get; set; }
    public string? Status { get; set; }
    public string? UrlComprovante { get; set; }
    public string? MesAno { get; set; }
    public Guid? MoradorId { get; set; }
}

public class GerarPagamentosMensaisDTO
{
    public string MesAno { get; set; } = string.Empty;
    public decimal ValorBase { get; set; }
    public DateTime DataVencimento { get; set; }
}

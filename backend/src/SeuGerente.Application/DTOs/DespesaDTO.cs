using System.Text.Json.Serialization;

namespace SeuGerente.Application.DTOs;

public class DespesaDTO
{
    public Guid Id { get; set; }
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public decimal[]? ValoresPorAp { get; set; }
    public Guid UsuarioId { get; set; }
    public string TipoDivisao { get; set; } = string.Empty;
    public string? ComprovanteUrl { get; set; }
    public string? Enviado { get; set; }
    public Guid? MelhoriaId { get; set; }
    public string? Origem { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateDespesaDTO
{
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public decimal[]? ValoresPorAp { get; set; }
    public string TipoDivisao { get; set; } = "igual";
    public string? ComprovanteUrl { get; set; }
    public Guid? MelhoriaId { get; set; }
    public string? Origem { get; set; }
    public string? Status { get; set; }
}

public class UpdateDespesaDTO
{
    public DateTime? Data { get; set; }
    public string? Descricao { get; set; }
    public string? Categoria { get; set; }
    public decimal? Valor { get; set; }
    public decimal[]? ValoresPorAp { get; set; }
    public string? TipoDivisao { get; set; }
    public string? ComprovanteUrl { get; set; }
    public Guid? MelhoriaId { get; set; }
    public string? Origem { get; set; }
    public string? Status { get; set; }
}

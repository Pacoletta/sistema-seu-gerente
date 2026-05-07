namespace SeuGerente.Application.DTOs;

public class BannerDTO
{
    public Guid Id { get; set; }
    public string ImagemUrl { get; set; } = "";
    public int Ordem { get; set; }
    public bool Ativo { get; set; }
    public DateTime CreatedAt { get; set; }
}

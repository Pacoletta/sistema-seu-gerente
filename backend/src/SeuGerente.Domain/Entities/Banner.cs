namespace SeuGerente.Domain.Entities;

public class Banner
{
    public Guid Id { get; set; }
    public string ImagemUrl { get; set; } = "";
    public string ObjectPath { get; set; } = "";
    public int Ordem { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace SeuGerente.Domain.Entities;

public class Reserva
{
    public Guid Id { get; set; }
    public string Espaco { get; set; } = string.Empty;
    public string Morador { get; set; } = string.Empty;
    public string DataReserva { get; set; } = string.Empty;
    public string HoraInicio { get; set; } = string.Empty;
    public string HoraFim { get; set; } = string.Empty;
    public string Status { get; set; } = "pendente";
    public string? Observacoes { get; set; }
    public Guid UsuarioId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

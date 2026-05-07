namespace SeuGerente.Application.DTOs;

public class ConfiguracaoEmailDTO
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string? EmailRemetente { get; set; }
    public string? SenhaApp { get; set; }
    public bool Ativo { get; set; }
}

public class UpdateConfiguracaoEmailDTO
{
    public string? EmailRemetente { get; set; }
    public string? SenhaApp { get; set; }
    public bool Ativo { get; set; }
}

namespace SeuGerente.Application.DTOs;

public class ConfiguracaoDTO
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string? MensagemRelatorio { get; set; }
    public string? MensagemCobranca { get; set; }
    public string? WhatsApp { get; set; }
    public bool? EnvioAutomaticoAtivo { get; set; }
    public int? DiaEnvioRelatorio { get; set; }
    public int? DiaEnvioCobranca { get; set; }
    public string? HoraEnvioRelatorio { get; set; } // Formato HH:mm
    public string? HoraEnvioCobranca { get; set; } // Formato HH:mm
    public string? MesReferenciaCobranca { get; set; } // "atual" ou "anterior"
    public int? DiaVencimento { get; set; }
    public string? PixCobranca { get; set; }
    public string? PixNomeBeneficiario { get; set; }
    public string? GmailEmail { get; set; }
    public string? GmailAppPassword { get; set; }
}

public class UpdateConfiguracaoDTO
{
    public string? MensagemRelatorio { get; set; }
    public string? MensagemCobranca { get; set; }
    public string? WhatsApp { get; set; }
    public bool? EnvioAutomaticoAtivo { get; set; }
    public int? DiaEnvioRelatorio { get; set; }
    public int? DiaEnvioCobranca { get; set; }
    public string? HoraEnvioRelatorio { get; set; } // Formato HH:mm
    public string? HoraEnvioCobranca { get; set; } // Formato HH:mm
    public string? MesReferenciaCobranca { get; set; } // "atual" ou "anterior"
    public int? DiaVencimento { get; set; }
    public string? PixCobranca { get; set; }
    public string? PixNomeBeneficiario { get; set; }
    public string? GmailEmail { get; set; }
    public string? GmailAppPassword { get; set; }
}

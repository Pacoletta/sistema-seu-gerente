namespace SeuGerente.Domain.Entities;

/// <summary>
/// Representa as configurações de um condomínio
/// </summary>
public class Configuracao
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public bool? EnvioAutomaticoAtivo { get; set; }
    public int? DiaEnvioRelatorio { get; set; }
    public int? DiaEnvioCobranca { get; set; }
    public TimeSpan? HoraEnvioRelatorio { get; set; }
    public TimeSpan? HoraEnvioCobranca { get; set; }
    public string? MesReferenciaCobranca { get; set; } // "atual" ou "anterior"
    public int? DiaVencimento { get; set; } // Dia do mês para vencimento
    public string? PixCobranca { get; set; } // Chave PIX para pagamento
    public string? PixNomeBeneficiario { get; set; } // Nome do beneficiário do PIX
    public DateTime? CriadoEm { get; set; }
    public DateTime? AtualizadoEm { get; set; }
    public string? Nome { get; set; }
    public string? Email { get; set; }
    public string? WhatsApp { get; set; }
    public string? MensagemRelatorio { get; set; }
    public string? MensagemCobranca { get; set; }

    // Métodos de domínio
    public bool PossuiConfiguracaoEmail() => !string.IsNullOrWhiteSpace(Email);
    
    public bool PossuiConfiguracaoWhatsApp() => !string.IsNullOrWhiteSpace(WhatsApp);
}

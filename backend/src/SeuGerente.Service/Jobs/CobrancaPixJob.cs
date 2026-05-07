using Hangfire;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.Services;

namespace SeuGerente.Service.Jobs;

/// <summary>
/// Job para processar cobranças mensais via PIX
/// </summary>
public class CobrancaPixJob
{
    private readonly CobrancaPixService _cobrancaPixService;
    private readonly ILogger<CobrancaPixJob> _logger;

    public CobrancaPixJob(
        CobrancaPixService cobrancaPixService,
        ILogger<CobrancaPixJob> logger)
    {
        _cobrancaPixService = cobrancaPixService;
        _logger = logger;
    }

    /// <summary>
    /// Executa o job de cobranças mensais
    /// Configurado para rodar todo dia 1º de cada mês às 08:00
    /// </summary>
    [AutomaticRetry(Attempts = 3)]
    public async Task ExecutarCobrancasMensaisAsync()
    {
        _logger.LogInformation("🔄 Job de cobranças PIX iniciado em {DataHora}", DateTime.Now);

        try
        {
            await _cobrancaPixService.ProcessarCobrancasMensaisAsync();
            _logger.LogInformation("✅ Job de cobranças PIX concluído com sucesso");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao executar job de cobranças PIX");
            throw; // Hangfire vai retentar automaticamente
        }
    }

    /// <summary>
    /// Registra o job no Hangfire
    /// </summary>
    public static void Configurar()
    {
        // Executa todo dia 1º de cada mês às 08:00
        RecurringJob.AddOrUpdate<CobrancaPixJob>(
            "cobranca-pix-mensal",
            job => job.ExecutarCobrancasMensaisAsync(),
            "0 8 1 * *", // Cron: minuto hora dia mês dia-da-semana
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time") // Brasília
            });
    }
}

using Microsoft.Extensions.Logging;
using SeuGerente.Application.Services;

namespace SeuGerente.Service.Jobs;

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

    public async Task ExecutarCobrancasMensaisAsync()
    {
        _logger.LogInformation("Job de cobranças PIX iniciado em {DataHora}", DateTime.Now);

        try
        {
            await _cobrancaPixService.ProcessarCobrancasMensaisAsync();
            _logger.LogInformation("Job de cobranças PIX concluído com sucesso");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao executar job de cobranças PIX");
            throw;
        }
    }
}

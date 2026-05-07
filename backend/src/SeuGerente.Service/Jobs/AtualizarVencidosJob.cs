using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Service.Jobs;

/// <summary>
/// Job para atualizar status de pagamentos vencidos diariamente
/// </summary>
public class AtualizarVencidosJob
{
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly ILogger<AtualizarVencidosJob> _logger;

    public AtualizarVencidosJob(
        IPagamentoRepository pagamentoRepository,
        ILogger<AtualizarVencidosJob> logger)
    {
        _pagamentoRepository = pagamentoRepository;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Iniciando job de atualização de vencidos");

            var hoje = DateTime.Now;
            var mesAnoAtual = hoje.ToString("yyyy-MM");

            // Busca todos os pagamentos e filtra os pendentes
            var todosPagamentos = await _pagamentoRepository.GetAllAsync(cancellationToken);
            var pagamentosPendentes = todosPagamentos.Where(p => p.Status?.ToLower() == "pendente");

            var atualizados = 0;

            // Filtra apenas os vencidos (meses anteriores ao atual)
            foreach (var pagamento in pagamentosPendentes.Where(p => string.Compare(p.MesAno, mesAnoAtual) < 0))
            {
                if (pagamento.EstaVencido())
                {
                    // Aqui você pode adicionar lógica adicional, como:
                    // - Marcar como vencido em um campo específico
                    // - Adicionar juros/multa
                    // - Registrar log de vencimento
                    
                    atualizados++;
                }
            }

            _logger.LogInformation("Job de vencidos finalizado: {Atualizados} pagamentos identificados como vencidos", atualizados);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao executar job de atualização de vencidos");
            throw;
        }
    }
}

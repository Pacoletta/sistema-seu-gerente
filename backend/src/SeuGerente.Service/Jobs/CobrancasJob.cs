using Microsoft.Extensions.Logging;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Service.Jobs;

public class CobrancasJob
{
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IWhatsAppService _whatsAppService;
    private readonly IEmailService _emailService;
    private readonly ILogger<CobrancasJob> _logger;

    public CobrancasJob(
        IPagamentoRepository pagamentoRepository,
        IWhatsAppService whatsAppService,
        IEmailService emailService,
        ILogger<CobrancasJob> logger)
    {
        _pagamentoRepository = pagamentoRepository;
        _whatsAppService = whatsAppService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Iniciando job de cobranças automáticas");

            var todosPagamentos = await _pagamentoRepository.GetAllAsync(cancellationToken);
            var pagamentosPendentes = todosPagamentos.Where(p => p.Status?.ToLower() == "pendente").ToList();

            var enviadosWhatsApp = 0;
            var enviadosEmail = 0;
            var falhas = 0;

            foreach (var pagamento in pagamentosPendentes)
            {
                try
                {
                    var vencimento = DateTime.Parse(pagamento.MesAno + "-01").AddMonths(1).AddDays(-1);

                    if (pagamento.Morador != null && !string.IsNullOrWhiteSpace(pagamento.Morador.Telefone))
                    {
                        var sucesso = await _whatsAppService.SendCobrancaAsync(
                            pagamento.Morador.Telefone,
                            pagamento.Morador.Nome,
                            pagamento.GetValorTotal(),
                            vencimento,
                            cancellationToken);

                        if (sucesso) enviadosWhatsApp++;
                    }

                    if (pagamento.Morador != null && pagamento.Morador.PossuiEmail())
                    {
                        var sucesso = await _emailService.EnviarCobrancaAsync(
                            pagamento.Morador.Email!,
                            pagamento.Morador.Nome,
                            pagamento.GetValorTotal(),
                            vencimento,
                            cancellationToken);

                        if (sucesso) enviadosEmail++;
                    }

                    await Task.Delay(1000, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao enviar cobrança para morador {MoradorId}", pagamento.MoradorId);
                    falhas++;
                }
            }

            _logger.LogInformation(
                "Job de cobranças finalizado: {WhatsApp} WhatsApp, {Email} emails enviados, {Falhas} falhas",
                enviadosWhatsApp, enviadosEmail, falhas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao executar job de cobranças");
            throw;
        }
    }
}

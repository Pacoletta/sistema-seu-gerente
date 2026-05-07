using Microsoft.Extensions.Logging;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Service.Jobs;

/// <summary>
/// Job para enviar cobranças mensais automaticamente baseado na configuração do usuário
/// </summary>
public class EnvioAutomaticoCobrancaJob
{
    private readonly IConfiguracaoRepository _configuracaoRepository;
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IDespesaRepository _despesaRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly IEmailService _emailService;
    private readonly IWhatsAppService _whatsAppService;
    private readonly IPdfService _pdfService;
    private readonly ILogger<EnvioAutomaticoCobrancaJob> _logger;

    public EnvioAutomaticoCobrancaJob(
        IConfiguracaoRepository configuracaoRepository,
        IPagamentoRepository pagamentoRepository,
        IDespesaRepository despesaRepository,
        IMoradorRepository moradorRepository,
        IEmailService emailService,
        IWhatsAppService whatsAppService,
        IPdfService pdfService,
        ILogger<EnvioAutomaticoCobrancaJob> logger)
    {
        _configuracaoRepository = configuracaoRepository;
        _pagamentoRepository = pagamentoRepository;
        _despesaRepository = despesaRepository;
        _moradorRepository = moradorRepository;
        _emailService = emailService;
        _whatsAppService = whatsAppService;
        _pdfService = pdfService;
        _logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var agora = DateTime.Now;
            _logger.LogInformation("🔔 [ENVIO AUTOMÁTICO] Job executando às {Hora} do dia {Dia}", agora.ToString("HH:mm:ss"), agora.Day);

            var configuracoes = await _configuracaoRepository.GetAllAsync(cancellationToken);
            _logger.LogInformation("📋 Total de configurações no banco: {Total}", configuracoes.Count());
            
            // Filtra apenas configurações ativas
            var configuracoesAtivas = configuracoes
                .Where(c => c.EnvioAutomaticoAtivo == true 
                    && c.DiaEnvioCobranca.HasValue 
                    && c.HoraEnvioCobranca.HasValue)
                .ToList();

            _logger.LogInformation("✅ Configurações ativas de envio automático de cobrança: {Count}", configuracoesAtivas.Count);

            if (!configuracoesAtivas.Any())
            {
                _logger.LogInformation("⚠️ Nenhuma configuração de envio automático de cobrança ativa encontrada");
                return;
            }

            var diaAtual = agora.Day;
            var horaAtual = agora.TimeOfDay;
            _logger.LogInformation("📅 Verificando envios para dia {Dia} às {Hora}", diaAtual, horaAtual.ToString(@"hh\:mm"));

            foreach (var config in configuracoesAtivas)
            {
                _logger.LogInformation(
                    "🔍 Analisando configuração do usuário {UsuarioId}: Dia={DiaConfig}, Hora={HoraConfig}",
                    config.UsuarioId, config.DiaEnvioCobranca, config.HoraEnvioCobranca?.ToString(@"hh\:mm"));

                // Verifica se é o dia e hora configurados (tolerância de 10 minutos)
                var diaMatch = config.DiaEnvioCobranca == diaAtual;
                var horaInicio = config.HoraEnvioCobranca!.Value;
                var horaFim = horaInicio.Add(TimeSpan.FromMinutes(10));
                var horaMatch = horaAtual >= horaInicio && horaAtual < horaFim;

                _logger.LogInformation(
                    "📊 Verificação: DiaMatch={DiaMatch} (Config:{DiaConfig} vs Atual:{DiaAtual}), HoraMatch={HoraMatch} (Atual:{HoraAtual} >= Inicio:{HoraInicio} < Fim:{HoraFim})",
                    diaMatch, config.DiaEnvioCobranca, diaAtual, horaMatch, horaAtual.ToString(@"hh\:mm"), horaInicio.ToString(@"hh\:mm"), horaFim.ToString(@"hh\:mm"));

                if (!diaMatch || !horaMatch)
                {
                    _logger.LogInformation(
                        "❌ Configuração do usuário {UsuarioId} NÃO corresponde ao momento atual (DiaMatch={Dia}, HoraMatch={Hora})",
                        config.UsuarioId, diaMatch, horaMatch);
                    continue;
                }

                _logger.LogInformation(
                    "✅ Iniciando envio automático de cobrança para usuário {UsuarioId}",
                    config.UsuarioId);

                try
                {
                    // Define o mês de referência baseado na configuração
                    var mesReferencia = config.MesReferenciaCobranca?.ToLower() == "anterior"
                        ? agora.AddMonths(-1).ToString("yyyy-MM")
                        : agora.ToString("yyyy-MM");
                    
                    var mesAno = DateTime.Parse(mesReferencia + "-01");
                    var mes = mesAno.Month;
                    var ano = mesAno.Year;

                    // Define o mês de vencimento (sempre o mês ATUAL, não o mês de referência)
                    var mesVencimento = agora.Month;
                    var anoVencimento = agora.Year;
                    
                    _logger.LogInformation(
                        "📆 Buscando pagamentos pendentes para o mês de referência: {MesReferencia} (Config: {ConfigMes})",
                        mesReferencia, config.MesReferenciaCobranca ?? "atual");
                    _logger.LogInformation(
                        "📅 Vencimento será no mês: {Ano}-{Mes:D2}",
                        anoVencimento, mesVencimento);

                    // Busca todos os moradores do usuário
                    var moradores = await _moradorRepository.GetByUsuarioIdAsync(config.UsuarioId, cancellationToken);
                    var moradoresLista = moradores.ToList();

                    if (!moradoresLista.Any())
                    {
                        _logger.LogInformation("⚠️ Nenhum morador cadastrado para usuário {UsuarioId}", config.UsuarioId);
                        continue;
                    }

                    _logger.LogInformation("👥 Encontrados {Count} moradores", moradoresLista.Count);

                    // Busca despesas do mês
                    var todasDespesas = await _despesaRepository.GetAllAsync(cancellationToken);
                    var despesasDoMes = todasDespesas
                        .Where(d => d.UsuarioId == config.UsuarioId && 
                                   d.Data.Year == ano && 
                                   d.Data.Month == mes)
                        .OrderBy(d => d.Data)
                        .ToList();

                    _logger.LogInformation("💰 Encontradas {Count} despesas para o mês {MesReferencia}", despesasDoMes.Count, mesReferencia);

                    // Busca pagamentos para obter valores de caixinha
                    var pagamentosUsuario = await _pagamentoRepository.GetByUsuarioIdAsync(
                        config.UsuarioId,
                        cancellationToken);

                    var pagamentosPorMorador = pagamentosUsuario
                        .Where(p => p.MesAno == mesReferencia)
                        .ToDictionary(p => p.MoradorId, p => p);

                    // Recalcula valores devidos por apartamento com base nas despesas (igual no frontend)
                    var apartamentos = new List<ApartamentoRelatorio>();
                    var totalDespesas = 0m;
                    var totalCaixinha = 0m;

                    for (int idx = 0; idx < moradoresLista.Count; idx++)
                    {
                        var morador = moradoresLista[idx];
                        decimal valorDevido = 0m;

                        // Calcula valor devido somando ValoresPorAp de cada despesa
                        foreach (var despesa in despesasDoMes)
                        {
                            if (despesa.ValoresPorAp != null && despesa.ValoresPorAp.Length > idx)
                            {
                                valorDevido += despesa.ValoresPorAp[idx];
                            }
                            else if (despesa.TipoDivisao == "igual" || string.IsNullOrEmpty(despesa.TipoDivisao))
                            {
                                // Se não tem ValoresPorAp, divide igualmente
                                valorDevido += despesa.Valor / moradoresLista.Count;
                            }
                        }

                        // Busca caixinha do pagamento, se existir
                        decimal valorCaixinha = 0m;
                        if (pagamentosPorMorador.TryGetValue(morador.Id, out var pagamento))
                        {
                            valorCaixinha = pagamento.Caixinha.GetValueOrDefault();
                        }

                        var valorTotal = valorDevido + valorCaixinha;
                        
                        totalDespesas += valorDevido;
                        totalCaixinha += valorCaixinha;

                        apartamentos.Add(new ApartamentoRelatorio
                        {
                            Numero = morador.Numero,
                            Devido = valorDevido,
                            Caixinha = valorCaixinha,
                            Total = valorTotal
                        });

                        _logger.LogInformation("🏠 Apt {Numero}: Devido={Devido:F2}, Caixinha={Caixinha:F2}, Total={Total:F2}",
                            morador.Numero, valorDevido, valorCaixinha, valorTotal);
                    }

                    var totalGeral = totalDespesas + totalCaixinha;

                    var despesasRelatorio = despesasDoMes.Select(d => new DespesaRelatorio
                    {
                        Data = d.Data,
                        Descricao = d.Descricao,
                        Categoria = d.Categoria,
                        Valor = d.Valor,
                        ComprovanteUrl = d.ComprovanteUrl
                    }).ToList();

                    // Define data de vencimento (usando mês ATUAL, não mês de referência)
                    var dataVencimento = config.DiaVencimento.HasValue
                        ? new DateTime(anoVencimento, mesVencimento, Math.Min(config.DiaVencimento.Value, DateTime.DaysInMonth(anoVencimento, mesVencimento)))
                        : new DateTime(anoVencimento, mesVencimento, DateTime.DaysInMonth(anoVencimento, mesVencimento));

                    // Gera o PDF único do relatório completo
                    byte[] pdfBytes;
                    try
                    {
                        pdfBytes = _pdfService.GerarRelatorioCompleto(
                            apartamentos: apartamentos,
                            despesas: despesasRelatorio,
                            totalDespesas: totalDespesas,
                            totalCaixinha: totalCaixinha,
                            totalGeral: totalGeral,
                            mesReferencia: mes.ToString(),
                            anoReferencia: ano,
                            dataVencimento: dataVencimento,
                            chavePix: config.PixCobranca,
                            pixNomeBeneficiario: config.PixNomeBeneficiario);

                        _logger.LogInformation("📄 Relatório PDF completo gerado com sucesso ({Size} bytes)", pdfBytes.Length);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Erro ao gerar PDF de relatório completo");
                        continue;
                    }

                    // Envia o relatório para todos os moradores
                    var enviadosEmail = 0;
                    var enviadosWhatsApp = 0;
                    var falhas = 0;

                    foreach (var morador in moradoresLista)
                    {
                        
                        _logger.LogInformation("🔍 Processando morador: {Nome} (Apt {Numero}), Email: {Email}, Telefone: {Telefone}", 
                            morador.Nome, morador.Numero, 
                            string.IsNullOrWhiteSpace(morador.Email) ? "NÃO CADASTRADO" : morador.Email,
                            string.IsNullOrWhiteSpace(morador.Telefone) ? "NÃO CADASTRADO" : morador.Telefone);

                        try
                        {
                            // Busca valor total do morador
                            var valorMorador = apartamentos.FirstOrDefault(a => a.Numero == morador.Numero)?.Total ?? 0;

                            // Envia por Email se disponível
                            if (!string.IsNullOrWhiteSpace(morador.Email))
                            {
                                var sucessoEmail = await _emailService.EnviarCobrancaComPdfAsync(
                                    destinatario: morador.Email,
                                    nomeDevedor: morador.Nome,
                                    pdfCobranca: pdfBytes,
                                    vencimento: dataVencimento,
                                    valorTotal: valorMorador,
                                    chavePix: config.PixCobranca,
                                    pixNomeBeneficiario: config.PixNomeBeneficiario,
                                    cancellationToken: cancellationToken);

                                if (sucessoEmail)
                                {
                                    enviadosEmail++;
                                    _logger.LogInformation("📧 Relatório enviado por email para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);
                                }
                                else
                                {
                                    _logger.LogWarning("⚠️ Falha ao enviar email para {Nome}", morador.Nome);
                                    falhas++;
                                }
                            }

                            // Envia por WhatsApp se disponível
                            if (!string.IsNullOrWhiteSpace(morador.Telefone))
                            {
                                var pdfBase64 = Convert.ToBase64String(pdfBytes);
                                var nomeMes = new[] { "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                                    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" }[mes - 1];

                                var sucessoWhatsApp = await _whatsAppService.SendBase64DocumentAsync(
                                    phoneNumber: morador.Telefone,
                                    base64Data: pdfBase64,
                                    fileName: $"Relatorio_{nomeMes}_{ano}.pdf",
                                    caption: $"Olá {morador.Nome}! Segue o relatório mensal de {nomeMes}/{ano}.",
                                    cancellationToken: cancellationToken);

                                if (sucessoWhatsApp)
                                {
                                    enviadosWhatsApp++;
                                    _logger.LogInformation("📱 Relatório PDF enviado por WhatsApp para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);

                                    // Aguarda um pouco antes de enviar a mensagem de texto
                                    await Task.Delay(500, cancellationToken);

                                    // Envia mensagem de texto adicional com informações de pagamento
                                    var mensagemTexto = $"Olá, *{morador.Nome}*! 👋\n\n" +
                                        $"Segue o aviso de vencimento do condomínio referente a *{nomeMes}/{ano}*.\n\n" +
                                        $"🏠 *Apartamento:* {morador.Numero}\n" +
                                        $"💰 *Valor:* R$ {valorMorador:N2}\n" +
                                        $"📅 *Vencimento:* {dataVencimento:dd/MM/yyyy}";

                                    if (!string.IsNullOrWhiteSpace(config.PixCobranca))
                                    {
                                        mensagemTexto += $"\n\n💳 *Pagamento via PIX*\n🔑 *Chave:* {config.PixCobranca}";
                                        if (!string.IsNullOrWhiteSpace(config.PixNomeBeneficiario))
                                        {
                                            mensagemTexto += $"\n👤 *Favorecido:* {config.PixNomeBeneficiario}";
                                        }
                                    }

                                    mensagemTexto += "\n\n📄 O relatório completo em PDF foi enviado acima.\n\nEm caso de dúvidas, entre em contato com a administração.";

                                    var sucessoMensagem = await _whatsAppService.SendMessageAsync(
                                        morador.Telefone,
                                        mensagemTexto,
                                        cancellationToken);

                                    if (sucessoMensagem)
                                    {
                                        _logger.LogInformation("💬 Mensagem de texto enviada para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);
                                    }
                                }
                                else
                                {
                                    _logger.LogWarning("⚠️ Falha ao enviar WhatsApp para {Nome}", morador.Nome);
                                    falhas++;
                                }
                            }

                            // Delay entre envios para evitar rate limiting
                            await Task.Delay(500, cancellationToken);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Erro ao enviar relatório para morador {MoradorId}", morador.Id);
                            falhas++;
                        }
                    }

                    _logger.LogInformation(
                        "✅ Relatório mensal enviado para usuário {UsuarioId}: {EnviadosEmail} emails, {EnviadosWhatsApp} WhatsApp ({Falhas} falhas)",
                        config.UsuarioId, enviadosEmail, enviadosWhatsApp, falhas);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao processar envio automático de cobrança para usuário {UsuarioId}", config.UsuarioId);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no job de envio automático de cobrança");
            throw;
        }
    }
}

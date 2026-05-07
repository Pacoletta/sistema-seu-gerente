using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Interfaces;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConfiguracaoController : ControllerBase
{
    private readonly ConfiguracaoService _configuracaoService;
    private readonly ConfiguracaoEmailService _configuracaoEmailService;
    private readonly IConfiguracaoRepository _configuracaoRepository;
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IDespesaRepository _despesaRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly IEmailService _emailService;
    private readonly IWhatsAppService _whatsAppService;
    private readonly IPdfService _pdfService;
    private readonly ILogger<ConfiguracaoController> _logger;

    public ConfiguracaoController(
        ConfiguracaoService configuracaoService,
        ConfiguracaoEmailService configuracaoEmailService,
        IConfiguracaoRepository configuracaoRepository,
        IPagamentoRepository pagamentoRepository,
        IDespesaRepository despesaRepository,
        IMoradorRepository moradorRepository,
        IEmailService emailService,
        IWhatsAppService whatsAppService,
        IPdfService pdfService,
        ILogger<ConfiguracaoController> logger)
    {
        _configuracaoService = configuracaoService;
        _configuracaoEmailService = configuracaoEmailService;
        _configuracaoRepository = configuracaoRepository;
        _pagamentoRepository = pagamentoRepository;
        _despesaRepository = despesaRepository;
        _moradorRepository = moradorRepository;
        _emailService = emailService;
        _whatsAppService = whatsAppService;
        _pdfService = pdfService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Busca configuração do usuário autenticado
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ConfiguracaoDTO>> Get(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var configuracao = await _configuracaoService.GetByUsuarioIdAsync(usuarioId, cancellationToken);

        if (configuracao == null)
        {
            return Ok(new ConfiguracaoDTO { UsuarioId = usuarioId });
        }

        return Ok(configuracao);
    }

    /// <summary>
    /// Atualiza ou cria configuração do usuário
    /// </summary>
    [HttpPut]
    public async Task<ActionResult<ConfiguracaoDTO>> Update(
        [FromBody] UpdateConfiguracaoDTO updateDto, 
        CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var configuracao = await _configuracaoService.UpdateAsync(usuarioId, updateDto, cancellationToken);
        
        _logger.LogInformation("Configuração atualizada para usuário: {UsuarioId}", usuarioId);
        return Ok(configuracao);
    }

    /// <summary>
    /// Busca configuração de email do usuário
    /// </summary>
    [HttpGet("email")]
    public async Task<ActionResult<ConfiguracaoEmailDTO>> GetEmail(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var config = await _configuracaoEmailService.GetByUsuarioIdAsync(usuarioId, cancellationToken);

        if (config == null)
        {
            return Ok(new ConfiguracaoEmailDTO { UsuarioId = usuarioId });
        }

        return Ok(config);
    }

    /// <summary>
    /// Cria ou atualiza configuração de email do usuário
    /// </summary>
    [HttpPut("email")]
    public async Task<ActionResult<ConfiguracaoEmailDTO>> UpdateEmail(
        [FromBody] UpdateConfiguracaoEmailDTO updateDto,
        CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        var config = await _configuracaoEmailService.UpsertAsync(usuarioId, updateDto, cancellationToken);

        _logger.LogInformation("Configuração de email atualizada para usuário: {UsuarioId}", usuarioId);
        return Ok(config);
    }

    /// <summary>
    /// Dispara um teste de envio de relatório/cobrança para o usuário
    /// </summary>
    [HttpPost("teste-envio")]
    public async Task<IActionResult> TesteEnvio(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        
        try
        {
            _logger.LogInformation("🧪 Iniciando teste de envio para usuário {UsuarioId}", usuarioId);

            // Busca configuração do usuário
            var config = await _configuracaoRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
            if (config == null)
            {
                return BadRequest(new { message = "Configuração não encontrada" });
            }

            // Define o mês de referência
            var agora = DateTime.Now;
            var mesReferencia = config.MesReferenciaCobranca?.ToLower() == "anterior"
                ? agora.AddMonths(-1).ToString("yyyy-MM")
                : agora.ToString("yyyy-MM");
            
            var mesAno = DateTime.Parse(mesReferencia + "-01");
            var mes = mesAno.Month;
            var ano = mesAno.Year;

            // Define o mês de vencimento (sempre o mês ATUAL, não o mês de referência)
            var mesVencimento = agora.Month;
            var anoVencimento = agora.Year;

            _logger.LogInformation("📆 Mês de referência: {MesReferencia}", mesReferencia);
            _logger.LogInformation("📅 Mês de vencimento: {Ano}-{Mes:D2}", anoVencimento, mesVencimento);

            // Busca todos os moradores do usuário
            var moradores = await _moradorRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
            var moradoresLista = moradores.ToList();

            if (!moradoresLista.Any())
            {
                return BadRequest(new { message = "Nenhum morador cadastrado" });
            }

            _logger.LogInformation("👥 Encontrados {Count} moradores", moradoresLista.Count);

            // Busca despesas do mês
            var todasDespesas = await _despesaRepository.GetAllAsync(cancellationToken);
            var despesasDoMes = todasDespesas
                .Where(d => d.UsuarioId == usuarioId && 
                           d.Data.Year == ano && 
                           d.Data.Month == mes)
                .OrderBy(d => d.Data)
                .ToList();

            _logger.LogInformation("💰 Encontradas {Count} despesas", despesasDoMes.Count);

            // Busca pagamentos do usuário para obter valores de caixinha
            var pagamentosUsuario = await _pagamentoRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
            var pagamentosPorMorador = pagamentosUsuario
                .Where(p => p.MesAno == mesReferencia && p.MoradorId.HasValue)
                .ToDictionary(p => p.MoradorId!.Value, p => p);

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
                Categoria = d.Categoria ?? string.Empty,
                Valor = d.Valor,
                ComprovanteUrl = d.ComprovanteUrl
            }).ToList();

            // Define data de vencimento (usando mês ATUAL, não mês de referência)
            var dataVencimento = config.DiaVencimento.HasValue
                ? new DateTime(anoVencimento, mesVencimento, Math.Min(config.DiaVencimento.Value, DateTime.DaysInMonth(anoVencimento, mesVencimento)))
                : new DateTime(anoVencimento, mesVencimento, DateTime.DaysInMonth(anoVencimento, mesVencimento));

            // Gera o PDF
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

                _logger.LogInformation("📄 PDF gerado com sucesso ({Size} bytes)", pdfBytes.Length);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao gerar PDF");
                return StatusCode(500, new { message = "Erro ao gerar PDF" });
            }

            // Envia para todos os moradores
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

                    // Envia por Email
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
                            _logger.LogInformation("📧 Email enviado para {Nome}", morador.Nome);
                        }
                        else
                        {
                            falhas++;
                        }
                    }

                    // Envia por WhatsApp
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
                            _logger.LogInformation("📱 WhatsApp enviado para {Nome}", morador.Nome);

                            // Envia mensagem de texto adicional
                            await Task.Delay(500, cancellationToken);
                            
                            var mensagemTexto = $@"📊 *Resumo de Pagamento - {nomeMes}/{ano}*

🏠 Apartamento: {morador.Numero}
💰 Valor Total: R$ {valorMorador:F2}
📅 Vencimento: {dataVencimento:dd/MM/yyyy}";

                            if (!string.IsNullOrWhiteSpace(config.PixCobranca))
                            {
                                mensagemTexto += $"\n\n🔑 *Chave PIX:* {config.PixCobranca}";
                                if (!string.IsNullOrWhiteSpace(config.PixNomeBeneficiario))
                                {
                                    mensagemTexto += $"\n👤 *Beneficiário:* {config.PixNomeBeneficiario}";
                                }
                            }

                            mensagemTexto += "\n\n📄 O PDF com o relatório completo foi enviado acima.";

                            await _whatsAppService.SendMessageAsync(
                                morador.Telefone,
                                mensagemTexto,
                                cancellationToken);
                        }
                        else
                        {
                            falhas++;
                        }
                    }

                    await Task.Delay(500, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao enviar para morador {MoradorId}", morador.Id);
                    falhas++;
                }
            }

            _logger.LogInformation(
                "✅ Teste concluído: {EnviadosEmail} emails, {EnviadosWhatsApp} WhatsApp ({Falhas} falhas)",
                enviadosEmail, enviadosWhatsApp, falhas);

            return Ok(new 
            { 
                message = "Teste enviado com sucesso",
                enviadosEmail,
                enviadosWhatsApp,
                falhas,
                totalMoradores = moradoresLista.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao executar teste de envio");
            return StatusCode(500, new { message = "Erro ao executar teste de envio" });
        }
    }
}

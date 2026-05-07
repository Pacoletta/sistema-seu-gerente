using Microsoft.Extensions.Logging;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

/// <summary>
/// Serviço para gerenciar cobranças mensais via PIX
/// </summary>
public class CobrancaPixService
{
    private readonly ICadastroRepository _cadastroRepository;
    private readonly IMercadoPagoService _mercadoPagoService;
    private readonly IEmailService _emailService;
    private readonly ILogger<CobrancaPixService> _logger;
    private const decimal ValorMensalidade = 29.90m; // R$ 29,90/mês

    public CobrancaPixService(
        ICadastroRepository cadastroRepository,
        IMercadoPagoService mercadoPagoService,
        IEmailService emailService,
        ILogger<CobrancaPixService> logger)
    {
        _cadastroRepository = cadastroRepository;
        _mercadoPagoService = mercadoPagoService;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Gera cobrança PIX para um usuário
    /// </summary>
    public async Task<(string PaymentId, string QrCode, string QrCodeBase64)> GerarCobrancaPixAsync(
        Guid usuarioId,
        CancellationToken cancellationToken = default)
    {
        var cadastro = await _cadastroRepository.GetByIdAsync(usuarioId, cancellationToken);
        if (cadastro == null)
        {
            throw new Exception("Usuário não encontrado");
        }

        var mesRef = DateTime.Now.ToString("MM/yyyy");
        var descricao = $"Mensalidade Seu Gerente - {mesRef}";

        var (paymentId, qrCode, qrCodeBase64) = await _mercadoPagoService.CreatePixPaymentAsync(
            cadastro.Email,
            cadastro.Nome ?? "Cliente",
            ValorMensalidade,
            descricao,
            cancellationToken);

        // TODO: Salvar payment_id na tabela de assinaturas ao invés do cadastro
        // cadastro.MercadopagoPaymentId = paymentId;
        // cadastro.UpdatedAt = DateTime.UtcNow;
        // await _cadastroRepository.UpdateAsync(cadastro, cancellationToken);

        _logger.LogInformation("Cobrança PIX gerada para usuário {UsuarioId}: {PaymentId}", usuarioId, paymentId);

        return (paymentId, qrCode, qrCodeBase64);
    }

    /// <summary>
    /// Envia email de cobrança com o código PIX
    /// </summary>
    public async Task EnviarEmailCobrancaAsync(
        Guid usuarioId,
        string qrCode,
        string qrCodeBase64,
        CancellationToken cancellationToken = default)
    {
        var cadastro = await _cadastroRepository.GetByIdAsync(usuarioId, cancellationToken);
        if (cadastro == null)
        {
            _logger.LogWarning("Usuário {UsuarioId} não encontrado para envio de cobrança", usuarioId);
            return;
        }

        var mesRef = DateTime.Now.ToString("MMMM/yyyy");
        var assunto = $"Cobrança Seu Gerente - {mesRef}";

        var corpo = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f9f9f9; padding: 30px; }}
        .qr-code {{ text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; }}
        .qr-code img {{ max-width: 300px; }}
        .pix-code {{ background: #fff; border: 2px dashed #667eea; padding: 15px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 12px; }}
        .valor {{ font-size: 32px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }}
        .footer {{ background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }}
        .btn {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>💰 Cobrança Mensal</h1>
            <p>Seu Gerente - Sistema de Gestão Condominial</p>
        </div>
        
        <div class='content'>
            <p>Olá <strong>{cadastro.Nome}</strong>,</p>
            
            <p>Sua mensalidade de <strong>{mesRef}</strong> está disponível para pagamento.</p>
            
            <div class='valor'>
                R$ {ValorMensalidade:F2}
            </div>
            
            <h3>📱 Pague com PIX</h3>
            <p>Escaneie o QR Code abaixo com o aplicativo do seu banco:</p>
            
            <div class='qr-code'>
                <img src='data:image/png;base64,{qrCodeBase64}' alt='QR Code PIX' />
            </div>
            
            <p style='text-align: center;'><strong>OU</strong></p>
            
            <p>Copie e cole o código PIX abaixo:</p>
            
            <div class='pix-code'>
                {qrCode}
            </div>
            
            <p style='color: #666; font-size: 14px;'>
                ⚠️ Este PIX é válido por 24 horas. Após o pagamento, seu acesso será liberado automaticamente em até 5 minutos.
            </p>
            
            <p style='margin-top: 30px;'>
                <strong>Benefícios do Seu Gerente:</strong>
            </p>
            <ul>
                <li>✅ Gestão completa de moradores</li>
                <li>✅ Controle de receitas e despesas</li>
                <li>✅ Relatórios financeiros detalhados</li>
                <li>✅ Notificações automáticas</li>
                <li>✅ Suporte prioritário</li>
            </ul>
        </div>
        
        <div class='footer'>
            <p>Dúvidas? Entre em contato: suporte@seugerente.com.br</p>
            <p>&copy; 2026 Seu Gerente - Todos os direitos reservados</p>
        </div>
    </div>
</body>
</html>";

        await _emailService.EnviarNotificacaoAsync(cadastro.Email, assunto, corpo);
        _logger.LogInformation("Email de cobrança enviado para {Email}", cadastro.Email);
    }

    /// <summary>
    /// Processa cobranças mensais para todos os usuários ativos
    /// </summary>
    public async Task ProcessarCobrancasMensaisAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Iniciando processamento de cobranças mensais");

        var cadastros = await _cadastroRepository.GetAllAsync(cancellationToken);
        var cadastrosAtivos = cadastros.Where(c => c.Status == "ativo").ToList();

        _logger.LogInformation("Encontrados {Count} cadastros ativos para cobrança", cadastrosAtivos.Count);

        foreach (var cadastro in cadastrosAtivos)
        {
            try
            {
                var (paymentId, qrCode, qrCodeBase64) = await GerarCobrancaPixAsync(cadastro.Id, cancellationToken);
                await EnviarEmailCobrancaAsync(cadastro.Id, qrCode, qrCodeBase64, cancellationToken);
                
                _logger.LogInformation("Cobrança processada para {Email}", cadastro.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar cobrança para usuário {UsuarioId}", cadastro.Id);
            }
        }

        _logger.LogInformation("Processamento de cobranças mensais concluído");
    }

    /// <summary>
    /// Verifica se um pagamento PIX foi aprovado e ativa a assinatura
    /// </summary>
    public async Task VerificarPagamentoPixAsync(string paymentId, CancellationToken cancellationToken = default)
    {
        var (status, dateApproved) = await _mercadoPagoService.GetPixPaymentStatusAsync(paymentId, cancellationToken);

        if (status == "approved")
        {
            // TODO: Buscar assinatura pelo payment_id ao invés do cadastro
            // A coluna mercadopago_payment_id foi removida do cadastro
            // Deve ser implementada busca na tabela de assinaturas
            _logger.LogInformation("✅ Pagamento PIX aprovado: {PaymentId}", paymentId);
            
            /* CÓDIGO ANTIGO - REMOVER APÓS IMPLEMENTAR ASSINATURA
            var cadastros = await _cadastroRepository.GetAllAsync(cancellationToken);
            var cadastro = cadastros.FirstOrDefault(c => c.MercadopagoPaymentId == paymentId);

            if (cadastro != null)
            {
                cadastro.Status = "ativo";
                cadastro.UpdatedAt = DateTime.UtcNow;
                await _cadastroRepository.UpdateAsync(cadastro, cancellationToken);

                _logger.LogInformation("✅ Pagamento PIX aprovado - Assinatura ativada para usuário {UsuarioId}", cadastro.Id);
            }
            */
        }
        else if (status == "cancelled" || status == "expired")
        {
            _logger.LogWarning("Pagamento PIX {PaymentId} foi {Status}", paymentId, status);
        }
    }
}

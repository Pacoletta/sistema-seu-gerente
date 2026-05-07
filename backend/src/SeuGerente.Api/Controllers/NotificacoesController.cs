using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.Interfaces;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificacoesController : ControllerBase
{
    private readonly IWhatsAppService _whatsAppService;
    private readonly IEmailService _emailService;
    private readonly MoradorService _moradorService;
    private readonly ILogger<NotificacoesController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private const string BUCKET_RELATORIOS = "relatorios-temp";

    public NotificacoesController(
        IWhatsAppService whatsAppService,
        IEmailService emailService,
        MoradorService moradorService,
        ILogger<NotificacoesController> logger,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _whatsAppService = whatsAppService;
        _emailService = emailService;
        _moradorService = moradorService;
        _logger = logger;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Envia WhatsApp de cobrança
    /// </summary>
    [HttpPost("whatsapp/cobranca")]
    public async Task<IActionResult> EnviarWhatsAppCobranca(
        [FromBody] EnviarCobrancaRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Telefone))
            {
                return BadRequest(new { message = "Telefone é obrigatório para WhatsApp" });
            }

            var sucesso = await _whatsAppService.SendCobrancaAsync(
                request.Telefone,
                request.NomeDevedor,
                request.Valor,
                request.Vencimento,
                cancellationToken);

            if (sucesso)
            {
                return Ok(new { message = "WhatsApp enviado com sucesso" });
            }

            return BadRequest(new { message = "Falha ao enviar WhatsApp" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar WhatsApp de cobrança");
            return StatusCode(500, new { message = "Erro ao enviar WhatsApp" });
        }
    }

    /// <summary>
    /// Envia email de cobrança
    /// </summary>
    [HttpPost("email/cobranca")]
    public async Task<IActionResult> EnviarEmailCobranca(
        [FromBody] EnviarCobrancaRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email é obrigatório" });
            }

            _logger.LogInformation("📧 Enviando email de cobrança para {Email}", request.Email);

            var sucesso = await _emailService.EnviarCobrancaAsync(
                request.Email,
                request.NomeDevedor,
                request.Valor,
                request.Vencimento,
                cancellationToken);

            if (sucesso)
            {
                _logger.LogInformation("✅ Email enviado com sucesso para {Email}", request.Email);
                return Ok(new { message = "Email enviado com sucesso" });
            }

            _logger.LogWarning("⚠️ Falha ao enviar email para {Email}", request.Email);
            return BadRequest(new { message = "Falha ao enviar email" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao enviar email de cobrança para {Email}", request.Email);
            return StatusCode(500, new { message = $"Erro ao enviar email: {ex.Message}" });
        }
    }

    /// <summary>
    /// Envia email de cobrança em lote
    /// </summary>
    [HttpPost("email/cobranca-lote")]
    public async Task<IActionResult> EnviarEmailCobrancaLote(
        [FromBody] EnviarCobrancaLoteRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            int enviados = 0;
            foreach (var morador in request.Moradores)
            {
                var sucesso = await _emailService.EnviarCobrancaAsync(
                    morador.Email!,
                    morador.Nome,
                    morador.Valor,
                    morador.Vencimento,
                    cancellationToken);

                if (sucesso) enviados++;
            }

            return Ok(new { message = $"{enviados} emails enviados com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar emails de cobrança em lote");
            return StatusCode(500, new { message = "Erro ao enviar emails" });
        }
    }

    /// <summary>
    /// Envia WhatsApp de cobrança em lote
    /// </summary>
    [HttpPost("whatsapp/cobranca-lote")]
    public async Task<IActionResult> EnviarWhatsAppCobrancaLote(
        [FromBody] EnviarCobrancaLoteWhatsAppRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            int enviados = 0;
            foreach (var morador in request.Moradores)
            {
                var sucesso = await _whatsAppService.SendCobrancaAsync(
                    morador.Telefone,
                    morador.Nome,
                    morador.Valor,
                    morador.Vencimento,
                    cancellationToken);

                if (sucesso) enviados++;
            }

            return Ok(new { message = $"{enviados} mensagens enviadas com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar WhatsApp de cobrança em lote");
            return StatusCode(500, new { message = "Erro ao enviar WhatsApp" });
        }
    }

    /// <summary>
    /// Envia relatório por email
    /// </summary>
    [HttpPost("email/enviar-relatorio")]
    public async Task<IActionResult> EnviarRelatorioEmail(
        [FromBody] EnviarRelatorioEmailRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            // Valida PDF
            if (string.IsNullOrWhiteSpace(request.PdfBase64))
            {
                return BadRequest(new { error = "PDF não informado" });
            }

            var usuarioId = request.UsuarioId;
            if (string.IsNullOrWhiteSpace(usuarioId))
            {
                return BadRequest(new { error = "UsuarioId não informado" });
            }

            _logger.LogInformation("📊 Base64 recebido para email - Tamanho: {Size} chars", request.PdfBase64.Length);
            
            // Converte base64 para bytes
            byte[] pdfBytes;
            try
            {
                pdfBytes = Convert.FromBase64String(request.PdfBase64);
                _logger.LogInformation("📊 PDF convertido - Tamanho: {Size} bytes ({KB} KB)", pdfBytes.Length, pdfBytes.Length / 1024);
            }
            catch (FormatException)
            {
                _logger.LogError("❌ Base64 inválido");
                return BadRequest(new { error = "Base64 inválido" });
            }

            if (pdfBytes.Length == 0)
            {
                _logger.LogError("❌ PDF vazio após conversão de base64!");
                return StatusCode(500, new { error = "PDF vazio" });
            }

            var enviados = 0;
            var falhas = 0;

            if (request.Todos)
            {
                // Envia para todos os moradores com email
                if (!Guid.TryParse(usuarioId, out var usuarioGuid))
                {
                    return BadRequest(new { error = "UsuarioId inválido" });
                }
                
                var moradores = await _moradorService.GetAllByUsuarioAsync(usuarioGuid, cancellationToken);
                
                foreach (var morador in moradores)
                {
                    if (string.IsNullOrWhiteSpace(morador.Email))
                    {
                        _logger.LogWarning("Morador {Nome} (Apt {Numero}) não possui email", morador.Nome, morador.Numero);
                        continue;
                    }

                    var sucesso = await _emailService.EnviarRelatorioAsync(
                        morador.Email,
                        morador.Nome,
                        pdfBytes,
                        cancellationToken);

                    if (sucesso)
                    {
                        enviados++;
                        _logger.LogInformation("✅ Relatório enviado por email para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);
                    }
                    else
                    {
                        falhas++;
                        _logger.LogWarning("❌ Falha ao enviar email para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);
                    }

                    // Delay para evitar rate limiting
                    await Task.Delay(500, cancellationToken);
                }

                return Ok(new { message = $"{enviados} relatórios enviados com sucesso ({falhas} falhas)", enviados, falhas });
            }
            else
            {
                // Envia para um email específico
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { error = "Email não informado" });
                }

                var nomeDestinatario = request.Nome ?? "Morador";
                
                var sucesso = await _emailService.EnviarRelatorioAsync(
                    request.Email,
                    nomeDestinatario,
                    pdfBytes,
                    cancellationToken);

                if (sucesso)
                {
                    _logger.LogInformation("✅ Relatório individual enviado por email para {Email}", request.Email);
                    return Ok(new { message = "Relatório enviado com sucesso" });
                }
                else
                {
                    _logger.LogWarning("❌ Falha ao enviar email para {Email}", request.Email);
                    return BadRequest(new { error = "Falha ao enviar relatório" });
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar relatório por email");
            return StatusCode(500, new { message = "Erro ao enviar relatório" });
        }
    }

    /// <summary>
    /// Envia relatório por WhatsApp
    /// </summary>
    [HttpPost("whatsapp/enviar-relatorio")]
    public async Task<IActionResult> EnviarRelatorioWhatsApp(
        [FromBody] EnviarRelatorioWhatsAppRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            // Valida PDF
            if (string.IsNullOrWhiteSpace(request.PdfBase64))
            {
                return BadRequest(new { error = "PDF não informado" });
            }

            // Busca usuarioId do token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var usuarioId))
            {
                return Unauthorized(new { error = "Usuário não autenticado" });
            }

            // Configurações do Supabase
            var supabaseUrl = _configuration["Supabase:Url"];
            var serviceRoleKey = _configuration["Supabase:ServiceRoleKey"];
            
            if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(serviceRoleKey))
            {
                _logger.LogError("❌ Configurações do Supabase não encontradas");
                return StatusCode(500, new { error = "Configuração do servidor incompleta" });
            }

            // Upload PDF para Supabase
            var fileName = $"{usuarioId}/relatorio-{request.MesAno}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}.pdf";
            var uploadUrl = $"{supabaseUrl}/storage/v1/object/{BUCKET_RELATORIOS}/{fileName}";

            _logger.LogInformation("📊 Base64 recebido - Tamanho: {Size} chars", request.PdfBase64.Length);
            
            var httpClient = _httpClientFactory.CreateClient();
            var pdfBytes = Convert.FromBase64String(request.PdfBase64);
            
            _logger.LogInformation("📊 PDF convertido - Tamanho: {Size} bytes ({KB} KB)", pdfBytes.Length, pdfBytes.Length / 1024);
            
            if (pdfBytes.Length == 0)
            {
                _logger.LogError("❌ PDF vazio após conversão de base64!");
                return StatusCode(500, new { error = "PDF vazio" });
            }
            
            var content = new ByteArrayContent(pdfBytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");

            var uploadRequest = new HttpRequestMessage(HttpMethod.Post, uploadUrl)
            {
                Content = content
            };
            uploadRequest.Headers.Add("Authorization", $"Bearer {serviceRoleKey}");
            uploadRequest.Headers.Add("apikey", serviceRoleKey);

            var uploadResponse = await httpClient.SendAsync(uploadRequest, cancellationToken);

            if (!uploadResponse.IsSuccessStatusCode)
            {
                var errorContent = await uploadResponse.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("❌ Falha no upload do PDF: {StatusCode} - {Error}", uploadResponse.StatusCode, errorContent);
                return StatusCode(500, new { error = "Erro ao fazer upload do relatório" });
            }

            var uploadResult = await uploadResponse.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogInformation("✅ Upload bem-sucedido! Resposta: {Response}", uploadResult);

            // Gerar URL pública
            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/{BUCKET_RELATORIOS}/{fileName}";
            _logger.LogInformation("📄 PDF salvo no Supabase: {Url}", publicUrl);

            // Verificar se o arquivo está acessível
            try
            {
                var verifyResponse = await httpClient.GetAsync(publicUrl, cancellationToken);
                if (verifyResponse.IsSuccessStatusCode)
                {
                    var fileSize = verifyResponse.Content.Headers.ContentLength;
                    _logger.LogInformation("✅ Arquivo verificado! Tamanho público: {Size} bytes", fileSize);
                }
                else
                {
                    _logger.LogWarning("⚠️ Arquivo não acessível publicamente! Status: {Status}", verifyResponse.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Erro ao verificar arquivo público");
            }

            var enviados = 0;
            var falhas = 0;

            try
            {
                if (request.Todos)
                {
                    // Envia para todos os moradores com telefone
                    var moradores = await _moradorService.GetAllByUsuarioAsync(usuarioId, cancellationToken);
                    
                    foreach (var morador in moradores)
                    {
                        var telefone = morador.Telefone ?? morador.WhatsApp;
                        if (string.IsNullOrWhiteSpace(telefone))
                        {
                            _logger.LogWarning("Morador {Nome} (Apt {Numero}) não possui telefone", morador.Nome, morador.Numero);
                            continue;
                        }

                        var caption = $"📊 *Relatório {request.MesAno}*\n\nOlá, {morador.Nome}! Segue o relatório mensal do condomínio.";

                        var sucesso = await _whatsAppService.SendDocumentAsync(
                            telefone,
                            publicUrl,
                            caption,
                            $"Relatorio-{request.MesAno}.pdf",
                            cancellationToken);

                        if (sucesso)
                        {
                            enviados++;
                            _logger.LogInformation("✅ Relatório enviado para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);
                        }
                        else
                        {
                            falhas++;
                            _logger.LogWarning("❌ Falha ao enviar para {Nome} (Apt {Numero})", morador.Nome, morador.Numero);
                        }

                        // Delay para evitar rate limiting
                        await Task.Delay(1000, cancellationToken);
                    }
                }
                else
                {
                    // Envia individual
                    if (string.IsNullOrWhiteSpace(request.Numero))
                    {
                        return BadRequest(new { error = "Número de telefone não informado" });
                    }

                    var caption = $"📊 *Relatório {request.MesAno}*\n\nSegue o relatório mensal do condomínio.";

                    var sucesso = await _whatsAppService.SendDocumentAsync(
                        request.Numero,
                        publicUrl,
                        caption,
                        $"Relatorio-{request.MesAno}.pdf",
                        cancellationToken);

                    if (sucesso)
                    {
                        enviados = 1;
                        _logger.LogInformation("✅ Relatório individual enviado para {Telefone}", request.Numero);
                    }
                    else
                    {
                        falhas = 1;
                    }
                }
            }
            finally
            {
                // Aguardar 15 segundos para garantir que a Evolution API baixou o PDF
                _logger.LogInformation("⏳ Aguardando 15s para Evolution API processar o arquivo...");
                await Task.Delay(15000, cancellationToken);
                
                // Deletar arquivo do Supabase após envio
                try
                {
                    var deleteUrl = $"{supabaseUrl}/storage/v1/object/{BUCKET_RELATORIOS}/{fileName}";
                    var deleteRequest = new HttpRequestMessage(HttpMethod.Delete, deleteUrl);
                    deleteRequest.Headers.Add("Authorization", $"Bearer {serviceRoleKey}");
                    deleteRequest.Headers.Add("apikey", serviceRoleKey);

                    var deleteResponse = await httpClient.SendAsync(deleteRequest, cancellationToken);
                    
                    if (deleteResponse.IsSuccessStatusCode)
                    {
                        _logger.LogInformation("🗑️ PDF deletado do Supabase: {FileName}", fileName);
                    }
                    else
                    {
                        _logger.LogWarning("⚠️ Falha ao deletar PDF do Supabase: {FileName}", fileName);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Erro ao deletar PDF do Supabase");
                }
            }

            if (request.Todos)
            {
                return Ok(new { message = $"{enviados} relatórios enviados com sucesso ({falhas} falhas)", enviados, falhas });
            }
            else
            {
                if (enviados > 0)
                {
                    return Ok(new { message = "Relatório enviado com sucesso" });
                }
                return BadRequest(new { error = "Falha ao enviar relatório" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar relatório por WhatsApp");
            return StatusCode(500, new { error = "Erro ao enviar relatório" });
        }
    }

    /// <summary>
    /// Verifica status da instância WhatsApp
    /// </summary>
    [HttpGet("whatsapp/status")]
    public async Task<IActionResult> VerificarStatusWhatsApp(CancellationToken cancellationToken)
    {
        try
        {
            var status = await _whatsAppService.GetInstanceStatusAsync(cancellationToken);
            return Ok(new { conectado = status });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar status WhatsApp");
            return StatusCode(500, new { message = "Erro ao verificar status" });
        }
    }
}

public record EnviarCobrancaRequest(
    string? Telefone,
    string? Email,
    string NomeDevedor,
    decimal Valor,
    DateTime Vencimento
);

public record EnviarCobrancaLoteRequest(
    List<MoradorCobranca> Moradores
);

public record MoradorCobranca(
    string? Email,
    string Nome,
    decimal Valor,
    DateTime Vencimento
);

public record EnviarCobrancaLoteWhatsAppRequest(
    string UsuarioId,
    List<MoradorCobrancaWhatsApp> Moradores
);

public record MoradorCobrancaWhatsApp(
    string Telefone,
    string Nome,
    decimal Valor,
    DateTime Vencimento
);

public record EnviarRelatorioEmailRequest(
    string? Email,
    string? Nome,
    string? Conteudo,
    string UsuarioId,
    string MesAno,
    string PdfBase64,
    bool Todos
);

public record EnviarRelatorioWhatsAppRequest(
    string? Telefone,
    string? Nome,
    string? Conteudo,
    string? Numero,
    string UsuarioId,
    string MesAno,
    string PdfBase64,
    bool Todos
);

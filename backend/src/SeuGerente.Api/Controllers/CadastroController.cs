using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Services;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CadastroController : ControllerBase
{
    private readonly CadastroService _cadastroService;
    private readonly ILogger<CadastroController> _logger;

    public CadastroController(CadastroService cadastroService, ILogger<CadastroController> logger)
    {
        _cadastroService = cadastroService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Retorna o status da assinatura do usuário autenticado
    /// </summary>
    [HttpGet("status")]
    public async Task<ActionResult<CadastroStatusDTO>> GetStatus(CancellationToken cancellationToken)
    {
        var usuarioId = GetUsuarioId();
        _logger.LogWarning("🔍 GET /status - Procurando cadastro com ID: {UsuarioId}", usuarioId);
        var status = await _cadastroService.GetStatusAsync(usuarioId, cancellationToken);
        if (status == null)
        {
            _logger.LogWarning("❌ GET /status - Cadastro NÃO encontrado para ID: {UsuarioId}", usuarioId);
            return NotFound(new { message = "Cadastro não encontrado", usuarioId = usuarioId.ToString() });
        }
        _logger.LogInformation("✅ GET /status - Cadastro encontrado para ID: {UsuarioId}", usuarioId);
        return Ok(status);
    }

    /// <summary>
    /// DEBUG: Lista todos os cadastros (apenas IDs e emails)
    /// </summary>
    [AllowAnonymous]
    [HttpGet("debug/list")]
    public async Task<ActionResult> ListAllCadastros(CancellationToken cancellationToken)
    {
        var cadastros = await _cadastroService.GetAllCadastrosDebugAsync(cancellationToken);
        return Ok(cadastros);
    }

    /// <summary>
    /// Retorna os dados completos do usuário autenticado
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<CadastroDTO>> GetMe(CancellationToken cancellationToken)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var cadastro = await _cadastroService.GetByIdAsync(usuarioId, cancellationToken);
            
            if (cadastro == null)
            {
                return NotFound(new { message = "Cadastro não encontrado" });
            }
            
            return Ok(cadastro);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Usuário não autenticado" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar dados do usuário");
            return StatusCode(500, new { error = "Erro ao buscar dados do usuário" });
        }
    }

    /// <summary>
    /// Busca cadastro por email (usado pelo frontend para obter quantidade de apartamentos)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<CadastroDTO>> GetByEmail([FromQuery] string email, CancellationToken cancellationToken)
    {
        var cadastro = await _cadastroService.GetByEmailAsync(email, cancellationToken);
        if (cadastro == null)
        {
            return NotFound(new { message = "Cadastro não encontrado" });
        }
        return Ok(cadastro);
    }

    /// <summary>
    /// Ativa a assinatura do usuário (temporário para testes)
    /// </summary>
    [HttpPost("ativar")]
    public async Task<ActionResult> AtivarAssinatura(CancellationToken cancellationToken)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            await _cadastroService.AtivarAssinaturaAsync(usuarioId, cancellationToken);
            return Ok(new { message = "Assinatura ativada com sucesso", status = "ativo" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao ativar assinatura");
            return StatusCode(500, new { error = "Erro ao ativar assinatura" });
        }
    }

    /// <summary>
    /// Cria cadastro inicial (público - após criação no Supabase Auth)
    /// </summary>
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult> CriarCadastroInicial([FromBody] CriarCadastroRequest request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("📝 Recebendo cadastro inicial para user_id: {UserId}", request.user_id);
            _logger.LogInformation("📧 Email: {Email}, Nome: {Nome}", request.email, request.nome);

            await _cadastroService.CriarOuAtualizarAsync(request, cancellationToken);
            
            _logger.LogInformation("✅ Cadastro criado com sucesso para {Email}", request.email);
            return Ok(new { success = true });
        }
        catch (FormatException ex)
        {
            _logger.LogError(ex, "❌ Erro de formato no user_id: {UserId}", request.user_id);
            return BadRequest(new { error = "ID de usuário inválido", details = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao criar cadastro inicial para {Email}", request.email);
            return StatusCode(500, new { error = "Erro ao criar cadastro", details = ex.Message });
        }
    }
}

public class CriarCadastroRequest
{
    public required string user_id { get; set; }
    public required string email { get; set; }
    public required string nome { get; set; }
    public required string cnpj_cpf { get; set; }
    public required string whatsapp { get; set; }
    public required string nome_condominio { get; set; }
    public required int quantidade_apartamentos { get; set; }
}

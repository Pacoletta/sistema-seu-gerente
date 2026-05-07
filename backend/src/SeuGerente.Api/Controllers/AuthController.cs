using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Interfaces;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("UsuarioId não encontrado no token"));
    }

    /// <summary>
    /// Realiza login e retorna tokens JWT
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginDTO loginDto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.LoginAsync(loginDto, cancellationToken);
            _logger.LogInformation("Login realizado: {Email}", loginDto.Email);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Login falhou para {Email}: {Message}", loginDto.Email, ex.Message);
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Registra novo usuário e retorna tokens JWT
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponseDTO>> Register([FromBody] RegisterDTO registerDto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.RegisterAsync(registerDto, cancellationToken);
            _logger.LogInformation("Registro realizado: {Email}", registerDto.Email);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Renova o access token usando refresh token
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponseDTO>> Refresh([FromBody] RefreshTokenDTO refreshTokenDto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken, cancellationToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Refresh token inválido: {Message}", ex.Message);
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Retorna dados do usuário autenticado a partir do JWT
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<UserMeDTO> Me()
    {
        var usuarioId = GetUsuarioId();
        var email = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
        var nome = User.FindFirst(ClaimTypes.Name)?.Value
            ?? User.FindFirst("name")?.Value
            ?? email.Split('@')[0];
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        return Ok(new UserMeDTO
        {
            Id = usuarioId.ToString(),
            Email = email,
            Nome = nome,
            Role = role
        });
    }

    /// <summary>
    /// Logout — client-side deve limpar o cookie auth_token
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public ActionResult Logout()
    {
        _logger.LogInformation("Logout: {UsuarioId}", GetUsuarioId());
        return Ok(new { success = true });
    }
}

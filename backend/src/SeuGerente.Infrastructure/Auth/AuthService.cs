using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Entities;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    // Refresh tokens em memória — suficiente para dev local.
    // Em produção considere persistir em tabela.
    private static readonly Dictionary<string, (Guid UsuarioId, string Email, string? Role, DateTime Expiration)> _refreshTokens = new();

    public AuthService(
        ApplicationDbContext context,
        ITokenService tokenService,
        IConfiguration configuration,
        IEmailService emailService,
        ILogger<AuthService> logger)
    {
        _context = context;
        _tokenService = tokenService;
        _configuration = configuration;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<LoginResponseDTO> LoginAsync(LoginDTO loginDto, CancellationToken cancellationToken = default)
    {
        var email = loginDto.Email.ToLower();

        var cadastro = await _context.Cadastros
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Email.ToLower() == email, cancellationToken);

        if (cadastro != null && !string.IsNullOrEmpty(cadastro.SenhaHash)
            && BCrypt.Net.BCrypt.Verify(loginDto.Password, cadastro.SenhaHash))
        {
            return await GerarTokensAsync(cadastro.Id, cadastro.Email, cadastro.Nome, role: "user");
        }

        var admin = await _context.Administrativos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Email.ToLower() == email, cancellationToken);

        if (admin != null && admin.Ativo && !string.IsNullOrEmpty(admin.SenhaHash)
            && BCrypt.Net.BCrypt.Verify(loginDto.Password, admin.SenhaHash))
        {
            return await GerarTokensAsync(admin.Id, admin.Email, admin.Nome, role: "admin");
        }

        throw new UnauthorizedAccessException("Credenciais inválidas");
    }

    public async Task<LoginResponseDTO> RegisterAsync(RegisterDTO registerDto, CancellationToken cancellationToken = default)
    {
        var emailExistente = await _context.Cadastros
            .AnyAsync(c => c.Email.ToLower() == registerDto.Email.ToLower(), cancellationToken);

        if (emailExistente)
            throw new InvalidOperationException("E-mail já cadastrado");

        var senhaHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        var cadastro = new Cadastro
        {
            Id = Guid.NewGuid(),
            Email = registerDto.Email.ToLower(),
            SenhaHash = senhaHash,
            Nome = registerDto.Nome,
            Status = "pendente",
            CreatedAt = DateTime.UtcNow
        };

        _context.Cadastros.Add(cadastro);
        await _context.SaveChangesAsync(cancellationToken);

        // Envia email de boas-vindas (sem aguardar — não bloqueia o registro em caso de falha)
        _ = Task.Run(async () =>
        {
            try
            {
                var assunto = "👋 Bem-vindo ao Sistema Seu Gerente!";
                var corpo = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;'>
                        <div style='background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 30px; border-radius: 12px 12px 0 0; text-align: center;'>
                            <h1 style='color: white; margin: 0; font-size: 24px; font-weight: 700;'>Bem-vindo!</h1>
                            <p style='color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;'>Sistema Seu Gerente</p>
                        </div>
                        <div style='background-color: white; padding: 32px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>
                            <p style='font-size: 17px; color: #1e293b; margin: 0 0 16px;'>Olá, <strong>{cadastro.Nome}</strong>!</p>
                            <p style='font-size: 15px; color: #64748b; margin: 0 0 16px;'>Sua conta foi criada com sucesso. Agora você pode acessar o sistema e começar a gerenciar seu condomínio.</p>
                            <p style='font-size: 15px; color: #64748b; margin: 0 0 24px;'>Caso tenha alguma dúvida ou precise de ajuda, entre em contato com nosso suporte.</p>
                            <p style='font-size: 13px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; margin: 0;'>Esta é uma mensagem automática do Sistema Seu Gerente.</p>
                        </div>
                    </div>";

                await _emailService.EnviarNotificacaoAsync(cadastro.Email, assunto, corpo);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Falha ao enviar email de boas-vindas para {Email}", cadastro.Email);
            }
        });

        return await GerarTokensAsync(cadastro.Id, cadastro.Email, cadastro.Nome, role: "user");
    }

    public Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        if (!_refreshTokens.TryGetValue(refreshToken, out var tokenData))
            throw new UnauthorizedAccessException("Refresh token inválido");

        if (tokenData.Expiration < DateTime.UtcNow)
        {
            _refreshTokens.Remove(refreshToken);
            throw new UnauthorizedAccessException("Refresh token expirado");
        }

        _refreshTokens.Remove(refreshToken);
        return GerarTokensAsync(tokenData.UsuarioId, tokenData.Email, nome: null, tokenData.Role);
    }

    public Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(token);
        return Task.FromResult(principal != null);
    }

    private Task<LoginResponseDTO> GerarTokensAsync(Guid usuarioId, string email, string? nome, string? role)
    {
        var accessToken = _tokenService.GenerateAccessToken(usuarioId, email, role);
        var refreshToken = _tokenService.GenerateRefreshToken();

        var expirationDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"] ?? "7");
        _refreshTokens[refreshToken] = (usuarioId, email, role, DateTime.UtcNow.AddDays(expirationDays));

        var expiresIn = int.Parse(_configuration["JwtSettings:ExpirationMinutes"] ?? "60") * 60;

        return Task.FromResult(new LoginResponseDTO
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = expiresIn,
            UsuarioId = usuarioId,
            Email = email,
            Nome = nome,
            Role = role
        });
    }
}

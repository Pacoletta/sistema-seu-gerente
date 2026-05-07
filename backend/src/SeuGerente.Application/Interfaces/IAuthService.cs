using SeuGerente.Application.DTOs;

namespace SeuGerente.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDTO> LoginAsync(LoginDTO loginDto, CancellationToken cancellationToken = default);
    Task<LoginResponseDTO> RegisterAsync(RegisterDTO registerDto, CancellationToken cancellationToken = default);
    Task<LoginResponseDTO> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
}

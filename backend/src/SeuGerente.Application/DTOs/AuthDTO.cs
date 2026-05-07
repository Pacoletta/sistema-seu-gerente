namespace SeuGerente.Application.DTOs;

public class LoginDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Nome { get; set; }
}

public class LoginResponseDTO
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public Guid UsuarioId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Nome { get; set; }
    public string? Role { get; set; }
}

public class RefreshTokenDTO
{
    public string RefreshToken { get; set; } = string.Empty;
}

public class UserMeDTO
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string? Role { get; set; }
}

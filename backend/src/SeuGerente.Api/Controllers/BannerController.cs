using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.DTOs;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BannerController : ControllerBase
{
    private readonly IBannerRepository _bannerRepository;
    private readonly IAdministrativoRepository _administrativoRepository;
    private readonly IStorageService _storageService;
    private readonly ILogger<BannerController> _logger;

    public BannerController(
        IBannerRepository bannerRepository,
        IAdministrativoRepository administrativoRepository,
        IStorageService storageService,
        ILogger<BannerController> logger)
    {
        _bannerRepository = bannerRepository;
        _administrativoRepository = administrativoRepository;
        _storageService = storageService;
        _logger = logger;
    }

    private async Task<bool> IsAdminAsync()
    {
        var email = User?.FindFirst("email")?.Value
            ?? User?.FindFirst(ClaimTypes.Email)?.Value
            ?? User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User?.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(email)) return false;
        return await _administrativoRepository.IsAdminAsync(email);
    }

    /// <summary>
    /// Lista banners ativos — endpoint público para a landing page
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<BannerDTO>>> GetAtivos(CancellationToken cancellationToken)
    {
        var banners = await _bannerRepository.GetAllAtivosAsync(cancellationToken);
        return Ok(banners.Select(ToDto));
    }

    /// <summary>
    /// Lista todos os banners — admin only
    /// </summary>
    [HttpGet("todos")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<BannerDTO>>> GetTodos(CancellationToken cancellationToken)
    {
        if (!await IsAdminAsync()) return Forbid();
        var banners = await _bannerRepository.GetAllAsync(cancellationToken);
        return Ok(banners.Select(ToDto));
    }

    /// <summary>
    /// Upload de novo banner — admin only
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<BannerDTO>> Upload(
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        if (!await IsAdminAsync()) return Forbid();

        if (arquivo == null || arquivo.Length == 0)
            return BadRequest(new { message = "Arquivo inválido" });

        var ext = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        if (!allowed.Contains(ext))
            return BadRequest(new { message = "Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF." });

        using var ms = new MemoryStream();
        await arquivo.CopyToAsync(ms, cancellationToken);
        var bytes = ms.ToArray();

        var objectPath = $"banners/{Guid.NewGuid()}{ext}";
        var url = await _storageService.UploadFileAsync(bytes, objectPath, arquivo.ContentType, cancellationToken);

        var maxOrdem = await _bannerRepository.GetMaxOrdemAsync(cancellationToken);
        var banner = new Banner
        {
            Id = Guid.NewGuid(),
            ImagemUrl = url,
            ObjectPath = objectPath,
            Ordem = maxOrdem + 1,
            Ativo = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _bannerRepository.CreateAsync(banner, cancellationToken);
        _logger.LogInformation("Banner criado: {Id}, URL: {Url}", created.Id, created.ImagemUrl);
        return Ok(ToDto(created));
    }

    /// <summary>
    /// Remove banner — admin only
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        if (!await IsAdminAsync()) return Forbid();

        var banner = await _bannerRepository.GetByIdAsync(id, cancellationToken);
        if (banner == null)
            return NotFound(new { message = "Banner não encontrado" });

        try
        {
            if (!string.IsNullOrEmpty(banner.ObjectPath))
                await _storageService.DeleteObjectAsync(banner.ObjectPath, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Erro ao deletar arquivo do storage para banner {Id}", id);
        }

        await _bannerRepository.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Banner removido: {Id}", id);
        return NoContent();
    }

    private static BannerDTO ToDto(Banner b) => new()
    {
        Id = b.Id,
        ImagemUrl = b.ImagemUrl,
        Ordem = b.Ordem,
        Ativo = b.Ativo,
        CreatedAt = b.CreatedAt
    };
}

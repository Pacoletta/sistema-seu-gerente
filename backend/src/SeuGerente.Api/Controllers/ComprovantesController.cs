using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Application.Interfaces;

namespace SeuGerente.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ComprovantesController : ControllerBase
{
    private readonly IStorageService _storageService;
    private readonly ILogger<ComprovantesController> _logger;

    private static readonly string[] AllowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public ComprovantesController(IStorageService storageService, ILogger<ComprovantesController> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    [HttpPost("upload/despesas")]
    public async Task<IActionResult> UploadDespesa(
        [FromForm] IFormFile file,
        [FromForm] string despesa_id,
        [FromForm] string user_id,
        CancellationToken cancellationToken)
    {
        var validation = ValidateFile(file);
        if (validation != null) return validation;

        try
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var objectPath = $"comprovantes-despesas/{user_id}/{despesa_id}_{timestamp}{ext}";

            _logger.LogInformation("Upload comprovante despesa: {ObjectPath}", objectPath);

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);

            var publicUrl = await _storageService.UploadFileAsync(
                ms.ToArray(), objectPath, file.ContentType ?? "application/octet-stream", cancellationToken);

            _logger.LogInformation("Upload concluído: {Url}", publicUrl);
            return Ok(new { publicUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fazer upload de comprovante de despesa");
            return StatusCode(500, new { message = "Erro ao fazer upload do arquivo" });
        }
    }

    [HttpPost("upload/receitas")]
    public async Task<IActionResult> UploadReceita(
        [FromForm] IFormFile file,
        [FromForm] string pagamento_id,
        [FromForm] string user_id,
        CancellationToken cancellationToken)
    {
        var validation = ValidateFile(file);
        if (validation != null) return validation;

        try
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var objectPath = $"comprovantes-receitas/{user_id}/{pagamento_id}_{timestamp}{ext}";

            _logger.LogInformation("Upload comprovante receita: {ObjectPath}", objectPath);

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);

            var publicUrl = await _storageService.UploadFileAsync(
                ms.ToArray(), objectPath, file.ContentType ?? "application/octet-stream", cancellationToken);

            _logger.LogInformation("Upload concluído: {Url}", publicUrl);
            return Ok(new { publicUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fazer upload de comprovante de receita");
            return StatusCode(500, new { message = "Erro ao fazer upload do arquivo" });
        }
    }

    [HttpDelete("{*filePath}")]
    public async Task<IActionResult> DeleteComprovante(
        string filePath,
        [FromQuery] string? bucket = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(filePath))
            return BadRequest(new { message = "Caminho do arquivo não fornecido" });

        try
        {
            var prefix = bucket == "receitas" ? "comprovantes-receitas" : "comprovantes-despesas";
            var objectPath = $"{prefix}/{filePath}";

            _logger.LogInformation("Deletando comprovante: {ObjectPath}", objectPath);

            await _storageService.DeleteObjectAsync(objectPath, cancellationToken);

            return Ok(new { message = "Comprovante removido com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar comprovante: {FilePath}", filePath);
            return StatusCode(500, new { message = "Erro ao deletar arquivo" });
        }
    }

    private BadRequestObjectResult? ValidateFile(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Nenhum arquivo foi enviado" });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = "Tipo de arquivo não permitido. Use: PDF, JPG, PNG ou WEBP" });

        if (file.Length > MaxFileSize)
            return BadRequest(new { message = "Arquivo muito grande. Tamanho máximo: 5MB" });

        return null;
    }
}

using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeuGerente.Api.Middlewares;
using SeuGerente.Domain.Entities;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Api.Controllers;

/// <summary>
/// Gerencia a instância Evolution Go institucional (admin do sistema).
/// Token armazenado no banco igual às instâncias de usuário (IsAdmin = true).
/// </summary>
[ApiController]
[Route("api/admin")]
[Authorize]
[RequireAdmin]
public class AdminWhatsAppController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminWhatsAppController> _logger;

    private string EvolutionBaseUrl => (_configuration["EvolutionApi:BaseUrl"]
        ?? Environment.GetEnvironmentVariable("EVOLUTION_API_BASE_URL")
        ?? "https://evogo.sistemaseugerente.com.br").TrimEnd('/');

    private string ServerApiKey => _configuration["EvolutionApi:ServerApiKey"]
        ?? Environment.GetEnvironmentVariable("EVOLUTION_API_SERVER_KEY")
        ?? _configuration["EvolutionApi:ApiKey"]
        ?? Environment.GetEnvironmentVariable("EVOLUTION_API_KEY")
        ?? "";

    public AdminWhatsAppController(
        ApplicationDbContext context,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<AdminWhatsAppController> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    private HttpClient CriarClienteInstancia(string token)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", token);
        return client;
    }

    private HttpClient CriarClienteServidor()
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", ServerApiKey);
        return client;
    }

    private async Task<WhatsAppInstancia?> GetAdminInstancia(CancellationToken ct)
        => await _context.WhatsAppInstancias
            .FirstOrDefaultAsync(w => w.IsAdmin, ct);

    // GET /api/admin/whatsapp-status
    [HttpGet("whatsapp-status")]
    public async Task<IActionResult> GetStatus(CancellationToken cancellationToken)
    {
        var instancia = await GetAdminInstancia(cancellationToken);

        if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            return Ok(new { status = "not_configured", hasInstance = false });

        try
        {
            var client = CriarClienteInstancia(instancia.EvolutionToken);
            var res = await client.GetAsync($"{EvolutionBaseUrl}/instance/status", cancellationToken);

            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync(cancellationToken);
                var status = ExtrairStatus(json);

                instancia.Status = status;
                instancia.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);

                return Ok(new { status, hasInstance = true });
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Erro ao consultar status Evolution Go (admin)");
        }

        return Ok(new { status = instancia.Status ?? "error", hasInstance = true });
    }

    // POST /api/admin/whatsapp-connect
    [HttpPost("whatsapp-connect")]
    public async Task<IActionResult> Connect(CancellationToken cancellationToken)
    {
        var instancia = await GetAdminInstancia(cancellationToken);

        try
        {
            string instanceToken;

            if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            {
                const string instanceName = "sg_admin_institucional";
                var serverClient = CriarClienteServidor();

                // Token determinístico derivado da server key — sempre o mesmo para esta instância.
                // Garante que mesmo se o DB for apagado, o token pode ser recuperado.
                var adminToken = Convert.ToHexString(
                    System.Security.Cryptography.SHA256.HashData(
                        System.Text.Encoding.UTF8.GetBytes(ServerApiKey + instanceName)
                    )
                ).ToLowerInvariant();

                var createBody = JsonSerializer.Serialize(new { name = instanceName, token = adminToken });
                var createRes = await serverClient.PostAsync(
                    $"{EvolutionBaseUrl}/instance/create",
                    new StringContent(createBody, Encoding.UTF8, "application/json"),
                    cancellationToken);

                var createJson = await createRes.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogInformation("Evolution Go create (admin): {Status} - {Body}", createRes.StatusCode, createJson);

                if (!createRes.IsSuccessStatusCode && !createJson.Contains("already exists"))
                    return BadRequest(new { message = "Erro ao criar instância admin. Verifique a server key." });

                // Sempre usar adminToken — seja instância nova ou já existente com mesmo token
                instanceToken = adminToken;
                var evolutionId = instanceName;

                if (createRes.IsSuccessStatusCode)
                {
                    var createData = JsonSerializer.Deserialize<AdminEvolutionCreateResponse>(createJson, JsonOptions);
                    evolutionId = createData?.Data?.Id ?? createData?.Data?.Name ?? instanceName;
                    instanceToken = createData?.Data?.Token ?? adminToken;
                }
                else
                {
                    _logger.LogInformation("Instância admin já existe no Evolution Go — reutilizando com token determinístico");
                }

                if (instancia == null)
                {
                    instancia = new WhatsAppInstancia
                    {
                        Id = Guid.NewGuid(),
                        UsuarioId = null,
                        IsAdmin = true,
                        InstanceName = instanceName,
                        EvolutionInstanceId = evolutionId,
                        EvolutionToken = instanceToken,
                        Status = "disconnected",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.WhatsAppInstancias.Add(instancia);
                }
                else
                {
                    instancia.EvolutionInstanceId = evolutionId;
                    instancia.EvolutionToken = instanceToken;
                    instancia.InstanceName = instanceName;
                }

                await _context.SaveChangesAsync(cancellationToken);
            }
            else
            {
                instanceToken = instancia.EvolutionToken;
            }

            var instanceClient = CriarClienteInstancia(instanceToken);
            var connectBody = JsonSerializer.Serialize(new { immediate = false });
            await instanceClient.PostAsync(
                $"{EvolutionBaseUrl}/instance/connect",
                new StringContent(connectBody, Encoding.UTF8, "application/json"),
                cancellationToken);

            await Task.Delay(1500, cancellationToken);
            var qrRes = await instanceClient.GetAsync($"{EvolutionBaseUrl}/instance/qr", cancellationToken);
            var qrJson = await qrRes.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogInformation("Evolution Go QR (admin): {Status} - {Body}", qrRes.StatusCode, qrJson);

            var qrCode = ExtrairQrCode(qrJson);

            instancia.Status = "connecting";
            instancia.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { status = "connecting", qrCode });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao conectar instância Evolution Go (admin)");
            return StatusCode(500, new { message = $"Erro ao conectar: {ex.Message}" });
        }
    }

    // POST /api/admin/whatsapp-reconnect
    [HttpPost("whatsapp-reconnect")]
    public async Task<IActionResult> Reconnect(CancellationToken cancellationToken)
    {
        var instancia = await GetAdminInstancia(cancellationToken);

        if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            return BadRequest(new { message = "Nenhuma instância admin configurada. Use Conectar primeiro." });

        try
        {
            var client = CriarClienteInstancia(instancia.EvolutionToken);

            await client.DeleteAsync($"{EvolutionBaseUrl}/instance/logout", cancellationToken);
            await Task.Delay(1000, cancellationToken);

            var connectBody = JsonSerializer.Serialize(new { immediate = false });
            await client.PostAsync(
                $"{EvolutionBaseUrl}/instance/connect",
                new StringContent(connectBody, Encoding.UTF8, "application/json"),
                cancellationToken);

            await Task.Delay(1500, cancellationToken);
            var qrRes = await client.GetAsync($"{EvolutionBaseUrl}/instance/qr", cancellationToken);
            var qrJson = await qrRes.Content.ReadAsStringAsync(cancellationToken);
            var qrCode = ExtrairQrCode(qrJson);

            instancia.Status = "connecting";
            instancia.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { status = "connecting", qrCode });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao reconectar instância Evolution Go (admin)");
            return StatusCode(500, new { message = "Erro ao reconectar." });
        }
    }

    // POST /api/admin/whatsapp-disconnect
    [HttpPost("whatsapp-disconnect")]
    public async Task<IActionResult> Disconnect(CancellationToken cancellationToken)
    {
        var instancia = await GetAdminInstancia(cancellationToken);

        if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            return BadRequest(new { message = "Nenhuma instância admin configurada." });

        try
        {
            var client = CriarClienteInstancia(instancia.EvolutionToken);
            await client.PostAsync(
                $"{EvolutionBaseUrl}/instance/disconnect",
                new StringContent("{}", Encoding.UTF8, "application/json"),
                cancellationToken);

            instancia.Status = "disconnected";
            instancia.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "Instância admin desconectada." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao desconectar instância Evolution Go (admin)");
            return StatusCode(500, new { message = "Erro ao desconectar." });
        }
    }

    // DELETE /api/admin/whatsapp-instance
    [HttpDelete("whatsapp-instance")]
    public async Task<IActionResult> DeleteInstance(CancellationToken cancellationToken)
    {
        var instancia = await GetAdminInstancia(cancellationToken);

        if (instancia == null)
            return Ok(new { message = "Nenhum registro encontrado." });

        _context.WhatsAppInstancias.Remove(instancia);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Registro da instância admin removido do banco de dados");
        return Ok(new { message = "Registro removido. Use Conectar para iniciar uma nova sessão." });
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private static string ExtrairStatus(string json)
    {
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            static string Normalize(string? s) => s?.ToLowerInvariant() switch
            {
                "open" or "connected" => "open",
                "close" or "disconnected" => "close",
                "connecting" => "connecting",
                _ => "close"
            };

            if (root.TryGetProperty("data", out var data))
            {
                if (data.TryGetProperty("connected", out var connected) && connected.GetBoolean())
                    return "open";
                if (data.TryGetProperty("status", out var status))
                    return Normalize(status.GetString());
            }

            if (root.TryGetProperty("connected", out var connRoot) && connRoot.GetBoolean())
                return "open";

            if (root.TryGetProperty("status", out var statusRoot))
                return Normalize(statusRoot.GetString());
        }
        catch { }

        return "close";
    }

    private static string? ExtrairQrCode(string json)
    {
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            string? Normalizar(string? val)
            {
                if (string.IsNullOrEmpty(val)) return null;
                if (val.StartsWith("data:")) return val;
                if (val.Length > 100 && !val.Contains('@') && !val.Contains(' '))
                    return $"data:image/png;base64,{val}";
                return null; // raw QR text — não é renderizável como imagem
            }

            // Busca case-insensitive em todas as propriedades do root
            string? BuscarNaElement(JsonElement element)
            {
                foreach (var prop in element.EnumerateObject())
                {
                    var name = prop.Name.ToLowerInvariant();
                    if ((name == "qrcode" || name == "base64" || name == "qr") &&
                        prop.Value.ValueKind == JsonValueKind.String)
                    {
                        var result = Normalizar(prop.Value.GetString());
                        if (result != null) return result;
                    }
                }
                return null;
            }

            var fromRoot = BuscarNaElement(root);
            if (fromRoot != null) return fromRoot;

            if (root.TryGetProperty("data", out var data))
                return BuscarNaElement(data);
        }
        catch { }

        return null;
    }

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };
}

// ── Models ──────────────────────────────────────────────────────────────────

file class AdminEvolutionCreateResponse
{
    [JsonPropertyName("data")]
    public AdminEvolutionInstanceData? Data { get; set; }
}

file class AdminEvolutionInstanceData
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("token")]
    public string? Token { get; set; }
}

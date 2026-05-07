using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Api.Controllers;

/// <summary>
/// Gerencia a instância Evolution Go do usuário (síndico).
/// Cada instância autentica com seu próprio token no header "apikey".
/// </summary>
[ApiController]
[Route("api/whatsapp-integracao")]
[Authorize]
public class WhatsAppIntegracaoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WhatsAppIntegracaoController> _logger;

    // API key do servidor Evolution Go (usada apenas para criar instâncias)
    private string ServerApiKey => _configuration["EvolutionApi:ServerApiKey"]
        ?? Environment.GetEnvironmentVariable("EVOLUTION_API_SERVER_KEY")
        ?? _configuration["EvolutionApi:ApiKey"]
        ?? Environment.GetEnvironmentVariable("EVOLUTION_API_KEY")
        ?? "";

    private string EvolutionBaseUrl => (_configuration["EvolutionApi:BaseUrl"]
        ?? Environment.GetEnvironmentVariable("EVOLUTION_API_BASE_URL")
        ?? "https://evogo.sistemaseugerente.com.br").TrimEnd('/');

    public WhatsAppIntegracaoController(
        ApplicationDbContext context,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<WhatsAppIntegracaoController> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    // Cria HttpClient autenticado com o token da instância do usuário
    private HttpClient CriarClienteInstancia(string instanceToken)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", instanceToken);
        return client;
    }

    // Cria HttpClient autenticado com a server API key (para criar instâncias)
    private HttpClient CriarClienteServidor()
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", ServerApiKey);
        return client;
    }

    // GET /api/whatsapp-integracao/status
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus(CancellationToken cancellationToken)
    {
        var usuarioId = GetUserId();
        if (usuarioId == Guid.Empty) return Unauthorized();

        var instancia = await _context.WhatsAppInstancias
            .FirstOrDefaultAsync(w => w.UsuarioId == usuarioId && !w.IsAdmin, cancellationToken);

        if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            return Ok(new { status = "not_configured", instanceName = (string?)null, hasInstance = false });

        try
        {
            var client = CriarClienteInstancia(instancia.EvolutionToken);
            var res = await client.GetAsync($"{EvolutionBaseUrl}/instance/status", cancellationToken);

            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync(cancellationToken);
                var statusStr = ExtrairStatus(json);

                instancia.Status = statusStr;
                instancia.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);

                return Ok(new { status = statusStr, instanceName = instancia.InstanceName, hasInstance = true });
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Erro ao consultar status Evolution Go para usuário {UserId}", usuarioId);
        }

        return Ok(new { status = instancia.Status ?? "error", instanceName = instancia.InstanceName, hasInstance = true });
    }

    // POST /api/whatsapp-integracao/connect
    [HttpPost("connect")]
    public async Task<IActionResult> Connect(CancellationToken cancellationToken)
    {
        var usuarioId = GetUserId();
        if (usuarioId == Guid.Empty) return Unauthorized();

        var instancia = await _context.WhatsAppInstancias
            .FirstOrDefaultAsync(w => w.UsuarioId == usuarioId && !w.IsAdmin, cancellationToken);

        try
        {
            string instanceToken;
            string instanceName;

            if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            {
                // 1. Criar nova instância com a server key
                var serverClient = CriarClienteServidor();
                instanceName = $"sg_{usuarioId.ToString("N")[..10]}";

                var generatedToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");

                var createBody = JsonSerializer.Serialize(new { name = instanceName, token = generatedToken });
                var createRes = await serverClient.PostAsync(
                    $"{EvolutionBaseUrl}/instance/create",
                    new StringContent(createBody, Encoding.UTF8, "application/json"),
                    cancellationToken);

                var createJson = await createRes.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogInformation("Evolution Go create: {Status} - {Body}", createRes.StatusCode, createJson);

                // Se já existe no Evolution Go, deleta e recria
                if (!createRes.IsSuccessStatusCode && createJson.Contains("already exists"))
                {
                    _logger.LogInformation("Instância já existe no Evolution Go — deletando e recriando ({Name})", instanceName);
                    await serverClient.DeleteAsync($"{EvolutionBaseUrl}/instance/{instanceName}", cancellationToken);
                    await Task.Delay(800, cancellationToken);

                    generatedToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
                    var retryBody = JsonSerializer.Serialize(new { name = instanceName, token = generatedToken });
                    createRes = await serverClient.PostAsync(
                        $"{EvolutionBaseUrl}/instance/create",
                        new StringContent(retryBody, Encoding.UTF8, "application/json"),
                        cancellationToken);
                    createJson = await createRes.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogInformation("Evolution Go create retry: {Status} - {Body}", createRes.StatusCode, createJson);
                }

                if (!createRes.IsSuccessStatusCode)
                    return BadRequest(new { message = "Erro ao criar instância. Tente novamente." });

                var createData = JsonSerializer.Deserialize<EvolutionCreateResponse>(createJson, JsonOptions);
                var evolutionId = createData?.Data?.Id ?? createData?.Data?.Name ?? instanceName;
                instanceToken = createData?.Data?.Token ?? generatedToken;

                // Salvar ou atualizar instância
                if (instancia == null)
                {
                    instancia = new WhatsAppInstancia
                    {
                        Id = Guid.NewGuid(),
                        UsuarioId = usuarioId,
                        IsAdmin = false,
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
                instanceName = instancia.InstanceName;
            }

            // 2. Conectar a instância (inicia geração do QR)
            var instanceClient = CriarClienteInstancia(instanceToken);
            var connectBody = JsonSerializer.Serialize(new { immediate = false });
            var connectRes = await instanceClient.PostAsync(
                $"{EvolutionBaseUrl}/instance/connect",
                new StringContent(connectBody, Encoding.UTF8, "application/json"),
                cancellationToken);

            _logger.LogInformation("Evolution Go connect: {Status}", connectRes.StatusCode);

            // 3. Aguardar um momento e buscar QR code
            await Task.Delay(1500, cancellationToken);
            var qrRes = await instanceClient.GetAsync($"{EvolutionBaseUrl}/instance/qr", cancellationToken);
            var qrJson = await qrRes.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogInformation("Evolution Go QR: {Status} - {Body}", qrRes.StatusCode, qrJson);

            var qrCode = ExtrairQrCode(qrJson);

            instancia.Status = "connecting";
            instancia.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { status = "connecting", qrCode, instanceName });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao conectar instância Evolution Go para usuário {UserId}", usuarioId);
            return StatusCode(500, new { message = $"Erro ao conectar: {ex.Message}" });
        }
    }

    // POST /api/whatsapp-integracao/reconnect
    [HttpPost("reconnect")]
    public async Task<IActionResult> Reconnect(CancellationToken cancellationToken)
    {
        var usuarioId = GetUserId();
        if (usuarioId == Guid.Empty) return Unauthorized();

        var instancia = await _context.WhatsAppInstancias
            .FirstOrDefaultAsync(w => w.UsuarioId == usuarioId && !w.IsAdmin, cancellationToken);

        if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            return BadRequest(new { message = "Nenhuma instância configurada. Use Conectar primeiro." });

        try
        {
            var client = CriarClienteInstancia(instancia.EvolutionToken);

            // Faz logout para limpar estado anterior
            await client.DeleteAsync($"{EvolutionBaseUrl}/instance/logout", cancellationToken);
            await Task.Delay(1000, cancellationToken);

            // Reconecta
            var connectBody = JsonSerializer.Serialize(new { immediate = false });
            await client.PostAsync(
                $"{EvolutionBaseUrl}/instance/connect",
                new StringContent(connectBody, Encoding.UTF8, "application/json"),
                cancellationToken);

            // Busca novo QR
            await Task.Delay(1500, cancellationToken);
            var qrRes = await client.GetAsync($"{EvolutionBaseUrl}/instance/qr", cancellationToken);
            var qrJson = await qrRes.Content.ReadAsStringAsync(cancellationToken);
            var qrCode = ExtrairQrCode(qrJson);

            instancia.Status = "connecting";
            instancia.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { status = "connecting", qrCode, instanceName = instancia.InstanceName });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao reconectar Evolution Go para usuário {UserId}", usuarioId);
            return StatusCode(500, new { message = "Erro ao reconectar." });
        }
    }

    // POST /api/whatsapp-integracao/disconnect
    [HttpPost("disconnect")]
    public async Task<IActionResult> Disconnect(CancellationToken cancellationToken)
    {
        var usuarioId = GetUserId();
        if (usuarioId == Guid.Empty) return Unauthorized();

        var instancia = await _context.WhatsAppInstancias
            .FirstOrDefaultAsync(w => w.UsuarioId == usuarioId && !w.IsAdmin, cancellationToken);

        if (instancia == null || string.IsNullOrEmpty(instancia.EvolutionToken))
            return BadRequest(new { message = "Nenhuma instância configurada." });

        try
        {
            var client = CriarClienteInstancia(instancia.EvolutionToken);
            await client.PostAsync($"{EvolutionBaseUrl}/instance/disconnect",
                new StringContent("{}", Encoding.UTF8, "application/json"), cancellationToken);

            instancia.Status = "disconnected";
            instancia.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "Desconectado com sucesso." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao desconectar Evolution Go para usuário {UserId}", usuarioId);
            return StatusCode(500, new { message = "Erro ao desconectar." });
        }
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
                return null;
            }

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

file class EvolutionCreateResponse
{
    [JsonPropertyName("data")]
    public EvolutionInstanceData? Data { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

file class EvolutionInstanceData
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("token")]
    public string? Token { get; set; }

    [JsonPropertyName("connected")]
    public bool Connected { get; set; }

    [JsonPropertyName("qrcode")]
    public string? Qrcode { get; set; }
}

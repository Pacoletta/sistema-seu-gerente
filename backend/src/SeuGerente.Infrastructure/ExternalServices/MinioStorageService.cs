using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Minio;
using Minio.DataModel.Args;
using SeuGerente.Application.Interfaces;

namespace SeuGerente.Infrastructure.ExternalServices;

public class MinioStorageService : IStorageService
{
    private readonly IMinioClient _client;
    private readonly string _bucket;
    private readonly string _publicBaseUrl;
    private readonly ILogger<MinioStorageService> _logger;

    public MinioStorageService(IConfiguration configuration, ILogger<MinioStorageService> logger)
    {
        _logger = logger;

        var endpoint = configuration["Minio:Endpoint"]
            ?? Environment.GetEnvironmentVariable("MINIO_ENDPOINT")
            ?? throw new InvalidOperationException("Minio:Endpoint não configurado.");

        // Remove protocolo se vier com https:// ou http://
        endpoint = endpoint
            .Replace("https://", "", StringComparison.OrdinalIgnoreCase)
            .Replace("http://", "", StringComparison.OrdinalIgnoreCase)
            .TrimEnd('/');

        var accessKey = configuration["Minio:AccessKey"]
            ?? Environment.GetEnvironmentVariable("MINIO_ACCESS_KEY")
            ?? throw new InvalidOperationException("Minio:AccessKey não configurado.");

        var secretKey = configuration["Minio:SecretKey"]
            ?? Environment.GetEnvironmentVariable("MINIO_SECRET_KEY")
            ?? throw new InvalidOperationException("Minio:SecretKey não configurado.");

        _bucket = configuration["Minio:Bucket"]
            ?? Environment.GetEnvironmentVariable("MINIO_BUCKET")
            ?? "uploads";

        var useSsl = string.Equals(
            configuration["Minio:UseSsl"] ?? Environment.GetEnvironmentVariable("MINIO_USE_SSL"),
            "true", StringComparison.OrdinalIgnoreCase);

        var protocol = useSsl ? "https" : "http";
        var publicBaseUrl = configuration["Minio:PublicBaseUrl"]
            ?? Environment.GetEnvironmentVariable("MINIO_PUBLIC_BASE_URL");
        _publicBaseUrl = !string.IsNullOrEmpty(publicBaseUrl)
            ? publicBaseUrl.TrimEnd('/')
            : $"{protocol}://{endpoint}/{_bucket}";

        var builder = new MinioClient()
            .WithEndpoint(endpoint)
            .WithCredentials(accessKey, secretKey);

        if (useSsl) builder = builder.WithSSL();

        _client = builder.Build();
    }

    public async Task<string> UploadTemporaryFileAsync(
        byte[] fileBytes,
        string fileName,
        string bucket = "temp-whatsapp",
        CancellationToken cancellationToken = default)
    {
        await EnsureBucketAsync(cancellationToken);

        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var uniqueFileName = $"{timestamp}_{fileName}";
        var objectName = $"{bucket}/{uniqueFileName}";
        var contentType = ResolveContentType(fileName);

        using var stream = new MemoryStream(fileBytes);

        await _client.PutObjectAsync(new PutObjectArgs()
            .WithBucket(_bucket)
            .WithObject(objectName)
            .WithStreamData(stream)
            .WithObjectSize(fileBytes.Length)
            .WithContentType(contentType), cancellationToken);

        var publicUrl = $"{_publicBaseUrl}/{objectName}";
        _logger.LogInformation("MinIO upload: {ObjectName} → {Url}", objectName, publicUrl);
        return publicUrl;
    }

    public async Task<bool> DeleteFileAsync(
        string fileName,
        string bucket = "temp-whatsapp",
        CancellationToken cancellationToken = default)
    {
        // fileName é o nome único (ex: 1234567890_relatorio.pdf)
        var objectName = $"{bucket}/{fileName}";
        try
        {
            await _client.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(_bucket)
                .WithObject(objectName), cancellationToken);

            _logger.LogInformation("MinIO delete: {ObjectName}", objectName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "MinIO delete falhou: {ObjectName}", objectName);
            return false;
        }
    }

    public Task ScheduleFileDeletionAsync(
        string fileName,
        string bucket,
        TimeSpan delay,
        CancellationToken cancellationToken = default)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(delay, cancellationToken);
                await DeleteFileAsync(fileName, bucket, cancellationToken);
            }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro na exclusão agendada de {FileName}", fileName);
            }
        }, cancellationToken);

        return Task.CompletedTask;
    }

    public async Task<string> UploadFileAsync(
        byte[] fileBytes,
        string objectPath,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        await EnsureBucketAsync(cancellationToken);

        using var stream = new MemoryStream(fileBytes);

        await _client.PutObjectAsync(new PutObjectArgs()
            .WithBucket(_bucket)
            .WithObject(objectPath)
            .WithStreamData(stream)
            .WithObjectSize(fileBytes.Length)
            .WithContentType(contentType), cancellationToken);

        var publicUrl = $"{_publicBaseUrl}/{objectPath}";
        _logger.LogInformation("MinIO upload: {ObjectPath} → {Url}", objectPath, publicUrl);
        return publicUrl;
    }

    public async Task<bool> DeleteObjectAsync(
        string objectPath,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _client.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(_bucket)
                .WithObject(objectPath), cancellationToken);

            _logger.LogInformation("MinIO delete: {ObjectPath}", objectPath);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "MinIO delete falhou: {ObjectPath}", objectPath);
            return false;
        }
    }

    private async Task EnsureBucketAsync(CancellationToken cancellationToken)
    {
        var exists = await _client.BucketExistsAsync(
            new BucketExistsArgs().WithBucket(_bucket), cancellationToken);

        if (!exists)
        {
            await _client.MakeBucketAsync(
                new MakeBucketArgs().WithBucket(_bucket), cancellationToken);

            _logger.LogInformation("MinIO: bucket '{Bucket}' criado.", _bucket);
        }

        // Política de leitura pública para que o WhatsApp acesse os arquivos
        var policy = $@"{{
            ""Version"": ""2012-10-17"",
            ""Statement"": [{{
                ""Effect"": ""Allow"",
                ""Principal"": {{""AWS"": [""*""]}},
                ""Action"": [""s3:GetObject""],
                ""Resource"": [""arn:aws:s3:::{_bucket}/*""]
            }}]
        }}";

        try
        {
            await _client.SetPolicyAsync(new SetPolicyArgs()
                .WithBucket(_bucket)
                .WithPolicy(policy), cancellationToken);
        }
        catch (Exception ex)
        {
            // Não bloqueia o upload se a política já existe ou não tem permissão
            _logger.LogDebug(ex, "MinIO: não foi possível aplicar política pública ao bucket '{Bucket}'.", _bucket);
        }
    }

    private static string ResolveContentType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        return ext switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".mp4" => "video/mp4",
            ".mp3" => "audio/mpeg",
            _ => "application/octet-stream"
        };
    }
}

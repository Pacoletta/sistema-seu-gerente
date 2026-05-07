using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SeuGerente.Infrastructure.Persistence;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Aponta para o diretório da API onde o .env está
        var apiDir = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "SeuGerente.Api"));
        Env.Load(Path.Combine(apiDir, ".env"));

        var configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();

        var raw = configuration.GetConnectionString("DefaultConnection")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? throw new InvalidOperationException(
                "Connection string não encontrada. Verifique 'ConnectionStrings__DefaultConnection' no arquivo .env");

        var connectionString = ConvertToNpgsqlFormat(raw);

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
            npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3));

        return new ApplicationDbContext(optionsBuilder.Options);
    }

    private static string ConvertToNpgsqlFormat(string connectionString)
    {
        if (!connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
            !connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
            return connectionString;

        var withoutScheme = connectionString.Substring(connectionString.IndexOf("://") + 3);
        var slashIdx = withoutScheme.IndexOf('/');
        var authority = slashIdx >= 0 ? withoutScheme[..slashIdx] : withoutScheme;
        var pathAndQuery = slashIdx >= 0 ? withoutScheme[slashIdx..] : "";

        var atIdx = authority.LastIndexOf('@');
        var userInfo = atIdx >= 0 ? authority[..atIdx] : "";
        var hostPort = atIdx >= 0 ? authority[(atIdx + 1)..] : authority;

        var colonIdx = userInfo.IndexOf(':');
        var username = colonIdx >= 0 ? Uri.UnescapeDataString(userInfo[..colonIdx]) : Uri.UnescapeDataString(userInfo);
        var password = colonIdx >= 0 ? Uri.UnescapeDataString(userInfo[(colonIdx + 1)..]) : "";

        var hostColonIdx = hostPort.LastIndexOf(':');
        string host;
        int port = 5432;
        if (hostColonIdx >= 0 && int.TryParse(hostPort[(hostColonIdx + 1)..], out var parsedPort))
        {
            host = hostPort[..hostColonIdx];
            port = parsedPort;
        }
        else
        {
            host = hostPort;
        }

        var questionIdx = pathAndQuery.IndexOf('?');
        var database = questionIdx >= 0 ? pathAndQuery[1..questionIdx] : pathAndQuery.TrimStart('/');
        var query = questionIdx >= 0 ? pathAndQuery[(questionIdx + 1)..] : "";

        var sb = new System.Text.StringBuilder();
        sb.Append($"Host={host};Port={port};Database={database};Username={username};Password={password}");

        foreach (var param in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = param.Split('=', 2);
            if (kv.Length == 2 && kv[0].ToLowerInvariant() == "sslmode")
            {
                var npgsqlMode = kv[1].ToLowerInvariant() switch
                {
                    "disable" => "Disable",
                    "require" or "required" => "Require",
                    "prefer" => "Prefer",
                    "allow" => "Allow",
                    "verify-ca" => "VerifyCA",
                    "verify-full" => "VerifyFull",
                    _ => kv[1]
                };
                sb.Append($";SSL Mode={npgsqlMode}");
            }
        }

        return sb.ToString();
    }
}

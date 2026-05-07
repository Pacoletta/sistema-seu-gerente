using Hangfire;
using Hangfire.PostgreSql;
using Hangfire.InMemory;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using SeuGerente.Application.Interfaces;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Auth;
using SeuGerente.Infrastructure.Common;
using SeuGerente.Infrastructure.Persistence;
using SeuGerente.Infrastructure.Repositories;

namespace SeuGerente.Infrastructure;

/// <summary>
/// Configuração de injeção de dependências da camada Infrastructure
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Entity Framework Core + PostgreSQL
        // Prioridade: ConnectionStrings:DefaultConnection (env __notation ou appsettings)
        //             depois DATABASE_URL (formato URI, comum em produção)
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");

        if (string.IsNullOrEmpty(connectionString))
        {
            Log.Information("Connection string não encontrada - usando InMemory Database (desenvolvimento local)");
            
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase("SeuGerenteDevDb");
            });
            
            // Hangfire com Memory Storage para desenvolvimento
            services.AddHangfire(config =>
            {
                config.UseInMemoryStorage();
            });
            services.AddHangfireServer();
        }
        else
        {
            Log.Information("Configurando PostgreSQL via connection string");

            // Converte URI format (postgres://user:pass@host/db) para key=value (Npgsql/Hangfire)
            var npgsqlConnStr = ConvertToNpgsqlFormat(connectionString);

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(npgsqlConnStr, npgsqlOptions =>
                {
                    npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3);
                });
            });

            var hangfireConnStr = StripUnsupportedParams(npgsqlConnStr);

            services.AddHangfire(config =>
            {
                config.UsePostgreSqlStorage(options =>
                {
                    options.UseNpgsqlConnection(hangfireConnStr);
                });
            });

            services.AddHangfireServer();
        }

        // Repositórios
        services.AddScoped<IMoradorRepository, MoradorRepository>();
        services.AddScoped<IDespesaRepository, DespesaRepository>();
        services.AddScoped<IPagamentoRepository, PagamentoRepository>();
        services.AddScoped<IConfiguracaoRepository, ConfiguracaoRepository>();
        services.AddScoped<IReceitaRepository, ReceitaRepository>();
        services.AddScoped<IMelhoriaRepository, MelhoriaRepository>();
        services.AddScoped<ISugestaoRepository, SugestaoRepository>();
        services.AddScoped<IReservaRepository, ReservaRepository>();
        services.AddScoped<IConfiguracaoEmailRepository, ConfiguracaoEmailRepository>();
        services.AddScoped<ICadastroRepository, CadastroRepository>();
        services.AddScoped<IAdministrativoRepository, AdministrativoRepository>();
        services.AddScoped<IBannerRepository, BannerRepository>();

        // Auth Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();

        // HttpClient para serviços externos
        services.AddHttpClient<IMercadoPagoService, ExternalServices.MercadoPagoService>();
        services.AddHttpClient<IWhatsAppService, ExternalServices.EvolutionApiService>();
        // Storage Service
        services.AddScoped<IStorageService, ExternalServices.MinioStorageService>();
        
        // Email Service - Resend.com (melhor para emails transacionais)
        services.AddHttpClient<IEmailService, ExternalServices.ResendEmailService>();
        
        // Caso queira usar SMTP ao invés de Resend, comente a linha acima e descomente abaixo:
        // services.AddScoped<IEmailService, ExternalServices.EmailService>();

        // PDF Service
        services.AddScoped<IPdfService, Services.PdfService>();

        return services;
    }

    /// <summary>
    /// Converte URI postgres:// para formato key=value que Npgsql e Hangfire aceitam.
    /// Parsing manual para suportar '@' na senha sem necessidade de encoding.
    /// </summary>
    private static string ConvertToNpgsqlFormat(string connectionString)
    {
        if (!connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
            !connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
            return connectionString;

        // Remover scheme (postgres:// ou postgresql://)
        var withoutScheme = connectionString.Substring(connectionString.IndexOf("://") + 3);

        // Separar authority (/path?query) do resto
        var slashIdx = withoutScheme.IndexOf('/');
        var authority = slashIdx >= 0 ? withoutScheme[..slashIdx] : withoutScheme;
        var pathAndQuery = slashIdx >= 0 ? withoutScheme[slashIdx..] : "";

        // Separar userInfo de host pelo ÚLTIMO '@' (senha pode conter '@')
        var atIdx = authority.LastIndexOf('@');
        var userInfo = atIdx >= 0 ? authority[..atIdx] : "";
        var hostPort = atIdx >= 0 ? authority[(atIdx + 1)..] : authority;

        // Separar user:pass pelo PRIMEIRO ':'
        var colonIdx = userInfo.IndexOf(':');
        var username = colonIdx >= 0 ? Uri.UnescapeDataString(userInfo[..colonIdx]) : Uri.UnescapeDataString(userInfo);
        var password = colonIdx >= 0 ? Uri.UnescapeDataString(userInfo[(colonIdx + 1)..]) : "";

        // Separar host:port pelo ÚLTIMO ':'
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

        // Separar database de query params
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

    /// <summary>
    /// Remove parâmetros não suportados pelo NpgsqlConnectionStringBuilder do Hangfire.
    /// Use DOTNET_SYSTEM_NET_DISABLEIPV6=1 para forçar IPv4 globalmente no runtime.
    /// </summary>
    private static string StripUnsupportedParams(string connectionString)
    {
        var unsupported = new[] { "ip address preference", "prefer ipv4" };
        var parts = connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries);
        var filtered = parts.Where(p =>
        {
            var key = p.Split('=')[0].Trim().ToLowerInvariant();
            return !unsupported.Contains(key);
        });
        return string.Join(";", filtered);
    }
}

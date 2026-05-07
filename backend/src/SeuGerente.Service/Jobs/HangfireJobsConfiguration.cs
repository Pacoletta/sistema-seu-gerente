using Hangfire;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SeuGerente.Service.Jobs;

namespace SeuGerente.Service;

/// <summary>
/// Configuração dos jobs agendados do Hangfire
/// </summary>
public static class HangfireJobsConfiguration
{
    public static void ConfigureJobs(IConfiguration configuration)
    {
        // Obter expressões cron do appsettings.json
        var cobrancasCron = configuration["Hangfire:CobrancasJobCron"] ?? "0 9 * * *"; // 9h da manhã
        var vencidosCron = configuration["Hangfire:VencidosJobCron"] ?? "0 0 * * *";   // Meia-noite
        var cobrancaPixCron = configuration["Hangfire:CobrancaPixJobCron"] ?? "0 8 1 * *"; // Dia 1º de cada mês às 8h
        var envioAutomaticoCron = configuration["Hangfire:EnvioAutomaticoJobCron"] ?? "*/10 * * * *"; // A cada 10 minutos

        // Configurar job de cobranças (diário às 9h)
        RecurringJob.AddOrUpdate<CobrancasJob>(
            "enviar-cobrancas-diarias",
            job => job.ExecuteAsync(CancellationToken.None),
            cobrancasCron,
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time") // Brasília
            });

        // Configurar job de atualização de vencidos (diário à meia-noite)
        RecurringJob.AddOrUpdate<AtualizarVencidosJob>(
            "atualizar-pagamentos-vencidos",
            job => job.ExecuteAsync(CancellationToken.None),
            vencidosCron,
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time")
            });

        // Configurar job de cobrança PIX mensal (dia 1º de cada mês às 8h)
        RecurringJob.AddOrUpdate<CobrancaPixJob>(
            "cobranca-pix-mensal",
            job => job.ExecutarCobrancasMensaisAsync(),
            cobrancaPixCron,
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time")
            });

        // Configurar job de envio automático de cobrança (verifica a cada hora)
        RecurringJob.AddOrUpdate<EnvioAutomaticoCobrancaJob>(
            "envio-automatico-cobranca",
            job => job.ExecuteAsync(CancellationToken.None),
            envioAutomaticoCron,
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time")
            });
    }

    public static void RegisterJobServices(this IServiceCollection services)
    {
        services.AddScoped<CobrancasJob>();
        services.AddScoped<AtualizarVencidosJob>();
        services.AddScoped<EnvioAutomaticoCobrancaJob>();
    }
}

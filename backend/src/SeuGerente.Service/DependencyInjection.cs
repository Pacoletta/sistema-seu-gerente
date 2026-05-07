using Microsoft.Extensions.DependencyInjection;
using SeuGerente.Service.Jobs;

namespace SeuGerente.Service;

/// <summary>
/// Configuração de injeção de dependência para a camada Service (Background Jobs)
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddServiceLayer(this IServiceCollection services)
    {
        // Registrar Jobs do Hangfire
        services.AddScoped<CobrancasJob>();
        services.AddScoped<AtualizarVencidosJob>();
        services.AddScoped<CobrancaPixJob>();
        services.AddScoped<EnvioAutomaticoCobrancaJob>();

        return services;
    }
}

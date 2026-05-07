using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SeuGerente.Application.Services;

namespace SeuGerente.Application;

/// <summary>
/// Configuração de injeção de dependências da camada Application
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);

        // FluentValidation
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        // Application Services
        services.AddScoped<MoradorService>();
        services.AddScoped<DespesaService>();
        services.AddScoped<PagamentoService>();
        services.AddScoped<ConfiguracaoService>();
        services.AddScoped<ReceitaService>();
        services.AddScoped<MelhoriaService>();
        services.AddScoped<SugestaoService>();
        services.AddScoped<ConfiguracaoEmailService>();
        services.AddScoped<CadastroService>();
        services.AddScoped<CobrancaPixService>();

        // MediatR (opcional - usar apenas se necessário)
        // services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));

        return services;
    }
}

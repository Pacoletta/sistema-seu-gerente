using Microsoft.Extensions.Configuration;

namespace SeuGerente.Infrastructure.Common;

/// <summary>
/// Helper para ler configurações com fallback de variáveis de ambiente
/// </summary>
public static class ConfigurationHelper
{
    /// <summary>
    /// Lê um valor de configuração tentando múltiplas fontes
    /// </summary>
    public static string GetValue(IConfiguration config, string key, params string[] envVarNames)
    {
        // 1. Tentar ler do IConfiguration (appsettings.json)
        var value = config[key];
        if (!string.IsNullOrEmpty(value)) return value;

        //  2. Tentar ler das variáveis de ambiente
        foreach (var envVar in envVarNames)
        {
            value = Environment.GetEnvironmentVariable(envVar);
            if (!string.IsNullOrEmpty(value)) return value;
        }

        return string.Empty;
    }

    /// <summary>
    /// Lê um valor obrigatório (lança exceção se não encontrar)
    /// </summary>
    public static string GetRequiredValue(IConfiguration config, string key, params string[] envVarNames)
    {
        var value = GetValue(config, key, envVarNames);
        
        if (string.IsNullOrEmpty(value))
        {
            var envVarList = string.Join(", ", envVarNames);
            throw new InvalidOperationException(
                $"⚠️  Configuração obrigatória '{key}' não encontrada. " +
                $"Defina em appsettings.json ou nas env vars: {envVarList}");
        }

        return value;
    }

    /// <summary>
    /// Lê um valor inteiro com fallback
    /// </summary>
    public static int GetIntValue(IConfiguration config, string key, int defaultValue, params string[] envVarNames)
    {
        var value = GetValue(config, key, envVarNames);
        
        if (int.TryParse(value, out var intValue))
            return intValue;
            
        return defaultValue;
    }

    /// <summary>
    /// Lê um valor booleano com fallback
    /// </summary>
    public static bool GetBoolValue(IConfiguration config, string key, bool defaultValue, params string[] envVarNames)
    {
        var value = GetValue(config, key, envVarNames);
        
        if (bool.TryParse(value, out var boolValue))
            return boolValue;
            
        return defaultValue;
    }
}

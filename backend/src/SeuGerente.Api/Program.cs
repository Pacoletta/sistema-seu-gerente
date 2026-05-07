using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using SeuGerente.Api.Middlewares;
using SeuGerente.Application;
using SeuGerente.Infrastructure;
using SeuGerente.Service;

// Carrega .env da raiz do backend (dois níveis acima do projeto Api)
var envPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", ".env"));
if (!File.Exists(envPath))
    envPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env"));
if (File.Exists(envPath))
    Env.Load(envPath);

// ==================================
// HELPER: Ler variáveis de ambiente com fallback
// ==================================
static string? GetConfigValue(IConfiguration config, string key, params string[] envVarNames)
{
    // 1. Tentar ler do IConfiguration (appsettings.json)
    var value = config[key];
    if (!string.IsNullOrEmpty(value)) return value;

    // 2. Tentar ler das variáveis de ambiente padrão do EasyPanel
    // Mapeamento automático: Supabase:Url -> SUPABASE_URL
    var autoEnvVar = key.Replace(":", "_").ToUpperInvariant();
    value = Environment.GetEnvironmentVariable(autoEnvVar);
    if (!string.IsNullOrEmpty(value)) return value;

    // 3. Tentar alternativas especificadas manualmente
    foreach (var envVar in envVarNames)
    {
        value = Environment.GetEnvironmentVariable(envVar);
        if (!string.IsNullOrEmpty(value)) return value;
    }

    return null;
}

// ==================================
// CONFIGURAR SERILOG PROFISSIONAL
// ==================================
// Timezone BRT (Brasília)
var brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById(
    OperatingSystem.IsWindows() ? "E. South America Standard Time" : "America/Sao_Paulo");

// Template profissional: [HH:mm:ss BRT LEVEL] Message
const string outputTemplate = "[{Timestamp:HH:mm:ss} BRT {Level:u3}] {Message:lj}{NewLine}{Exception}";

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .MinimumLevel.Override("Hangfire", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "SeuGerente.Api")
    .WriteTo.Console(outputTemplate: outputTemplate)
    .WriteTo.File(
        path: "logs/seugerente-.log",
        rollingInterval: RollingInterval.Day,
        outputTemplate: outputTemplate,
        retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    Log.Information("Sistema Seu Gerente API v1.0 iniciando...");
    Log.Information("Ambiente: {Environment}", Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development");
    
    var builder = WebApplication.CreateBuilder(args);

    // Configurar Serilog
    builder.Host.UseSerilog();

    // Add services to the container
    builder.Services.AddControllers()
        .AddJsonOptions(opts =>
        {
            opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
        });
    builder.Services.AddEndpointsApiExplorer();
    
    // Swagger com autenticação JWT
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo 
        { 
            Title = "Sistema Seu Gerente API", 
            Version = "v1",
            Description = "API para gestão de condomínios"
        });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header usando Bearer scheme. Exemplo: \"Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    // CORS - permitir frontend em dev e produção
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            // Ler FRONTEND_URL com fallback
            var frontendUrl = GetConfigValue(builder.Configuration,
                "FrontendUrl",
                "FRONTEND_URL", "Frontend__Url") 
                ?? "http://localhost:3000";
            
            // Buscar CORS origins adicionais de variável de ambiente
            var corsOriginsEnv = GetConfigValue(builder.Configuration, "CORS_ORIGINS", "Cors__Origins");
            var additionalOrigins = !string.IsNullOrEmpty(corsOriginsEnv) 
                ? corsOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                : Array.Empty<string>();
            
            // Lista de origens permitidas
            var allowedOrigins = new List<string> 
            { 
                frontendUrl,
                "http://localhost:3000",
                "https://localhost:3000"
            };
            
            // Adicionar origens da variável de ambiente
            allowedOrigins.AddRange(additionalOrigins);
            
            // Remover duplicatas e valores vazios
            var uniqueOrigins = allowedOrigins
                .Where(o => !string.IsNullOrEmpty(o))
                .Distinct()
                .ToArray();
            
            policy.WithOrigins(uniqueOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    // Camadas da aplicação
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddServiceLayer();

    // JWT Authentication
    var jwtSecretKey = GetConfigValue(builder.Configuration,
        "JwtSettings:SecretKey",
        "JWT_SECRET_KEY")
        ?? throw new InvalidOperationException("JWT SecretKey não configurado. Defina JwtSettings:SecretKey ou JWT_SECRET_KEY");

    var jwtIssuer = GetConfigValue(builder.Configuration, "JwtSettings:Issuer", "JWT_ISSUER") ?? "SeuGerente";
    var jwtAudience = GetConfigValue(builder.Configuration, "JwtSettings:Audience", "JWT_AUDIENCE") ?? "SeuGerente";

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sistema Seu Gerente API v1");
        });
    }

    // Middlewares
    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseMiddleware<ExceptionHandlingMiddleware>();
    
    // Em produção (container), o TLS é terminado no reverse proxy (EasyPanel/nginx).
    // UseHttpsRedirection() dentro do container causaria redirect loops.
    if (app.Environment.IsDevelopment())
        app.UseHttpsRedirection();

    // CORS deve vir depois de UseRouting() e antes de UseAuthentication()
    app.UseRouting();
    app.UseCors("AllowFrontend");
    
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    Log.Information("API pronta para receber requisições");
    Log.Information("Swagger UI disponível em: /swagger");
    Log.Information("Health Check disponível em: /api/health");
    
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Aplicação falhou ao iniciar");
}
finally
{
    Log.CloseAndFlush();
}

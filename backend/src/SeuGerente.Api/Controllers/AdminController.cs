using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeuGerente.Api.Middlewares;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IAdministrativoRepository _administrativoRepository;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        IAdministrativoRepository administrativoRepository,
        ApplicationDbContext context,
        ILogger<AdminController> logger)
    {
        _administrativoRepository = administrativoRepository;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Verifica se o usuário atual tem permissão administrativa
    /// </summary>
    [HttpGet("check-admin")]
    public async Task<ActionResult<bool>> CheckAdmin()
    {
        try
        {
            // Log todos os claims para debug
            _logger.LogInformation("🔍 Claims recebidos:");
            foreach (var claim in User?.Claims ?? Enumerable.Empty<System.Security.Claims.Claim>())
            {
                _logger.LogInformation("  - {Type}: {Value}", claim.Type, claim.Value);
            }

            // Tentar extrair email de diferentes claims
            var userEmail = User?.FindFirst("email")?.Value 
                ?? User?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                ?? User?.FindFirst("sub")?.Value;

            _logger.LogInformation("📧 Email extraído: {Email}", userEmail ?? "NULL");

            if (string.IsNullOrEmpty(userEmail))
            {
                _logger.LogWarning("⚠️ Nenhum email encontrado nos claims");
                return Ok(new { isAdmin = false });
            }

            var isAdmin = await _administrativoRepository.IsAdminAsync(userEmail);
            
            _logger.LogInformation("🔐 Verificação admin para {Email}: {IsAdmin}", userEmail, isAdmin);
            
            return Ok(new { isAdmin, email = userEmail });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao verificar permissão administrativa");
            return StatusCode(500, new { error = "Erro ao verificar permissões" });
        }
    }

    /// <summary>
    /// Lista todos os administradores (apenas para admins)
    /// </summary>
    [HttpGet("list")]
    [RequireAdmin]
    public async Task<ActionResult<IEnumerable<Administrativo>>> GetAll()
    {
        try
        {
            var admins = await _administrativoRepository.GetAllAsync();
            _logger.LogInformation("📋 Listando {Count} administradores", admins.Count());
            return Ok(admins);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao listar administradores");
            return StatusCode(500, new { error = "Erro ao listar administradores" });
        }
    }

    /// <summary>
    /// Endpoint de teste protegido por admin
    /// </summary>
    [HttpGet("dashboard")]
    [RequireAdmin]
    public ActionResult<object> Dashboard()
    {
        var userEmail = User?.FindFirst("email")?.Value;
        var userName = User?.FindFirst("name")?.Value ?? "Admin";

        return Ok(new 
        { 
            message = "Bem-vindo à área administrativa!",
            user = new
            {
                email = userEmail,
                name = userName,
                isAdmin = true
            },
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Estatísticas gerais do sistema  
    /// </summary>
    [HttpGet("stats")]
    [RequireAdmin]
    public async Task<ActionResult> GetStats()
    {
        try
        {
            var totalCadastros = await _context.Cadastros.CountAsync();
            var cadastrosAtivos = await _context.Cadastros.CountAsync(c => c.Status == "ativo");
            var totalMoradores = await _context.Moradores.CountAsync();
            var totalDespesas = await _context.Despesas.CountAsync();
            var totalReceitas = await _context.Receitas.CountAsync();
            var totalPagamentos = await _context.Pagamentos.CountAsync();
            var totalAdmins = await _administrativoRepository.GetAllAsync();

            var despesasTotal = await _context.Despesas.SumAsync(d => (decimal?)d.Valor) ?? 0;
            var receitasTotal = await _context.Receitas.SumAsync(r => (decimal?)r.Valor) ?? 0;

            return Ok(new
            {
                usuarios = new
                {
                    total = totalCadastros,
                    ativos = cadastrosAtivos,
                    inativos = totalCadastros - cadastrosAtivos
                },
                moradores = totalMoradores,
                financeiro = new
                {
                    despesas = new { total = totalDespesas, valor = despesasTotal },
                    receitas = new { total = totalReceitas, valor = receitasTotal },
                    saldo = receitasTotal - despesasTotal
                },
                cobrancas = totalPagamentos,
                administradores = totalAdmins.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao buscar estatísticas");
            return StatusCode(500, new { error = "Erro ao buscar estatísticas" });
        }
    }

    /// <summary>
    /// Lista todos os cadastros/usuários
    /// </summary>
    [HttpGet("usuarios")]
    [RequireAdmin]
    public async Task<ActionResult> GetUsuarios([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var query = _context.Cadastros
                .OrderByDescending(c => c.CreatedAt)
                .AsQueryable();

            var total = await query.CountAsync();
            var usuarios = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    c.Id,
                    c.Nome,
                    c.Email,
                    c.Whatsapp,
                    c.NomeCondominio,
                    c.CnpjCpf,
                    c.QuantidadeApartamentos,
                    c.Status,
                    c.CreatedAt,
                    c.UpdatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                data = usuarios,
                pagination = new
                {
                    page,
                    pageSize,
                    total,
                    totalPages = (int)Math.Ceiling((double)total / pageSize)
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao listar usuários");
            return StatusCode(500, new { error = "Erro ao listar usuários" });
        }
    }

    /// <summary>
    /// Cria um novo usuário cliente (Cadastro) pelo painel admin
    /// </summary>
    [HttpPost("usuarios")]
    [RequireAdmin]
    public async Task<ActionResult> CreateUsuario([FromBody] CreateUsuarioAdminRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { error = "Email é obrigatório" });

            if (string.IsNullOrWhiteSpace(request.Senha))
                return BadRequest(new { error = "Senha é obrigatória" });

            var existente = await _context.Cadastros
                .FirstOrDefaultAsync(c => c.Email == request.Email.ToLower().Trim());

            if (existente != null)
                return BadRequest(new { error = "Já existe um usuário com este email" });

            var cadastro = new SeuGerente.Domain.Entities.Cadastro
            {
                Id = Guid.NewGuid(),
                Email = request.Email.ToLower().Trim(),
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha),
                Nome = request.Nome,
                Status = "ativo",
                EmailConfirmado = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Cadastros.Add(cadastro);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Novo cliente criado pelo admin: {Email}", cadastro.Email);

            return Ok(new { message = "Cliente criado com sucesso", id = cadastro.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao criar cliente");
            return StatusCode(500, new { error = "Erro ao criar cliente" });
        }
    }

    [HttpPatch("usuarios/{id}/status")]
    [RequireAdmin]
    public async Task<ActionResult> UpdateUsuarioStatus(Guid id, [FromBody] UpdateUsuarioStatusRequest request)
    {
        try
        {
            var cadastro = await _context.Cadastros.FindAsync(id);
            if (cadastro == null)
                return NotFound(new { error = "Usuário não encontrado" });

            var statusValidos = new[] { "ativo", "inativo", "pendente" };
            if (!statusValidos.Contains(request.Status))
                return BadRequest(new { error = "Status inválido" });

            cadastro.Status = request.Status;
            cadastro.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Status do usuário {Email} alterado para {Status}", cadastro.Email, request.Status);
            return Ok(new { message = $"Usuário {request.Status} com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao atualizar status do usuário");
            return StatusCode(500, new { error = "Erro ao atualizar status" });
        }
    }

    /// <summary>
    /// Resumo financeiro geral
    /// </summary>
    [HttpGet("financeiro")]
    [RequireAdmin]
    public async Task<ActionResult> GetResumoFinanceiro()
    {
        try
        {
            var agora = DateTime.UtcNow;
            var mesAtual = new DateTime(agora.Year, agora.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var mesFim = mesAtual.AddMonths(1);

            // Estatísticas do mês atual
            var despesasMes = await _context.Despesas
                .Where(d => d.Data >= mesAtual && d.Data < mesFim)
                .SumAsync(d => (decimal?)d.Valor) ?? 0;

            var receitasMes = await _context.Receitas
                .Where(r => r.Data >= mesAtual && r.Data < mesFim)
                .SumAsync(r => (decimal?)r.Valor) ?? 0;

            var pagamentosMes = await _context.Pagamentos
                .Where(p => p.DataVencimento >= mesAtual && p.DataVencimento < mesFim)
                .CountAsync();

            var pagamentosPagos = await _context.Pagamentos
                .Where(p => p.DataVencimento >= mesAtual && p.DataVencimento < mesFim && p.Status == "pago")
                .CountAsync();

            return Ok(new
            {
                mesAtual = new
                {
                    despesas = despesasMes,
                    receitas = receitasMes,
                    saldo = receitasMes - despesasMes,
                    cobrancas = new
                    {
                        total = pagamentosMes,
                        pagas = pagamentosPagos,
                        pendentes = pagamentosMes - pagamentosPagos
                    }
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao buscar resumo financeiro");
            return StatusCode(500, new { error = "Erro ao buscar resumo financeiro" });
        }
    }

    /// <summary>
    /// Usuários recentes
    /// </summary>
    [HttpGet("usuarios-recentes")]
    [RequireAdmin]
    public async Task<ActionResult> GetUsuariosRecentes([FromQuery] int limit = 10)
    {
        try
        {
            var usuarios = await _context.Cadastros
                .OrderByDescending(c => c.CreatedAt)
                .Take(limit)
                .Select(c => new
                {
                    c.Id,
                    c.Nome,
                    c.Email,
                    c.NomeCondominio,
                    c.Status,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(usuarios);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao buscar usuários recentes");
            return StatusCode(500, new { error = "Erro ao buscar usuários recentes" });
        }
    }

    /// <summary>
    /// Obter configurações do sistema
    /// </summary>
    [HttpGet("configuracoes")]
    [RequireAdmin]
    public async Task<ActionResult> GetConfiguracoes()
    {
        try
        {
            var configs = await _context.ConfiguracoesSistema
                .OrderBy(c => c.Chave)
                .ToListAsync();

            return Ok(configs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao buscar configurações");
            return StatusCode(500, new { error = "Erro ao buscar configurações" });
        }
    }

    /// <summary>
    /// Atualizar configuração do sistema
    /// </summary>
    [HttpPut("configuracoes/{chave}")]
    [RequireAdmin]
    public async Task<ActionResult> UpdateConfiguracao(string chave, [FromBody] UpdateConfigRequest request)
    {
        try
        {
            var config = await _context.ConfiguracoesSistema
                .FirstOrDefaultAsync(c => c.Chave == chave);

            if (config == null)
            {
                return NotFound(new { error = "Configuração não encontrada" });
            }

            config.Valor = request.Valor;
            config.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log da alteração
            await _context.LogsSistema.AddAsync(new LogSistema
            {
                Nivel = "INFO",
                Categoria = "CONFIGURACAO",
                Mensagem = $"Configuração '{chave}' atualizada",
                Detalhes = $"Novo valor: {request.Valor}",
                Email = User?.FindFirst("email")?.Value,
                Data = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(config);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao atualizar configuração");
            return StatusCode(500, new { error = "Erro ao atualizar configuração" });
        }
    }

    /// <summary>
    /// Obter logs do sistema com filtros
    /// </summary>
    [HttpGet("logs")]
    [RequireAdmin]
    public async Task<ActionResult> GetLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? nivel = null,
        [FromQuery] string? categoria = null,
        [FromQuery] DateTime? dataInicio = null,
        [FromQuery] DateTime? dataFim = null)
    {
        try
        {
            var query = _context.LogsSistema.AsQueryable();

            // Filtros
            if (!string.IsNullOrEmpty(nivel))
                query = query.Where(l => l.Nivel == nivel);

            if (!string.IsNullOrEmpty(categoria))
                query = query.Where(l => l.Categoria == categoria);

            if (dataInicio.HasValue)
                query = query.Where(l => l.Data >= dataInicio.Value);

            if (dataFim.HasValue)
                query = query.Where(l => l.Data <= dataFim.Value);

            var total = await query.CountAsync();
            var logs = await query
                .OrderByDescending(l => l.Data)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Estatísticas de logs
            var stats = await _context.LogsSistema
                .GroupBy(l => l.Nivel)
                .Select(g => new { Nivel = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(new
            {
                data = logs,
                pagination = new
                {
                    page,
                    pageSize,
                    total,
                    totalPages = (int)Math.Ceiling((double)total / pageSize)
                },
                stats = stats
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao buscar logs");
            return StatusCode(500, new { error = "Erro ao buscar logs" });
        }
    }

    /// <summary>
    /// Enviar cobranças para todos os usuários ativos
    /// </summary>
    [HttpPost("enviar-cobrancas")]
    [RequireAdmin]
    public async Task<ActionResult> EnviarCobrancas()
    {
        try
        {
            var valorConfig = await _context.ConfiguracoesSistema
                .FirstOrDefaultAsync(c => c.Chave == "VALOR_MENSAL_SISTEMA");

            if (valorConfig == null || string.IsNullOrEmpty(valorConfig.Valor))
            {
                return BadRequest(new { error = "Valor do sistema não configurado" });
            }

            if (!decimal.TryParse(valorConfig.Valor, out var valorMensal))
            {
                return BadRequest(new { error = "Valor do sistema inválido" });
            }

            var usuariosAtivos = await _context.Cadastros
                .Where(c => c.Status == "ativo")
                .ToListAsync();

            var diaVencimentoConfig = await _context.ConfiguracoesSistema
                .FirstOrDefaultAsync(c => c.Chave == "DIA_VENCIMENTO");
            
            var diaVencimento = int.TryParse(diaVencimentoConfig?.Valor, out var dia) ? dia : 5;

            var dataVencimento = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, diaVencimento);
            if (dataVencimento < DateTime.UtcNow)
            {
                dataVencimento = dataVencimento.AddMonths(1);
            }

            var cobrancasCriadas = 0;
            var erros = new List<string>();

            foreach (var usuario in usuariosAtivos)
            {
                try
                {
                    // Aqui você pode integrar com Mercado Pago ou outro sistema de pagamento
                    // Por enquanto, vamos apenas registrar no log
                    
                    await _context.LogsSistema.AddAsync(new LogSistema
                    {
                        Nivel = "INFO",
                        Categoria = "COBRANCA",
                        Mensagem = $"Cobrança enviada para {usuario.Email}",
                        Detalhes = $"Valor: R$ {valorMensal:F2} - Vencimento: {dataVencimento:dd/MM/yyyy}",
                        UsuarioId = usuario.Id,
                        Email = usuario.Email,
                        Data = DateTime.UtcNow
                    });

                    cobrancasCriadas++;
                }
                catch (Exception ex)
                {
                    erros.Add($"{usuario.Email}: {ex.Message}");
                    _logger.LogError(ex, "Erro ao criar cobrança para {Email}", usuario.Email);
                }
            }

            await _context.SaveChangesAsync();

            // Log geral da operação
            await _context.LogsSistema.AddAsync(new LogSistema
            {
                Nivel = "INFO",
                Categoria = "COBRANCA",
                Mensagem = "Lote de cobranças processado",
                Detalhes = $"Total: {cobrancasCriadas} cobranças criadas. Erros: {erros.Count}",
                Email = User?.FindFirst("email")?.Value,
                Data = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cobranças enviadas com sucesso",
                cobrancasCriadas,
                totalUsuarios = usuariosAtivos.Count,
                erros = erros.Any() ? erros : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao enviar cobranças");
            return StatusCode(500, new { error = "Erro ao enviar cobranças" });
        }
    }

    /// <summary>
    /// Limpar logs antigos
    /// </summary>
    [HttpDelete("logs/limpar")]
    [RequireAdmin]
    public async Task<ActionResult> LimparLogsAntigos([FromQuery] int dias = 90)
    {
        try
        {
            var dataLimite = DateTime.UtcNow.AddDays(-dias);
            var logsAntigos = await _context.LogsSistema
                .Where(l => l.Data < dataLimite)
                .ToListAsync();

            var quantidade = logsAntigos.Count;
            _context.LogsSistema.RemoveRange(logsAntigos);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"{quantidade} logs removidos",
                dataLimite
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao limpar logs");
            return StatusCode(500, new { error = "Erro ao limpar logs" });
        }
    }

    // ========================================
    // ENDPOINTS DE ASSINATURAS
    // ========================================

    /// <summary>
    /// Listar todas as assinaturas com paginação
    /// </summary>
    [HttpGet("assinaturas")]
    [RequireAdmin]
    public async Task<ActionResult> GetAssinaturas([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.Assinaturas
                .Include(a => a.Cadastro)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            var total = await query.CountAsync();
            var assinaturas = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    a.CadastroId,
                    Cliente = new
                    {
                        Nome = a.Cadastro != null ? a.Cadastro.Nome : null,
                        Email = a.Cadastro != null ? a.Cadastro.Email : "N/A",
                        Whatsapp = a.Cadastro != null ? a.Cadastro.Whatsapp : null,
                        NomeCondominio = a.Cadastro != null ? a.Cadastro.NomeCondominio : null
                    },
                    a.Plano,
                    a.Valor,
                    a.Status,
                    a.DataInicio,
                    a.DataVencimento,
                    a.DataCancelamento,
                    a.MotivosCancelamento,
                    a.FormaPagamento,
                    a.StatusPagamento,
                    a.ValorPago,
                    a.DataPagamento,
                    a.DiasAtraso,
                    a.ClienteNome,
                    a.ClienteEmail,
                    a.ClienteWhatsapp,
                    a.NomeCondominio,
                    a.CreatedAt,
                    a.UpdatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                data = assinaturas,
                pagination = new
                {
                    page,
                    pageSize,
                    total,
                    totalPages = (int)Math.Ceiling((double)total / pageSize)
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao listar assinaturas");
            return StatusCode(500, new { error = "Erro ao listar assinaturas" });
        }
    }

    /// <summary>
    /// Estatísticas das assinaturas
    /// </summary>
    [HttpGet("assinaturas/stats")]
    [RequireAdmin]
    public async Task<ActionResult> GetAssinaturasStats()
    {
        try
        {
            var total = await _context.Assinaturas.CountAsync();
            var pendentes = await _context.Assinaturas.CountAsync(a => a.Status == "pendente");
            var ativas = await _context.Assinaturas.CountAsync(a => a.Status == "ativa");
            var canceladas = await _context.Assinaturas.CountAsync(a => a.Status == "cancelada");
            var suspensas = await _context.Assinaturas.CountAsync(a => a.Status == "suspensa");
            var expiradas = await _context.Assinaturas.CountAsync(a => a.Status == "expirada");

            var receitaMensal = await _context.Assinaturas
                .Where(a => a.Status == "ativa")
                .SumAsync(a => a.Valor);

            return Ok(new
            {
                total,
                pendentes,
                ativas,
                canceladas,
                suspensas,
                expiradas,
                receitaMensal
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao obter estatísticas de assinaturas");
            return StatusCode(500, new { error = "Erro ao obter estatísticas" });
        }
    }

    /// <summary>
    /// Atualizar status de uma assinatura
    /// </summary>
    [HttpPatch("assinaturas/{id}/status")]
    [RequireAdmin]
    public async Task<ActionResult> UpdateAssinaturaStatus(Guid id, [FromBody] UpdateAssinaturaStatusRequest request)
    {
        try
        {
            var assinatura = await _context.Assinaturas.FindAsync(id);
            if (assinatura == null)
            {
                return NotFound(new { error = "Assinatura não encontrada" });
            }

            var statusAnterior = assinatura.Status;
            assinatura.Status = request.Status;
            
            // Se está aprovando (pendente -> ativa), define vencimento para +30 dias
            if (statusAnterior == "pendente" && request.Status == "ativa")
            {
                assinatura.DataVencimento = DateTime.UtcNow.AddDays(30);
            }
            
            if (request.Status == "cancelada")
            {
                assinatura.DataCancelamento = DateTime.UtcNow;
                assinatura.MotivosCancelamento = request.Motivo;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Status da assinatura {Id} atualizado de {StatusAnterior} para {StatusNovo}", id, statusAnterior, request.Status);

            return Ok(new { message = "Status atualizado com sucesso", assinatura });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao atualizar status da assinatura");
            return StatusCode(500, new { error = "Erro ao atualizar status" });
        }
    }

    /// <summary>
    /// Renovar uma assinatura
    /// </summary>
    [HttpPost("assinaturas/{id}/renovar")]
    [RequireAdmin]
    public async Task<ActionResult> RenovarAssinatura(Guid id, [FromBody] RenovarAssinaturaRequest request)
    {
        try
        {
            var assinatura = await _context.Assinaturas.FindAsync(id);
            if (assinatura == null)
            {
                return NotFound(new { error = "Assinatura não encontrada" });
            }

            assinatura.Status = "ativa";
            assinatura.DataVencimento = DateTime.UtcNow.AddMonths(request.Meses);
            assinatura.DataCancelamento = null;
            assinatura.MotivosCancelamento = null;

            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Assinatura {Id} renovada por {Meses} meses", id, request.Meses);

            return Ok(new { message = "Assinatura renovada com sucesso", assinatura });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao renovar assinatura");
            return StatusCode(500, new { error = "Erro ao renovar assinatura" });
        }
    }

    /// <summary>
    /// Criar uma nova assinatura manualmente
    /// </summary>
    [HttpPost("assinaturas")]
    [RequireAdmin]
    public async Task<ActionResult> CreateAssinatura([FromBody] CreateAssinaturaRequest request)
    {
        try
        {
            var cadastro = await _context.Cadastros.FindAsync(request.CadastroId);
            if (cadastro == null)
            {
                return NotFound(new { error = "Cadastro não encontrado" });
            }

            var assinatura = new Assinatura
            {
                Id = Guid.NewGuid(),
                CadastroId = request.CadastroId,
                Plano = request.Plano ?? "mensal",
                Valor = request.Valor ?? 990.00M,
                Status = request.Status ?? "pendente",
                DataInicio = request.DataInicio ?? DateTime.UtcNow,
                DataVencimento = request.DataVencimento,
                FormaPagamento = request.FormaPagamento ?? "pix",
                CreatedAt = DateTime.UtcNow
            };

            _context.Assinaturas.Add(assinatura);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Nova assinatura criada: {Id}", assinatura.Id);

            return Ok(new { message = "Assinatura criada com sucesso", assinatura });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao criar assinatura");
            return StatusCode(500, new { error = "Erro ao criar assinatura" });
        }
    }

    // =====================================================
    // ENDPOINTS DE GERENCIAMENTO DE ADMINISTRADORES
    // =====================================================

    /// <summary>
    /// Lista todos os administradores
    /// </summary>
    [HttpGet("administradores")]
    [RequireAdmin]
    public async Task<ActionResult> GetAdministradores()
    {
        try
        {
            var admins = await _administrativoRepository.GetAllAsync();
            
            var result = admins.Select(a => new
            {
                a.Id,
                a.Email,
                a.Nome,
                a.Ativo,
                a.CreatedAt,
                a.UpdatedAt,
                temSenha = !string.IsNullOrEmpty(a.SenhaHash)
            }).OrderByDescending(a => a.CreatedAt);

            _logger.LogInformation("📋 Listando {Count} administradores", result.Count());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao listar administradores");
            return StatusCode(500, new { error = "Erro ao listar administradores" });
        }
    }

    /// <summary>
    /// Cria um novo administrador
    /// </summary>
    [HttpPost("administradores")]
    [RequireAdmin]
    public async Task<ActionResult> CreateAdministrador([FromBody] CreateAdministradorRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { error = "Email é obrigatório" });
            }

            // Verificar se já existe
            var existente = await _administrativoRepository.GetByEmailAsync(request.Email);
            if (existente != null)
            {
                return BadRequest(new { error = "Já existe um administrador com este email" });
            }

            var admin = new Administrativo
            {
                Id = Guid.NewGuid(),
                Email = request.Email.ToLower().Trim(),
                Nome = request.Nome,
                Ativo = true,
                CreatedAt = DateTime.UtcNow
            };

            // Se senha foi fornecida, fazer hash
            if (!string.IsNullOrWhiteSpace(request.Senha))
            {
                admin.SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha);
            }

            await _administrativoRepository.AddAsync(admin);
            
            _logger.LogInformation("✅ Novo administrador criado: {Email}", admin.Email);

            return Ok(new 
            { 
                message = "Administrador criado com sucesso",
                admin = new
                {
                    admin.Id,
                    admin.Email,
                    admin.Nome,
                    admin.Ativo,
                    admin.CreatedAt,
                    temSenha = !string.IsNullOrEmpty(admin.SenhaHash)
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao criar administrador");
            return StatusCode(500, new { error = "Erro ao criar administrador" });
        }
    }

    /// <summary>
    /// Atualiza o status (ativo/inativo) de um administrador
    /// </summary>
    [HttpPatch("administradores/{id}/status")]
    [RequireAdmin]
    public async Task<ActionResult> UpdateAdministradorStatus(Guid id, [FromBody] UpdateAdminStatusRequest request)
    {
        try
        {
            var admin = await _administrativoRepository.GetByIdAsync(id);
            
            if (admin == null)
            {
                return NotFound(new { error = "Administrador não encontrado" });
            }

            admin.Ativo = request.Ativo;
            admin.UpdatedAt = DateTime.UtcNow;

            await _administrativoRepository.UpdateAsync(admin);
            
            _logger.LogInformation("✅ Status do admin {Email} alterado para {Status}", admin.Email, request.Ativo ? "Ativo" : "Inativo");

            return Ok(new { message = $"Administrador {(request.Ativo ? "ativado" : "desativado")} com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao atualizar status do administrador");
            return StatusCode(500, new { error = "Erro ao atualizar status" });
        }
    }

    /// <summary>
    /// Define ou atualiza a senha de um administrador
    /// </summary>
    [HttpPatch("administradores/{id}/senha")]
    [RequireAdmin]
    public async Task<ActionResult> UpdateAdministradorSenha(Guid id, [FromBody] UpdateAdminSenhaRequest request)
    {
        try
        {
            var admin = await _administrativoRepository.GetByIdAsync(id);
            
            if (admin == null)
            {
                return NotFound(new { error = "Administrador não encontrado" });
            }

            if (string.IsNullOrWhiteSpace(request.NovaSenha))
            {
                return BadRequest(new { error = "Nova senha é obrigatória" });
            }

            if (request.NovaSenha.Length < 6)
            {
                return BadRequest(new { error = "Senha deve ter pelo menos 6 caracteres" });
            }

            admin.SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.NovaSenha);
            admin.UpdatedAt = DateTime.UtcNow;

            await _administrativoRepository.UpdateAsync(admin);
            
            _logger.LogInformation("✅ Senha do admin {Email} atualizada", admin.Email);

            return Ok(new { message = "Senha atualizada com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao atualizar senha do administrador");
            return StatusCode(500, new { error = "Erro ao atualizar senha" });
        }
    }

    /// <summary>
    /// Exclui um administrador
    /// </summary>
    [HttpDelete("administradores/{id}")]
    [RequireAdmin]
    public async Task<ActionResult> DeleteAdministrador(Guid id)
    {
        try
        {
            var admin = await _administrativoRepository.GetByIdAsync(id);
            
            if (admin == null)
            {
                return NotFound(new { error = "Administrador não encontrado" });
            }

            // Verificar se não é o próprio usuário logado
            var userEmail = User?.FindFirst("email")?.Value 
                ?? User?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            
            if (admin.Email.Equals(userEmail, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { error = "Você não pode excluir sua própria conta" });
            }

            await _administrativoRepository.DeleteAsync(id);
            
            _logger.LogInformation("✅ Administrador {Email} excluído", admin.Email);

            return Ok(new { message = "Administrador excluído com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao excluir administrador");
            return StatusCode(500, new { error = "Erro ao excluir administrador" });
        }
    }

    #region Despesas do Sistema

    /// <summary>
    /// Lista todas as despesas do sistema administrativo
    /// </summary>
    [HttpGet("despesas-sistema")]
    [RequireAdmin]
    public async Task<ActionResult<IEnumerable<DespesaSistema>>> GetDespesasSistema()
    {
        try
        {
            var despesas = await _context.DespesasSistema
                .OrderByDescending(d => d.DataLancamento)
                .ToListAsync();

            _logger.LogInformation("📋 Listando {Count} despesas do sistema", despesas.Count);
            return Ok(despesas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao listar despesas do sistema");
            return StatusCode(500, new { error = "Erro ao listar despesas do sistema" });
        }
    }

    /// <summary>
    /// Cria uma nova despesa do sistema
    /// </summary>
    [HttpPost("despesas-sistema")]
    [RequireAdmin]
    public async Task<ActionResult<DespesaSistema>> CreateDespesaSistema([FromBody] CreateDespesaSistemaRequest request)
    {
        try
        {
            var despesa = new DespesaSistema
            {
                Id = Guid.NewGuid(),
                Descricao = request.Descricao,
                Valor = request.Valor,
                Categoria = request.Categoria ?? "outros",
                DataLancamento = request.DataLancamento ?? DateTime.UtcNow,
                Status = request.Status ?? "pendente",
                Observacao = request.Observacao,
                CreatedAt = DateTime.UtcNow
            };

            _context.DespesasSistema.Add(despesa);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Despesa do sistema criada: {Descricao} - R$ {Valor}", 
                despesa.Descricao, despesa.Valor);

            return Ok(despesa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao criar despesa do sistema");
            return StatusCode(500, new { error = "Erro ao criar despesa do sistema" });
        }
    }

    /// <summary>
    /// Marca uma despesa do sistema como paga
    /// </summary>
    [HttpPatch("despesas-sistema/{id}/pagar")]
    [RequireAdmin]
    public async Task<ActionResult<DespesaSistema>> MarcarDespesaComoPaga(Guid id)
    {
        try
        {
            var despesa = await _context.DespesasSistema.FindAsync(id);
            
            if (despesa == null)
            {
                return NotFound(new { error = "Despesa não encontrada" });
            }

            despesa.MarcarComoPago();
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Despesa {Id} marcada como paga", id);

            return Ok(despesa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao marcar despesa como paga");
            return StatusCode(500, new { error = "Erro ao marcar despesa como paga" });
        }
    }

    /// <summary>
    /// Exclui uma despesa do sistema
    /// </summary>
    [HttpDelete("despesas-sistema/{id}")]
    [RequireAdmin]
    public async Task<ActionResult> DeleteDespesaSistema(Guid id)
    {
        try
        {
            var despesa = await _context.DespesasSistema.FindAsync(id);
            
            if (despesa == null)
            {
                return NotFound(new { error = "Despesa não encontrada" });
            }

            _context.DespesasSistema.Remove(despesa);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Despesa {Id} excluída", id);

            return Ok(new { message = "Despesa excluída com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao excluir despesa do sistema");
            return StatusCode(500, new { error = "Erro ao excluir despesa do sistema" });
        }
    }

    #endregion
}

// DTO para atualização de configuração
public record UpdateConfigRequest(string Valor);

// DTOs para Assinaturas
public record UpdateAssinaturaStatusRequest(string Status, string? Motivo);
public record RenovarAssinaturaRequest(int Meses);
public record CreateAssinaturaRequest(
    Guid CadastroId,
    string? Plano,
    decimal? Valor,
    string? Status,
    DateTime? DataInicio,
    DateTime? DataVencimento,
    string? FormaPagamento
);

// DTOs para Administradores
public record CreateAdministradorRequest(string Email, string? Nome, string? Senha);
public record UpdateAdminStatusRequest(bool Ativo);
public record UpdateAdminSenhaRequest(string NovaSenha);

// DTO para criação de cliente pelo admin
public record CreateUsuarioAdminRequest(string Email, string Senha, string? Nome);

// DTO para alterar status do usuário pelo admin
public record UpdateUsuarioStatusRequest(string Status);

// DTOs para Despesas do Sistema
public record CreateDespesaSistemaRequest(
    string Descricao,
    decimal Valor,
    string? Categoria,
    DateTime? DataLancamento,
    string? Status,
    string? Observacao
);

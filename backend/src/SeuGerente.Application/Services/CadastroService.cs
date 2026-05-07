using AutoMapper;
using Microsoft.Extensions.Logging;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class CadastroService
{
    private readonly ICadastroRepository _cadastroRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CadastroService> _logger;

    public CadastroService(
        ICadastroRepository cadastroRepository,
        IMoradorRepository moradorRepository,
        IMapper mapper,
        ILogger<CadastroService> logger)
    {
        _cadastroRepository = cadastroRepository;
        _moradorRepository = moradorRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<CadastroStatusDTO?> GetStatusAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var cadastro = await _cadastroRepository.GetByIdAsync(userId, cancellationToken);
        if (cadastro == null) return null;
        return new CadastroStatusDTO { Status = cadastro.Status };
    }

    public async Task<CadastroDTO?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var cadastro = await _cadastroRepository.GetByEmailAsync(email, cancellationToken);
        return cadastro != null ? _mapper.Map<CadastroDTO>(cadastro) : null;
    }

    public async Task<CadastroDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var cadastro = await _cadastroRepository.GetByIdAsync(id, cancellationToken);
        return cadastro != null ? _mapper.Map<CadastroDTO>(cadastro) : null;
    }

    public async Task<List<object>> GetAllCadastrosDebugAsync(CancellationToken cancellationToken = default)
    {
        var cadastros = await _cadastroRepository.GetAllAsync(cancellationToken);
        return cadastros.Select(c => new { c.Id, c.Email, c.Nome }).ToList<object>();
    }

    public async Task CriarOuAtualizarAsync(dynamic request, CancellationToken cancellationToken = default)
    {
        try
        {
            var cadastroExistente = await _cadastroRepository.GetByEmailAsync(request.email, cancellationToken);

            if (cadastroExistente != null)
            {
                // Atualizar cadastro existente
                cadastroExistente.Nome = request.nome;
                cadastroExistente.CnpjCpf = request.cnpj_cpf;
                cadastroExistente.Whatsapp = request.whatsapp;
                cadastroExistente.NomeCondominio = request.nome_condominio;
                cadastroExistente.QuantidadeApartamentos = request.quantidade_apartamentos;
                cadastroExistente.UpdatedAt = DateTime.UtcNow;

                await _cadastroRepository.UpdateAsync(cadastroExistente, cancellationToken);
            }
            else
            {
                // Criar novo cadastro
                Guid userId;
                if (!Guid.TryParse(request.user_id.ToString(), out userId))
                {
                    throw new FormatException($"user_id inválido: {request.user_id}");
                }

                var cadastro = new Cadastro
                {
                    Id = userId,
                    Email = request.email,
                    Nome = request.nome,
                    CnpjCpf = request.cnpj_cpf,
                    Whatsapp = request.whatsapp,
                    NomeCondominio = request.nome_condominio,
                    QuantidadeApartamentos = request.quantidade_apartamentos,
                    Status = "pendente",
                    CreatedAt = DateTime.UtcNow
                };

                await _cadastroRepository.AddAsync(cadastro, cancellationToken);

                // Criar apartamentos vazios automaticamente
                await CriarApartamentosAsync(userId, request.quantidade_apartamentos, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Erro ao criar/atualizar cadastro: {ex.Message}", ex);
        }
    }

    private async Task CriarApartamentosAsync(Guid usuarioId, int quantidade, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Criando {Quantidade} apartamentos para usuário {UsuarioId}", quantidade, usuarioId);

        for (int i = 1; i <= quantidade; i++)
        {
            try
            {
                var morador = new Morador
                {
                    Id = Guid.NewGuid(),
                    Numero = i.ToString(),
                    Nome = $"Apartamento {i}",
                    Email = null,
                    Telefone = null,
                    Tipo = "morador",
                    UsuarioId = usuarioId
                };

                await _moradorRepository.AddAsync(morador, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar apartamento {Numero}/{Total}: {Message}", i, quantidade, ex.InnerException?.Message ?? ex.Message);
                throw new Exception($"Erro ao criar apartamento {i}: {ex.InnerException?.Message ?? ex.Message}", ex);
            }
        }

        _logger.LogInformation("{Quantidade} apartamentos criados para usuário {UsuarioId}", quantidade, usuarioId);
    }

    public async Task AtivarAssinaturaAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var cadastro = await _cadastroRepository.GetByIdAsync(userId, cancellationToken);
        if (cadastro == null)
        {
            throw new KeyNotFoundException("Cadastro não encontrado");
        }

        cadastro.Status = "ativo";
        cadastro.UpdatedAt = DateTime.UtcNow;
        await _cadastroRepository.UpdateAsync(cadastro, cancellationToken);
    }
}

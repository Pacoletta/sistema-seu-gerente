using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class ConfiguracaoEmailService
{
    private readonly IConfiguracaoEmailRepository _repository;
    private readonly IMapper _mapper;

    public ConfiguracaoEmailService(IConfiguracaoEmailRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ConfiguracaoEmailDTO?> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var config = await _repository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return config != null ? _mapper.Map<ConfiguracaoEmailDTO>(config) : null;
    }

    public async Task<ConfiguracaoEmailDTO> UpsertAsync(Guid usuarioId, UpdateConfiguracaoEmailDTO updateDto, CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByUsuarioIdAsync(usuarioId, cancellationToken);

        if (existing != null)
        {
            // Precisamos buscar com tracking para update
            var tracked = await _repository.GetByIdAsync(existing.Id, cancellationToken);
            if (tracked != null)
            {
                tracked.EmailRemetente = updateDto.EmailRemetente;
                tracked.SenhaApp = updateDto.SenhaApp;
                tracked.Ativo = updateDto.Ativo;
                tracked.AtualizadoEm = DateTime.UtcNow;
                await _repository.UpdateAsync(tracked, cancellationToken);
                return _mapper.Map<ConfiguracaoEmailDTO>(tracked);
            }
        }

        var newConfig = new ConfiguracaoEmail
        {
            UsuarioId = usuarioId,
            EmailRemetente = updateDto.EmailRemetente,
            SenhaApp = updateDto.SenhaApp,
            Ativo = updateDto.Ativo,
            CriadoEm = DateTime.UtcNow,
            AtualizadoEm = DateTime.UtcNow
        };

        var created = await _repository.AddAsync(newConfig, cancellationToken);
        return _mapper.Map<ConfiguracaoEmailDTO>(created);
    }
}

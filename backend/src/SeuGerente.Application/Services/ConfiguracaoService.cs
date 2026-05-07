using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class ConfiguracaoService
{
    private readonly IConfiguracaoRepository _configuracaoRepository;
    private readonly IMapper _mapper;

    public ConfiguracaoService(IConfiguracaoRepository configuracaoRepository, IMapper mapper)
    {
        _configuracaoRepository = configuracaoRepository;
        _mapper = mapper;
    }

    public async Task<ConfiguracaoDTO?> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var configuracao = await _configuracaoRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return configuracao != null ? _mapper.Map<ConfiguracaoDTO>(configuracao) : null;
    }

    public async Task<ConfiguracaoDTO> UpdateAsync(Guid usuarioId, UpdateConfiguracaoDTO updateDto, CancellationToken cancellationToken = default)
    {
        var configuracao = await _configuracaoRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        
        if (configuracao == null)
        {
            // Criar nova configuração se não existir
            configuracao = new Configuracao { UsuarioId = usuarioId };
            _mapper.Map(updateDto, configuracao);
            var criada = await _configuracaoRepository.AddAsync(configuracao, cancellationToken);
            return _mapper.Map<ConfiguracaoDTO>(criada);
        }

        _mapper.Map(updateDto, configuracao);
        await _configuracaoRepository.UpdateAsync(configuracao, cancellationToken);
        return _mapper.Map<ConfiguracaoDTO>(configuracao);
    }
}

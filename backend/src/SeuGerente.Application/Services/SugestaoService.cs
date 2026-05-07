using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class SugestaoService
{
    private readonly ISugestaoRepository _sugestaoRepository;
    private readonly IMapper _mapper;

    public SugestaoService(ISugestaoRepository sugestaoRepository, IMapper mapper)
    {
        _sugestaoRepository = sugestaoRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SugestaoDTO>> GetAllByUsuarioAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var sugestoes = await _sugestaoRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<SugestaoDTO>>(sugestoes);
    }

    public async Task<SugestaoDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sugestao = await _sugestaoRepository.GetByIdAsync(id, cancellationToken);
        return sugestao != null ? _mapper.Map<SugestaoDTO>(sugestao) : null;
    }

    public async Task<SugestaoDTO> CreateAsync(CreateSugestaoDTO createDto, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var sugestao = _mapper.Map<Sugestao>(createDto);
        sugestao.UsuarioId = usuarioId;
        sugestao.CreatedAt = DateTime.UtcNow;
        sugestao.UpdatedAt = DateTime.UtcNow;

        var created = await _sugestaoRepository.AddAsync(sugestao, cancellationToken);
        return _mapper.Map<SugestaoDTO>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateSugestaoDTO updateDto, CancellationToken cancellationToken = default)
    {
        var sugestao = await _sugestaoRepository.GetByIdAsync(id, cancellationToken);
        if (sugestao == null)
        {
            throw new KeyNotFoundException("Sugestão não encontrada");
        }

        _mapper.Map(updateDto, sugestao);
        sugestao.UpdatedAt = DateTime.UtcNow;
        await _sugestaoRepository.UpdateAsync(sugestao, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _sugestaoRepository.DeleteAsync(id, cancellationToken);
    }
}

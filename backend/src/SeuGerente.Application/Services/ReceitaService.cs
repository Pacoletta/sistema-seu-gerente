using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class ReceitaService
{
    private readonly IReceitaRepository _receitaRepository;
    private readonly IMapper _mapper;

    public ReceitaService(IReceitaRepository receitaRepository, IMapper mapper)
    {
        _receitaRepository = receitaRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ReceitaDTO>> GetAllByUsuarioAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var receitas = await _receitaRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<ReceitaDTO>>(receitas);
    }

    public async Task<ReceitaDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var receita = await _receitaRepository.GetByIdAsync(id, cancellationToken);
        return receita != null ? _mapper.Map<ReceitaDTO>(receita) : null;
    }

    public async Task<ReceitaDTO> CreateAsync(CreateReceitaDTO createDto, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var receita = _mapper.Map<Receita>(createDto);
        receita.UsuarioId = usuarioId;

        var created = await _receitaRepository.AddAsync(receita, cancellationToken);
        return _mapper.Map<ReceitaDTO>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateReceitaDTO updateDto, CancellationToken cancellationToken = default)
    {
        var receita = await _receitaRepository.GetByIdAsync(id, cancellationToken);
        if (receita == null)
        {
            throw new KeyNotFoundException("Receita não encontrada");
        }

        _mapper.Map(updateDto, receita);
        await _receitaRepository.UpdateAsync(receita, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _receitaRepository.DeleteAsync(id, cancellationToken);
    }
}

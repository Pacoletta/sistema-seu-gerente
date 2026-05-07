using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class MoradorService
{
    private readonly IMoradorRepository _moradorRepository;
    private readonly IMapper _mapper;

    public MoradorService(IMoradorRepository moradorRepository, IMapper mapper)
    {
        _moradorRepository = moradorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MoradorDTO>> GetAllByUsuarioAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var moradores = await _moradorRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<MoradorDTO>>(moradores);
    }

    public async Task<MoradorDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var morador = await _moradorRepository.GetByIdAsync(id, cancellationToken);
        return morador != null ? _mapper.Map<MoradorDTO>(morador) : null;
    }

    public async Task<MoradorDTO> CreateAsync(CreateMoradorDTO createDto, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var morador = _mapper.Map<Morador>(createDto);
        morador.UsuarioId = usuarioId;

        var created = await _moradorRepository.AddAsync(morador, cancellationToken);
        return _mapper.Map<MoradorDTO>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateMoradorDTO updateDto, CancellationToken cancellationToken = default)
    {
        var morador = await _moradorRepository.GetByIdAsync(id, cancellationToken);
        if (morador == null)
        {
            throw new KeyNotFoundException("Morador não encontrado");
        }

        _mapper.Map(updateDto, morador);
        await _moradorRepository.UpdateAsync(morador, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _moradorRepository.DeleteAsync(id, cancellationToken);
    }
}

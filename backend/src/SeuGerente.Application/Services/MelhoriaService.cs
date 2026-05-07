using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class MelhoriaService
{
    private readonly IMelhoriaRepository _melhoriaRepository;
    private readonly IMapper _mapper;

    public MelhoriaService(IMelhoriaRepository melhoriaRepository, IMapper mapper)
    {
        _melhoriaRepository = melhoriaRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MelhoriaDTO>> GetAllByUsuarioAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var melhorias = await _melhoriaRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<MelhoriaDTO>>(melhorias);
    }

    public async Task<MelhoriaDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var melhoria = await _melhoriaRepository.GetByIdAsync(id, cancellationToken);
        return melhoria != null ? _mapper.Map<MelhoriaDTO>(melhoria) : null;
    }

    public async Task<MelhoriaDTO> CreateAsync(CreateMelhoriaDTO createDto, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var melhoria = _mapper.Map<Melhoria>(createDto);
        melhoria.UsuarioId = usuarioId;
        melhoria.CreatedAt = DateTime.UtcNow;
        melhoria.UpdatedAt = DateTime.UtcNow;

        var created = await _melhoriaRepository.AddAsync(melhoria, cancellationToken);
        return _mapper.Map<MelhoriaDTO>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateMelhoriaDTO updateDto, CancellationToken cancellationToken = default)
    {
        var melhoria = await _melhoriaRepository.GetByIdAsync(id, cancellationToken);
        if (melhoria == null)
        {
            throw new KeyNotFoundException("Melhoria não encontrada");
        }

        _mapper.Map(updateDto, melhoria);
        melhoria.UpdatedAt = DateTime.UtcNow;
        await _melhoriaRepository.UpdateAsync(melhoria, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _melhoriaRepository.DeleteAsync(id, cancellationToken);
    }
}

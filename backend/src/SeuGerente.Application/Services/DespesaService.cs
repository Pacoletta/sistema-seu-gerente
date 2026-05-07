using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class DespesaService
{
    private readonly IDespesaRepository _despesaRepository;
    private readonly IMapper _mapper;

    public DespesaService(IDespesaRepository despesaRepository, IMapper mapper)
    {
        _despesaRepository = despesaRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DespesaDTO>> GetAllByUsuarioAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var despesas = await _despesaRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        var dtos = _mapper.Map<IEnumerable<DespesaDTO>>(despesas);
        return dtos;
    }

    public async Task<IEnumerable<DespesaDTO>> GetByMesAnoAsync(string mesAno, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var despesas = await _despesaRepository.GetByMesAnoAsync(mesAno, usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<DespesaDTO>>(despesas);
    }

    public async Task<DespesaDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var despesa = await _despesaRepository.GetByIdAsync(id, cancellationToken);
        return despesa != null ? _mapper.Map<DespesaDTO>(despesa) : null;
    }

    public async Task<DespesaDTO> CreateAsync(CreateDespesaDTO createDto, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var despesa = _mapper.Map<Despesa>(createDto);
        despesa.UsuarioId = usuarioId;

        var created = await _despesaRepository.AddAsync(despesa, cancellationToken);
        return _mapper.Map<DespesaDTO>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateDespesaDTO updateDto, CancellationToken cancellationToken = default)
    {
        var despesa = await _despesaRepository.GetByIdAsync(id, cancellationToken);
        if (despesa == null)
        {
            throw new KeyNotFoundException("Despesa não encontrada");
        }

        // Atualizar apenas os campos que foram enviados (não nulos)
        if (updateDto.Data.HasValue)
            despesa.Data = updateDto.Data.Value;
        
        if (!string.IsNullOrEmpty(updateDto.Descricao))
            despesa.Descricao = updateDto.Descricao;
        
        if (!string.IsNullOrEmpty(updateDto.Categoria))
            despesa.Categoria = updateDto.Categoria;
        
        if (updateDto.Valor.HasValue)
            despesa.Valor = updateDto.Valor.Value;
        
        if (updateDto.ValoresPorAp != null)
            despesa.ValoresPorAp = updateDto.ValoresPorAp;
        
        if (!string.IsNullOrEmpty(updateDto.TipoDivisao))
            despesa.TipoDivisao = updateDto.TipoDivisao;
        
        if (updateDto.ComprovanteUrl != null) // Permite string vazia para remover
            despesa.ComprovanteUrl = string.IsNullOrEmpty(updateDto.ComprovanteUrl) ? null : updateDto.ComprovanteUrl;
        
        if (updateDto.MelhoriaId.HasValue)
            despesa.MelhoriaId = updateDto.MelhoriaId;
        
        if (!string.IsNullOrEmpty(updateDto.Origem))
            despesa.Origem = updateDto.Origem;
        
        if (!string.IsNullOrEmpty(updateDto.Status))
            despesa.Status = updateDto.Status;

        await _despesaRepository.UpdateAsync(despesa, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _despesaRepository.DeleteAsync(id, cancellationToken);
    }
}

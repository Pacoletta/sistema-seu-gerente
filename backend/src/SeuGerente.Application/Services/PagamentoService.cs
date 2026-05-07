using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Enums;
using SeuGerente.Domain.Interfaces;

namespace SeuGerente.Application.Services;

public class PagamentoService
{
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly IMapper _mapper;

    public PagamentoService(
        IPagamentoRepository pagamentoRepository,
        IMoradorRepository moradorRepository,
        IMapper mapper)
    {
        _pagamentoRepository = pagamentoRepository;
        _moradorRepository = moradorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PagamentoDTO>> GetAllByUsuarioAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var pagamentos = await _pagamentoRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<PagamentoDTO>>(pagamentos);
    }

    public async Task<IEnumerable<PagamentoDTO>> GetByMesAnoAsync(string mesAno, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var pagamentos = await _pagamentoRepository.GetByMesAnoAsync(mesAno, usuarioId, cancellationToken);
        return _mapper.Map<IEnumerable<PagamentoDTO>>(pagamentos);
    }

    public async Task<PagamentoDTO?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var pagamento = await _pagamentoRepository.GetByIdAsync(id, cancellationToken);
        return pagamento != null ? _mapper.Map<PagamentoDTO>(pagamento) : null;
    }

    public async Task<PagamentoDTO> CreateAsync(CreatePagamentoDTO createDto, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        // Validar se o morador existe
        if (createDto.MoradorId != Guid.Empty)
        {
            var morador = await _moradorRepository.GetByIdAsync(createDto.MoradorId, cancellationToken);
            if (morador == null)
            {
                throw new KeyNotFoundException($"Morador com ID {createDto.MoradorId} não encontrado");
            }
        }

        var pagamento = _mapper.Map<Pagamento>(createDto);
        pagamento.UsuarioId = usuarioId;

        var created = await _pagamentoRepository.AddAsync(pagamento, cancellationToken);
        return _mapper.Map<PagamentoDTO>(created);
    }

    public async Task UpdateStatusAsync(Guid id, UpdatePagamentoStatusDTO statusDto, CancellationToken cancellationToken = default)
    {
        var pagamento = await _pagamentoRepository.GetByIdAsync(id, cancellationToken);
        if (pagamento == null)
        {
            throw new KeyNotFoundException("Pagamento não encontrado");
        }

        if (statusDto.Status == StatusPagamento.Pago)
        {
            pagamento.MarcarComoPago(statusDto.UrlComprovante);
        }
        else
        {
            pagamento.Status = statusDto.Status.ToString().ToLower();
        }

        await _pagamentoRepository.UpdateAsync(pagamento, cancellationToken);
    }

    public async Task<IEnumerable<PagamentoDTO>> GerarPagamentosMensaisAsync(
        GerarPagamentosMensaisDTO dto, 
        Guid usuarioId, 
        CancellationToken cancellationToken = default)
    {
        var moradores = await _moradorRepository.GetByUsuarioIdAsync(usuarioId, cancellationToken);
        var pagamentosCriados = new List<Pagamento>();

        foreach (var morador in moradores)
        {
            // Verificar se já existe pagamento para este morador neste mês
            var existente = await _pagamentoRepository.GetByMoradorMesAnoAsync(
                morador.Id, 
                dto.MesAno, 
                cancellationToken);

            if (existente == null)
            {
                var pagamento = new Pagamento
                {
                    MoradorId = morador.Id,
                    MesAno = dto.MesAno,
                    Valor = dto.ValorBase,
                    DataVencimento = dto.DataVencimento,
                    UsuarioId = usuarioId,
                    Status = "pendente",
                    CreatedAt = DateTime.UtcNow
                };

                var criado = await _pagamentoRepository.AddAsync(pagamento, cancellationToken);
                pagamentosCriados.Add(criado);
            }
        }

        return _mapper.Map<IEnumerable<PagamentoDTO>>(pagamentosCriados);
    }

    public async Task UpdateAsync(Guid id, UpdatePagamentoDTO updateDto, CancellationToken cancellationToken = default)
    {
        var pagamento = await _pagamentoRepository.GetByIdAsync(id, cancellationToken);
        if (pagamento == null)
        {
            throw new KeyNotFoundException("Pagamento não encontrado");
        }

        if (updateDto.Valor.HasValue) pagamento.Valor = updateDto.Valor.Value;
        if (updateDto.Caixinha.HasValue) pagamento.Caixinha = updateDto.Caixinha.Value;
        if (updateDto.DataVencimento.HasValue) pagamento.DataVencimento = updateDto.DataVencimento.Value;
        if (updateDto.DataPagamento.HasValue) pagamento.DataPagamento = updateDto.DataPagamento.Value;
        if (updateDto.Status != null) pagamento.Status = updateDto.Status;
        if (updateDto.UrlComprovante != null) pagamento.UrlComprovante = string.IsNullOrEmpty(updateDto.UrlComprovante) ? null : updateDto.UrlComprovante;
        if (updateDto.MesAno != null) pagamento.MesAno = updateDto.MesAno;
        if (updateDto.MoradorId.HasValue) pagamento.MoradorId = updateDto.MoradorId.Value;

        pagamento.UpdatedAt = DateTime.UtcNow;
        await _pagamentoRepository.UpdateAsync(pagamento, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _pagamentoRepository.DeleteAsync(id, cancellationToken);
    }
}

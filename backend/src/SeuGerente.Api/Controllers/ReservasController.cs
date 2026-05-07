using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using System.Security.Claims;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/reservas")]
[Authorize]
public class ReservasController : ControllerBase
{
    private readonly IReservaRepository _reservaRepository;
    private readonly ILogger<ReservasController> _logger;

    public ReservasController(IReservaRepository reservaRepository, ILogger<ReservasController> logger)
    {
        _reservaRepository = reservaRepository;
        _logger = logger;
    }

    private Guid GetUsuarioId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(claim!);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var reservas = await _reservaRepository.GetByUsuarioIdAsync(usuarioId);
            var result = reservas.Select(r => MapToDto(r));
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar reservas");
            return StatusCode(500, new { message = "Erro ao listar reservas" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null || reserva.UsuarioId != usuarioId)
                return NotFound(new { message = "Reserva não encontrada" });
            return Ok(MapToDto(reserva));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar reserva {Id}", id);
            return StatusCode(500, new { message = "Erro ao buscar reserva" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ReservaRequest request)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var reserva = new Reserva
            {
                Id = Guid.NewGuid(),
                Espaco = request.Espaco.Trim(),
                Morador = request.Morador.Trim(),
                DataReserva = request.DataReserva,
                HoraInicio = request.HoraInicio,
                HoraFim = request.HoraFim,
                Status = request.Status ?? "pendente",
                Observacoes = request.Observacoes?.Trim(),
                UsuarioId = usuarioId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            await _reservaRepository.AddAsync(reserva);
            _logger.LogInformation("Reserva criada: {Espaco} em {Data}", reserva.Espaco, reserva.DataReserva);
            return CreatedAtAction(nameof(GetById), new { id = reserva.Id }, MapToDto(reserva));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar reserva");
            return StatusCode(500, new { message = "Erro ao criar reserva" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ReservaRequest request)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null || reserva.UsuarioId != usuarioId)
                return NotFound(new { message = "Reserva não encontrada" });

            reserva.Espaco = request.Espaco.Trim();
            reserva.Morador = request.Morador.Trim();
            reserva.DataReserva = request.DataReserva;
            reserva.HoraInicio = request.HoraInicio;
            reserva.HoraFim = request.HoraFim;
            reserva.Status = request.Status ?? reserva.Status;
            reserva.Observacoes = request.Observacoes?.Trim();
            reserva.UpdatedAt = DateTime.UtcNow;

            await _reservaRepository.UpdateAsync(reserva);
            return Ok(MapToDto(reserva));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar reserva {Id}", id);
            return StatusCode(500, new { message = "Erro ao atualizar reserva" });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] ReservaStatusRequest request)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null || reserva.UsuarioId != usuarioId)
                return NotFound(new { message = "Reserva não encontrada" });

            reserva.Status = request.Status;
            reserva.UpdatedAt = DateTime.UtcNow;
            await _reservaRepository.UpdateAsync(reserva);
            return Ok(MapToDto(reserva));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar status da reserva {Id}", id);
            return StatusCode(500, new { message = "Erro ao atualizar status" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var usuarioId = GetUsuarioId();
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null || reserva.UsuarioId != usuarioId)
                return NotFound(new { message = "Reserva não encontrada" });

            await _reservaRepository.DeleteAsync(reserva.Id);
            return Ok(new { message = "Reserva excluída com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao excluir reserva {Id}", id);
            return StatusCode(500, new { message = "Erro ao excluir reserva" });
        }
    }

    private static object MapToDto(Reserva r) => new
    {
        id = r.Id,
        espaco = r.Espaco,
        morador = r.Morador,
        dataReserva = r.DataReserva,
        horaInicio = r.HoraInicio,
        horaFim = r.HoraFim,
        status = r.Status,
        observacoes = r.Observacoes,
        createdAt = r.CreatedAt,
    };
}

public record ReservaRequest(
    string Espaco,
    string Morador,
    string DataReserva,
    string HoraInicio,
    string HoraFim,
    string? Status,
    string? Observacoes
);

public record ReservaStatusRequest(string Status);

using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IReservaRepository : IRepository<Reserva>
{
    Task<IEnumerable<Reserva>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
}

using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IMoradorRepository : IRepository<Morador>
{
    Task<IEnumerable<Morador>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
    Task<Morador?> GetByNumeroAsync(string numero, Guid usuarioId, CancellationToken cancellationToken = default);
}

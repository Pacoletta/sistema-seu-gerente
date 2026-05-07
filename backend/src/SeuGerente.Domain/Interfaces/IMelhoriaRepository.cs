using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IMelhoriaRepository : IRepository<Melhoria>
{
    Task<IEnumerable<Melhoria>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
}

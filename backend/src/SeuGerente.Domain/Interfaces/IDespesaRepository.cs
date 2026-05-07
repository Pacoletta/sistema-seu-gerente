using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IDespesaRepository : IRepository<Despesa>
{
    Task<IEnumerable<Despesa>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Despesa>> GetByMesAnoAsync(string mesAno, Guid usuarioId, CancellationToken cancellationToken = default);
}

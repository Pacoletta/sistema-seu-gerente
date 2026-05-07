using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IReceitaRepository : IRepository<Receita>
{
    Task<IEnumerable<Receita>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
}

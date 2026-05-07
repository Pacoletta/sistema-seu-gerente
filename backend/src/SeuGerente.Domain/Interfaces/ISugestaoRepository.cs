using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface ISugestaoRepository : IRepository<Sugestao>
{
    Task<IEnumerable<Sugestao>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
}

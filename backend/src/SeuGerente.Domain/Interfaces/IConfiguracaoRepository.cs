using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IConfiguracaoRepository : IRepository<Configuracao>
{
    Task<Configuracao?> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
}

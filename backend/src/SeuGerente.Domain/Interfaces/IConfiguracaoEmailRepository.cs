using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IConfiguracaoEmailRepository : IRepository<ConfiguracaoEmail>
{
    Task<ConfiguracaoEmail?> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
}

using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IAdministrativoRepository : IRepository<Administrativo>
{
    Task<Administrativo?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> IsAdminAsync(string email, CancellationToken cancellationToken = default);
}

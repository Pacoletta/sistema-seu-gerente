using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class AdministrativoRepository : Repository<Administrativo>, IAdministrativoRepository
{
    public AdministrativoRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Administrativo?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    public async Task<bool> IsAdminAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .AnyAsync(a => a.Email.ToLower() == email.ToLower() && a.Ativo, cancellationToken);
    }

    public override async Task UpdateAsync(Administrativo administrativo, CancellationToken cancellationToken = default)
    {
        administrativo.UpdatedAt = DateTime.UtcNow;
        await base.UpdateAsync(administrativo, cancellationToken);
    }
}

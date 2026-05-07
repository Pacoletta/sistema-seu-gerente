using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class ConfiguracaoEmailRepository : Repository<ConfiguracaoEmail>, IConfiguracaoEmailRepository
{
    public ConfiguracaoEmailRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ConfiguracaoEmail?> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId, cancellationToken);
    }
}

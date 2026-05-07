using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class MelhoriaRepository : Repository<Melhoria>, IMelhoriaRepository
{
    public MelhoriaRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Melhoria>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(m => m.UsuarioId == usuarioId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}

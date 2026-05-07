using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class ReceitaRepository : Repository<Receita>, IReceitaRepository
{
    public ReceitaRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Receita>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(r => r.UsuarioId == usuarioId)
            .OrderByDescending(r => r.Data)
            .ToListAsync(cancellationToken);
    }
}

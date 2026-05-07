using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class SugestaoRepository : Repository<Sugestao>, ISugestaoRepository
{
    public SugestaoRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Sugestao>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(s => s.UsuarioId == usuarioId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}

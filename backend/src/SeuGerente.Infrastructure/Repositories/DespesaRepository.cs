using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class DespesaRepository : Repository<Despesa>, IDespesaRepository
{
    public DespesaRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Despesa>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(d => d.UsuarioId == usuarioId)
            .OrderByDescending(d => d.Data)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Despesa>> GetByMesAnoAsync(string mesAno, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        // mesAno no formato "YYYY-MM"
        var year = int.Parse(mesAno.Split('-')[0]);
        var month = int.Parse(mesAno.Split('-')[1]);
        
        return await _dbSet
            .AsNoTracking()
            .Where(d => d.UsuarioId == usuarioId && 
                       d.Data.Year == year && 
                       d.Data.Month == month)
            .OrderBy(d => d.Data)
            .ToListAsync(cancellationToken);
    }
}

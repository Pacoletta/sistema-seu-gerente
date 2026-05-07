using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Enums;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;


public class PagamentoRepository : Repository<Pagamento>, IPagamentoRepository
{
    public PagamentoRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Pagamento>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .ToListAsync(cancellationToken);
    }

    public override async Task<Pagamento?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Pagamento>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .Where(p => p.UsuarioId == usuarioId)
            .OrderByDescending(p => p.DataVencimento)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Pagamento>> GetByMesAnoAsync(string mesAno, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .Where(p => p.MesAno == mesAno && p.UsuarioId == usuarioId)
            .OrderBy(p => p.Morador!.Numero)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Pagamento>> GetByMoradorIdAsync(Guid moradorId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .Where(p => p.MoradorId == moradorId)
            .OrderByDescending(p => p.DataVencimento)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Pagamento>> GetByStatusAsync(StatusPagamento status, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var statusString = status.ToString().ToLower();
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .Where(p => p.Status == statusString && p.UsuarioId == usuarioId)
            .OrderByDescending(p => p.DataVencimento)
            .ToListAsync(cancellationToken);
    }

    public async Task<Pagamento?> GetByMoradorMesAnoAsync(Guid moradorId, string mesAno, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Morador)
            .FirstOrDefaultAsync(p => p.MoradorId == moradorId && p.MesAno == mesAno, cancellationToken);
    }
}

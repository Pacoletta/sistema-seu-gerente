using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class MoradorRepository : Repository<Morador>, IMoradorRepository
{
    private readonly ILogger<MoradorRepository> _logger;

    public MoradorRepository(ApplicationDbContext context, ILogger<MoradorRepository> logger) : base(context)
    {
        _logger = logger;
    }

    public async Task<IEnumerable<Morador>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default)
    {
        var result = await _dbSet
            .AsNoTracking()
            .Where(m => m.UsuarioId == usuarioId)
            .OrderBy(m => m.Numero)
            .ToListAsync(cancellationToken);

        _logger.LogDebug("MoradorRepository: {Count} moradores encontrados para usuário {UsuarioId}", result.Count, usuarioId);

        return result;
    }

    public async Task<Morador?> GetByNumeroAsync(string numero, Guid usuarioId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Numero == numero && m.UsuarioId == usuarioId, cancellationToken);
    }
}

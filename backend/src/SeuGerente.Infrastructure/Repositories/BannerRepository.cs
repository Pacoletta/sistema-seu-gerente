using Microsoft.EntityFrameworkCore;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Interfaces;
using SeuGerente.Infrastructure.Persistence;

namespace SeuGerente.Infrastructure.Repositories;

public class BannerRepository : IBannerRepository
{
    private readonly ApplicationDbContext _context;

    public BannerRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<Banner>> GetAllAtivosAsync(CancellationToken cancellationToken)
        => await _context.Banners
            .Where(b => b.Ativo)
            .OrderBy(b => b.Ordem)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<IEnumerable<Banner>> GetAllAsync(CancellationToken cancellationToken)
        => await _context.Banners
            .OrderBy(b => b.Ordem)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<Banner?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _context.Banners.FindAsync(new object[] { id }, cancellationToken);

    public async Task<Banner> CreateAsync(Banner banner, CancellationToken cancellationToken)
    {
        _context.Banners.Add(banner);
        await _context.SaveChangesAsync(cancellationToken);
        return banner;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var banner = await _context.Banners.FindAsync(new object[] { id }, cancellationToken);
        if (banner != null)
        {
            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<int> GetMaxOrdemAsync(CancellationToken cancellationToken)
    {
        if (!await _context.Banners.AnyAsync(cancellationToken)) return 0;
        return await _context.Banners.MaxAsync(b => b.Ordem, cancellationToken);
    }
}

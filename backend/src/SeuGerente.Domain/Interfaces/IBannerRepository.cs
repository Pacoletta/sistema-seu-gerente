using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface IBannerRepository
{
    Task<IEnumerable<Banner>> GetAllAtivosAsync(CancellationToken cancellationToken);
    Task<IEnumerable<Banner>> GetAllAsync(CancellationToken cancellationToken);
    Task<Banner?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Banner> CreateAsync(Banner banner, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<int> GetMaxOrdemAsync(CancellationToken cancellationToken);
}

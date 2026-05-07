using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Enums;

namespace SeuGerente.Domain.Interfaces;

public interface IPagamentoRepository : IRepository<Pagamento>
{
    Task<IEnumerable<Pagamento>> GetByUsuarioIdAsync(Guid usuarioId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Pagamento>> GetByMesAnoAsync(string mesAno, Guid usuarioId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Pagamento>> GetByMoradorIdAsync(Guid moradorId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Pagamento>> GetByStatusAsync(StatusPagamento status, Guid usuarioId, CancellationToken cancellationToken = default);
    Task<Pagamento?> GetByMoradorMesAnoAsync(Guid moradorId, string mesAno, CancellationToken cancellationToken = default);
}

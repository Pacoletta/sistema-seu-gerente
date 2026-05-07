using SeuGerente.Domain.Entities;

namespace SeuGerente.Domain.Interfaces;

public interface ICadastroRepository : IRepository<Cadastro>
{
    new Task<Cadastro?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Cadastro?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
}

namespace SeuGerente.Domain.Entities;

public class Assinatura
{
    public Guid Id { get; set; }
    public Guid CadastroId { get; set; }
    public string Plano { get; set; } = "basico";
    public decimal Valor { get; set; }
    public string Status { get; set; } = "ativa";
    public DateTime DataInicio { get; set; }
    public DateTime? DataVencimento { get; set; }
    public DateTime? DataCancelamento { get; set; }
    public string? MotivosCancelamento { get; set; }
    public string FormaPagamento { get; set; } = "credit_card";
    public decimal? ValorPago { get; set; } = 0;
    public string? StatusPagamento { get; set; } = "pendente";
    public DateOnly? DataPagamento { get; set; }
    public int? DiasAtraso { get; set; } = 0;
    public DateTime? UltimaNotificacaoAtraso { get; set; }
    public string? ClienteNome { get; set; }
    public string? ClienteEmail { get; set; }
    public string? ClienteWhatsapp { get; set; }
    public string? NomeCondominio { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual Cadastro? Cadastro { get; set; }
}

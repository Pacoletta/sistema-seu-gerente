namespace SeuGerente.Application.Interfaces;

/// <summary>
/// Serviço para geração de documentos PDF
/// </summary>
public interface IPdfService
{
    /// <summary>
    /// Gera PDF de cobrança com informações de pagamento
    /// </summary>
    /// <param name="nomeCliente">Nome do morador/cliente</param>
    /// <param name="apartamento">Número do apartamento</param>
    /// <param name="valorTotal">Valor total da cobrança</param>
    /// <param name="mesReferencia">Mês de referência (exemplo: "2026-02")</param>
    /// <param name="dataVencimento">Data de vencimento</param>
    /// <param name="chavePix">Chave PIX para pagamento (opcional)</param>
    /// <param name="pixNomeBeneficiario">Nome do beneficiário do PIX (opcional)</param>
    /// <returns>PDF em bytes</returns>
    byte[] GerarPdfCobranca(
        string nomeCliente,
        string apartamento,
        decimal valorTotal,
        string mesReferencia,
        DateTime dataVencimento,
        string? chavePix = null,
        string? pixNomeBeneficiario = null);

    /// <summary>
    /// Gera PDF de relatório completo com todos os apartamentos e despesas
    /// </summary>
    /// <param name="apartamentos">Lista de apartamentos com valores</param>
    /// <param name="despesas">Lista de despesas do mês</param>
    /// <param name="totalDespesas">Total das despesas (sem caixinha)</param>
    /// <param name="totalCaixinha">Total da caixinha</param>
    /// <param name="totalGeral">Total geral (despesas + caixinha)</param>
    /// <param name="mesReferencia">Mês de referência</param>
    /// <param name="anoReferencia">Ano de referência</param>
    /// <param name="dataVencimento">Data de vencimento</param>
    /// <param name="chavePix">Chave PIX para pagamento (opcional)</param>
    /// <param name="pixNomeBeneficiario">Nome do beneficiário do PIX (opcional)</param>
    /// <returns>PDF em bytes</returns>
    byte[] GerarRelatorioCompleto(
        List<ApartamentoRelatorio> apartamentos,
        List<DespesaRelatorio> despesas,
        decimal totalDespesas,
        decimal totalCaixinha,
        decimal totalGeral,
        string mesReferencia,
        int anoReferencia,
        DateTime? dataVencimento = null,
        string? chavePix = null,
        string? pixNomeBeneficiario = null);
}

public class ApartamentoRelatorio
{
    public string Numero { get; set; } = string.Empty;
    public decimal Devido { get; set; }
    public decimal Caixinha { get; set; }
    public decimal Total { get; set; }
}

public class DespesaRelatorio
{
    public DateTime Data { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string? ComprovanteUrl { get; set; }
}


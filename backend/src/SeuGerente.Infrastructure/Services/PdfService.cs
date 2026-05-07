using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SeuGerente.Application.Interfaces;

namespace SeuGerente.Infrastructure.Services;

/// <summary>
/// Serviço de geração de PDFs usando QuestPDF
/// </summary>
public class PdfService : IPdfService
{
    static PdfService()
    {
        // Configuração de licença do QuestPDF (Community License)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GerarPdfCobranca(
        string nomeCliente,
        string apartamento,
        decimal valorTotal,
        string mesReferencia,
        DateTime dataVencimento,
        string? chavePix = null,
        string? pixNomeBeneficiario = null)
    {
        var documento = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Element(ComposeHeader);

                page.Content().Element(content => ComposeContent(
                    content,
                    nomeCliente,
                    apartamento,
                    valorTotal,
                    mesReferencia,
                    dataVencimento,
                    chavePix,
                    pixNomeBeneficiario));

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Documento gerado automaticamente em ");
                    text.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm")).SemiBold();
                    text.Span(" - Sistema Seu Gerente");
                });
            });
        });

        return documento.GeneratePdf();
    }

    public byte[] GerarRelatorioCompleto(
        List<ApartamentoRelatorio> apartamentos,
        List<DespesaRelatorio> despesas,
        decimal totalDespesas,
        decimal totalCaixinha,
        decimal totalGeral,
        string mesReferencia,
        int anoReferencia,
        DateTime? dataVencimento = null,
        string? chavePix = null,
        string? pixNomeBeneficiario = null)
    {
        var documento = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(c => ComposeRelatorioHeader(c, mesReferencia, anoReferencia));

                page.Content().Element(content => ComposeRelatorioContent(
                    content,
                    apartamentos,
                    despesas,
                    totalDespesas,
                    totalCaixinha,
                    totalGeral,
                    mesReferencia,
                    dataVencimento,
                    chavePix,
                    pixNomeBeneficiario));

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Relatório gerado em ");
                    text.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm")).SemiBold();
                    text.Span(" - Sistema Seu Gerente");
                });
            });
        });

        return documento.GeneratePdf();
    }

    private void ComposeRelatorioHeader(IContainer container, string mesReferencia, int anoReferencia)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("SISTEMA SEU GERENTE")
                    .FontSize(20)
                    .SemiBold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().Text("Gestão de Condomínio")
                    .FontSize(10)
                    .FontColor(Colors.Grey.Medium);
            });

            row.ConstantItem(150).AlignRight().Column(col =>
            {
                col.Item().AlignRight().Text("RELATÓRIO MENSAL").FontSize(14).Bold().FontColor(Colors.Blue.Darken2);
                col.Item().AlignRight().Text($"{FormatarNomeMes(mesReferencia)}/{anoReferencia}").FontSize(12).FontColor(Colors.Grey.Darken1);
            });
        });
    }

    private void ComposeRelatorioContent(
        IContainer container,
        List<ApartamentoRelatorio> apartamentos,
        List<DespesaRelatorio> despesas,
        decimal totalDespesas,
        decimal totalCaixinha,
        decimal totalGeral,
        string mesReferencia,
        DateTime? dataVencimento,
        string? chavePix,
        string? pixNomeBeneficiario)
    {
        container.PaddingVertical(10).Column(column =>
        {
            column.Spacing(12);

            // Resumo Geral
            column.Item().Container()
                .Border(2)
                .BorderColor(Colors.Blue.Medium)
                .Background(Colors.Blue.Lighten4)
                .Padding(15)
                .Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Total de Despesas").FontSize(10).FontColor(Colors.Grey.Darken2);
                            c.Item().Text($"R$ {totalDespesas:N2}").FontSize(14).Bold().FontColor(Colors.Blue.Darken3);
                        });
                        
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Total Caixinha").FontSize(10).FontColor(Colors.Grey.Darken2);
                            c.Item().Text($"R$ {totalCaixinha:N2}").FontSize(14).Bold().FontColor(Colors.Green.Darken2);
                        });
                        
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("TOTAL GERAL").FontSize(10).FontColor(Colors.Grey.Darken2);
                            c.Item().Text($"R$ {totalGeral:N2}").FontSize(16).Bold().FontColor(Colors.Orange.Darken2);
                        });
                    });

                    if (dataVencimento.HasValue)
                    {
                        col.Item().PaddingTop(8).Row(row =>
                        {
                            row.RelativeItem().Text("");
                            row.ConstantItem(150).AlignRight().Column(c =>
                            {
                                c.Item().AlignRight().Text("Vencimento").FontSize(9).FontColor(Colors.Grey.Darken1);
                                c.Item().AlignRight().Text(dataVencimento.Value.ToString("dd/MM/yyyy"))
                                    .FontSize(12).Bold().FontColor(Colors.Red.Medium);
                            });
                        });
                    }
                });

            // Tabela de Despesas
            column.Item().Element(c => ComposeSecao(c, "DESPESAS DO MÊS"));
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(70);  // Data
                    columns.RelativeColumn(3);   // Descrição
                    columns.RelativeColumn(1);   // Categoria
                    columns.ConstantColumn(80);  // Valor
                });

                // Header
                table.Header(header =>
                {
                    header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Data").FontSize(9).Bold();
                    header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Descrição").FontSize(9).Bold();
                    header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Categoria").FontSize(9).Bold();
                    header.Cell().Background(Colors.Grey.Lighten2).Padding(5).AlignRight().Text("Valor").FontSize(9).Bold();
                });

                // Linhas
                foreach (var despesa in despesas.OrderBy(d => d.Data))
                {
                    table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                        .Text(despesa.Data.ToString("dd/MM")).FontSize(9);
                    table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                        .Text(despesa.Descricao).FontSize(9);
                    table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                        .Text(despesa.Categoria).FontSize(8);
                    table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                        .AlignRight().Text($"R$ {despesa.Valor:N2}").FontSize(9);
                }
            });

            // Tabela de Apartamentos
            column.Item().PaddingTop(10).Element(c => ComposeSecao(c, "VALORES POR APARTAMENTO"));
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(1);   // Apto
                    columns.RelativeColumn(1);   // Devido
                    columns.RelativeColumn(1);   // Caixinha
                    columns.RelativeColumn(1);   // Total
                });

                // Header
                table.Header(header =>
                {
                    header.Cell().Background(Colors.Green.Lighten2).Padding(5).Text("Apto").FontSize(9).Bold();
                    header.Cell().Background(Colors.Green.Lighten2).Padding(5).AlignRight().Text("Devido").FontSize(9).Bold();
                    header.Cell().Background(Colors.Green.Lighten2).Padding(5).AlignRight().Text("Caixinha").FontSize(9).Bold();
                    header.Cell().Background(Colors.Green.Lighten2).Padding(5).AlignRight().Text("Total").FontSize(9).Bold();
                });

                // Linhas
                foreach (var apt in apartamentos.OrderBy(a => a.Numero))
                {
                    if (apt.Total > 0) // Só mostra apartamentos com valores
                    {
                        table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                            .Text(apt.Numero).FontSize(9);
                        table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                            .AlignRight().Text($"R$ {apt.Devido:N2}").FontSize(9);
                        table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                            .AlignRight().Text($"R$ {apt.Caixinha:N2}").FontSize(9);
                        table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(4)
                            .AlignRight().Text($"R$ {apt.Total:N2}").FontSize(9).Bold();
                    }
                }
            });

            // Informações de Pagamento (PIX)
            if (!string.IsNullOrWhiteSpace(chavePix))
            {
                column.Item().PaddingTop(10).Element(c => ComposeSecao(c, "INFORMAÇÕES DE PAGAMENTO"));
                column.Item().Container()
                    .Border(1)
                    .BorderColor(Colors.Blue.Medium)
                    .Background(Colors.Blue.Lighten4)
                    .Padding(12)
                    .Column(col =>
                    {
                        col.Item().Text("Chave PIX:").FontSize(9).FontColor(Colors.Grey.Darken1);
                        col.Item().Text(chavePix)
                            .FontSize(12)
                            .SemiBold()
                            .FontColor(Colors.Blue.Darken3)
                            .FontFamily("Courier New");
                        
                        if (!string.IsNullOrWhiteSpace(pixNomeBeneficiario))
                        {
                            col.Item().PaddingTop(8).Text("Beneficiário:").FontSize(9).FontColor(Colors.Grey.Darken1);
                            col.Item().Text(pixNomeBeneficiario)
                                .FontSize(11)
                                .SemiBold()
                                .FontColor(Colors.Blue.Darken2);
                        }
                    });
            }

            // Seção de Comprovantes (URLs)
            var despesasComComprovante = despesas.Where(d => !string.IsNullOrWhiteSpace(d.ComprovanteUrl)).ToList();
            if (despesasComComprovante.Any())
            {
                column.Item().PaddingTop(10).Element(c => ComposeSecao(c, "COMPROVANTES"));
                
                foreach (var despesa in despesasComComprovante)
                {
                    column.Item().PaddingTop(5).Column(col =>
                    {
                        col.Item().Text($"• {despesa.Descricao}:").FontSize(9).Bold();
                        col.Item().PaddingLeft(10).Text(despesa.ComprovanteUrl!)
                            .FontSize(8)
                            .FontColor(Colors.Blue.Medium)
                            .Underline();
                    });
                }
            }
        });
    }

    private string FormatarNomeMes(string mesNumero)
    {
        var meses = new[] { "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                           "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" };
        
        if (int.TryParse(mesNumero, out var mes) && mes >= 1 && mes <= 12)
        {
            return meses[mes - 1];
        }
        
        return mesNumero;
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("SISTEMA SEU GERENTE")
                    .FontSize(20)
                    .SemiBold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().Text("Gestão de Condomínio")
                    .FontSize(10)
                    .FontColor(Colors.Grey.Medium);
            });

            row.ConstantItem(100).AlignRight().Text(text =>
            {
                text.Span("COBRANÇA").FontSize(16).Bold().FontColor(Colors.Orange.Darken2);
            });
        });
    }

    private void ComposeContent(
        IContainer container,
        string nomeCliente,
        string apartamento,
        decimal valorTotal,
        string mesReferencia,
        DateTime dataVencimento,
        string? chavePix,
        string? pixNomeBeneficiario)
    {
        container.PaddingVertical(10).Column(column =>
        {
            column.Spacing(15);

            // Informações do Cliente
            column.Item().Element(c => ComposeSecao(c, "DADOS DO MORADOR"));
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Nome:").FontSize(9).FontColor(Colors.Grey.Darken1);
                    col.Item().Text(nomeCliente).FontSize(12).SemiBold();
                });
                row.ConstantItem(150).Column(col =>
                {
                    col.Item().Text("Apartamento:").FontSize(9).FontColor(Colors.Grey.Darken1);
                    col.Item().Text(apartamento).FontSize(12).SemiBold();
                });
            });

            // Informações de Pagamento
            column.Item().PaddingTop(10).Element(c => ComposeSecao(c, "DETALHES DO PAGAMENTO"));
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Mês de Referência:").FontSize(9).FontColor(Colors.Grey.Darken1);
                    col.Item().Text(FormatarMesReferencia(mesReferencia)).FontSize(12);
                });
                row.ConstantItem(150).Column(col =>
                {
                    col.Item().Text("Data de Vencimento:").FontSize(9).FontColor(Colors.Grey.Darken1);
                    col.Item().Text(dataVencimento.ToString("dd/MM/yyyy")).FontSize(12).FontColor(Colors.Red.Medium).SemiBold();
                });
            });

            // Valor Total
            column.Item().PaddingTop(20).AlignCenter().Container()
                .Border(2)
                .BorderColor(Colors.Green.Darken2)
                .Background(Colors.Green.Lighten4)
                .Padding(20)
                .Column(col =>
                {
                    col.Item().AlignCenter().Text("VALOR TOTAL").FontSize(11).FontColor(Colors.Grey.Darken2);
                    col.Item().AlignCenter().Text($"R$ {valorTotal:N2}")
                        .FontSize(32)
                        .Bold()
                        .FontColor(Colors.Green.Darken3);
                });

            // Informações PIX (se disponível)
            if (!string.IsNullOrWhiteSpace(chavePix))
            {
                column.Item().PaddingTop(15).Element(c => ComposeSecao(c, "PAGAMENTO VIA PIX"));
                column.Item().Container()
                    .Border(1)
                    .BorderColor(Colors.Blue.Medium)
                    .Background(Colors.Blue.Lighten4)
                    .Padding(15)
                    .Column(col =>
                    {
                        col.Item().Text("Chave PIX:").FontSize(10).FontColor(Colors.Grey.Darken1);
                        col.Item().Text(chavePix)
                            .FontSize(14)
                            .SemiBold()
                            .FontColor(Colors.Blue.Darken3)
                            .FontFamily("Courier New");
                        
                        if (!string.IsNullOrWhiteSpace(pixNomeBeneficiario))
                        {
                            col.Item().PaddingTop(10).Text("Beneficiário:").FontSize(10).FontColor(Colors.Grey.Darken1);
                            col.Item().Text(pixNomeBeneficiario)
                                .FontSize(13)
                                .SemiBold()
                                .FontColor(Colors.Blue.Darken2);
                        }

                        col.Item().PaddingTop(10).Text("💡 Copie a chave PIX acima e realize o pagamento no aplicativo do seu banco.")
                            .FontSize(9)
                            .Italic()
                            .FontColor(Colors.Grey.Darken1);
                    });
            }

            // Aviso de Vencimento
            if (dataVencimento < DateTime.Now.Date)
            {
                column.Item().PaddingTop(15).Container()
                    .Border(2)
                    .BorderColor(Colors.Red.Medium)
                    .Background(Colors.Red.Lighten4)
                    .Padding(10)
                    .AlignCenter()
                    .Text("⚠️ ATENÇÃO: Esta cobrança está VENCIDA!")
                    .FontSize(12)
                    .Bold()
                    .FontColor(Colors.Red.Darken2);
            }
            else
            {
                var diasFaltando = (dataVencimento.Date - DateTime.Now.Date).Days;
                if (diasFaltando <= 5)
                {
                    column.Item().PaddingTop(15).Container()
                        .Border(1)
                        .BorderColor(Colors.Orange.Medium)
                        .Background(Colors.Orange.Lighten4)
                        .Padding(10)
                        .AlignCenter()
                        .Text($"⏰ Faltam {diasFaltando} dia(s) para o vencimento!")
                        .FontSize(11)
                        .SemiBold()
                        .FontColor(Colors.Orange.Darken2);
                }
            }

            // Instruções
            column.Item().PaddingTop(20).Column(col =>
            {
                col.Item().Text("INSTRUÇÕES:").FontSize(10).Bold().FontColor(Colors.Grey.Darken2);
                col.Item().PaddingTop(5).Text("• Efetue o pagamento até a data de vencimento para evitar multas.")
                    .FontSize(9);
                col.Item().Text("• Em caso de dúvidas, entre em contato com a administração.")
                    .FontSize(9);
                col.Item().Text("• Guarde este comprovante para referência futura.")
                    .FontSize(9);
            });
        });
    }

    private void ComposeSecao(IContainer container, string titulo)
    {
        container
            .BorderBottom(1)
            .BorderColor(Colors.Grey.Medium)
            .PaddingBottom(5)
            .Text(titulo)
            .FontSize(11)
            .Bold()
            .FontColor(Colors.Blue.Darken2);
    }

    private string FormatarMesReferencia(string mesReferencia)
    {
        try
        {
            if (DateTime.TryParse(mesReferencia + "-01", out var data))
            {
                return data.ToString("MMMM/yyyy").ToUpper();
            }
            return mesReferencia;
        }
        catch
        {
            return mesReferencia;
        }
    }
}

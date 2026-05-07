using FluentAssertions;
using SeuGerente.Domain.Entities;
using SeuGerente.Domain.Enums;
using Xunit;

namespace SeuGerente.UnitTests.Domain;

public class PagamentoTests
{
    [Fact]
    public void Pagamento_MarcarComoPago_DeveAtualizarStatus()
    {
        // Arrange
        var pagamento = new Pagamento
        {
            Status = StatusPagamento.Pendente,
            Valor = 500m
        };

        // Act
        pagamento.MarcarComoPago();

        // Assert
        pagamento.Status.Should().Be(StatusPagamento.Pago);
        pagamento.DataPagamento.Should().NotBeNull();
    }

    [Fact]
    public void Pagamento_MarcarComoPago_ComComprovante_DeveSalvarUrl()
    {
        // Arrange
        var pagamento = new Pagamento { Status = StatusPagamento.Pendente };
        var urlComprovante = "https://storage.com/comprovante.pdf";

        // Act
        pagamento.MarcarComoPago(urlComprovante);

        // Assert
        pagamento.UrlComprovante.Should().Be(urlComprovante);
    }

    [Fact]
    public void Pagamento_EstaPago_DeveRetornarTrue_QuandoStatusPago()
    {
        // Arrange
        var pagamento = new Pagamento { Status = StatusPagamento.Pago };

        // Act & Assert
        pagamento.EstaPago().Should().BeTrue();
    }

    [Fact]
    public void Pagamento_GetValorTotal_DeveSomarValorECaixinha()
    {
        // Arrange
        var pagamento = new Pagamento
        {
            Valor = 500m,
            Caixinha = 50m
        };

        // Act
        var total = pagamento.GetValorTotal();

        // Assert
        total.Should().Be(550m);
    }
}

using FluentAssertions;
using SeuGerente.Domain.Entities;
using Xunit;

namespace SeuGerente.UnitTests.Domain;

public class MoradorTests
{
    [Fact]
    public void Morador_PossuiWhatsApp_DeveRetornarTrue_QuandoTemWhatsApp()
    {
        // Arrange
        var morador = new Morador
        {
            Nome = "João Silva",
            Numero = 101,
            WhatsApp = "11999999999"
        };

        // Act & Assert
        morador.PossuiWhatsApp().Should().BeTrue();
    }

    [Fact]
    public void Morador_PossuiWhatsApp_DeveRetornarFalse_QuandoNaoTemWhatsApp()
    {
        // Arrange
        var morador = new Morador
        {
            Nome = "João Silva",
            Numero = 101,
            WhatsApp = null
        };

        // Act & Assert
        morador.PossuiWhatsApp().Should().BeFalse();
    }

    [Fact]
    public void Morador_PossuiEmail_DeveRetornarTrue_QuandoTemEmail()
    {
        // Arrange
        var morador = new Morador
        {
            Nome = "João Silva",
            Numero = 101,
            Email = "joao@example.com"
        };

        // Act & Assert
        morador.PossuiEmail().Should().BeTrue();
    }
}

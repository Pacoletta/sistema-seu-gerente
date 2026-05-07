using FluentValidation;
using SeuGerente.Application.DTOs;

namespace SeuGerente.Application.Validators;

public class CreatePagamentoValidator : AbstractValidator<CreatePagamentoDTO>
{
    public CreatePagamentoValidator()
    {
        RuleFor(x => x.MoradorId)
            .NotEmpty()
            .WithMessage("MoradorId é obrigatório");

        RuleFor(x => x.MesAno)
            .NotEmpty()
            .WithMessage("MesAno é obrigatório")
            .Matches(@"^\d{4}-\d{2}$")
            .WithMessage("MesAno deve estar no formato YYYY-MM");

        RuleFor(x => x.Valor)
            .GreaterThan(0)
            .WithMessage("Valor deve ser maior que zero");

        RuleFor(x => x.DataVencimento)
            .NotEmpty()
            .WithMessage("Data de vencimento é obrigatória");

        RuleFor(x => x.Caixinha)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Caixinha.HasValue)
            .WithMessage("Caixinha deve ser maior ou igual a zero");
    }
}

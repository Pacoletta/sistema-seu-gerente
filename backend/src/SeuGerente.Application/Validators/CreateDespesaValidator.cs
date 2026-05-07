using FluentValidation;
using SeuGerente.Application.DTOs;

namespace SeuGerente.Application.Validators;

public class CreateDespesaValidator : AbstractValidator<CreateDespesaDTO>
{
    public CreateDespesaValidator()
    {
        RuleFor(x => x.Data)
            .NotEmpty()
            .WithMessage("Data é obrigatória");

        RuleFor(x => x.Descricao)
            .NotEmpty()
            .WithMessage("Descrição é obrigatória")
            .MaximumLength(500)
            .WithMessage("Descrição deve ter no máximo 500 caracteres");

        RuleFor(x => x.Categoria)
            .NotEmpty()
            .WithMessage("Categoria é obrigatória")
            .MaximumLength(100)
            .WithMessage("Categoria deve ter no máximo 100 caracteres");

        RuleFor(x => x.Valor)
            .GreaterThan(0)
            .WithMessage("Valor deve ser maior que zero");
    }
}

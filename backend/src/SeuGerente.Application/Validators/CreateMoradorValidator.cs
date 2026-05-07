using FluentValidation;
using SeuGerente.Application.DTOs;

namespace SeuGerente.Application.Validators;

public class CreateMoradorValidator : AbstractValidator<CreateMoradorDTO>
{
    public CreateMoradorValidator()
    {
        RuleFor(x => x.Numero)
            .NotEmpty()
            .WithMessage("Número do apartamento é obrigatório");

        RuleFor(x => x.Nome)
            .NotEmpty()
            .WithMessage("Nome é obrigatório")
            .MaximumLength(200)
            .WithMessage("Nome deve ter no máximo 200 caracteres");

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("Email inválido");

        RuleFor(x => x.Telefone)
            .MaximumLength(20)
            .When(x => !string.IsNullOrWhiteSpace(x.Telefone))
            .WithMessage("Telefone deve ter no máximo 20 caracteres");

        RuleFor(x => x.WhatsApp)
            .MaximumLength(20)
            .When(x => !string.IsNullOrWhiteSpace(x.WhatsApp))
            .WithMessage("WhatsApp deve ter no máximo 20 caracteres");
    }
}

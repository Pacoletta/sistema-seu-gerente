using AutoMapper;
using SeuGerente.Application.DTOs;
using SeuGerente.Domain.Entities;

namespace SeuGerente.Application.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Morador
        CreateMap<Morador, MoradorDTO>();
        CreateMap<CreateMoradorDTO, Morador>();
        CreateMap<UpdateMoradorDTO, Morador>();

        // Despesa
        CreateMap<Despesa, DespesaDTO>();
        CreateMap<CreateDespesaDTO, Despesa>();
        CreateMap<UpdateDespesaDTO, Despesa>();

        // Pagamento
        CreateMap<Pagamento, PagamentoDTO>();
        CreateMap<CreatePagamentoDTO, Pagamento>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "pendente"));

        // Configuracao
        CreateMap<Configuracao, ConfiguracaoDTO>()
            .ForMember(dest => dest.HoraEnvioRelatorio, opt => opt.MapFrom(src => 
                src.HoraEnvioRelatorio.HasValue ? src.HoraEnvioRelatorio.Value.ToString(@"hh\:mm") : null))
            .ForMember(dest => dest.HoraEnvioCobranca, opt => opt.MapFrom(src => 
                src.HoraEnvioCobranca.HasValue ? src.HoraEnvioCobranca.Value.ToString(@"hh\:mm") : null));
        
        CreateMap<UpdateConfiguracaoDTO, Configuracao>()
            .ForMember(dest => dest.HoraEnvioRelatorio, opt => opt.MapFrom(src => 
                !string.IsNullOrEmpty(src.HoraEnvioRelatorio) ? TimeSpan.Parse(src.HoraEnvioRelatorio) : (TimeSpan?)null))
            .ForMember(dest => dest.HoraEnvioCobranca, opt => opt.MapFrom(src => 
                !string.IsNullOrEmpty(src.HoraEnvioCobranca) ? TimeSpan.Parse(src.HoraEnvioCobranca) : (TimeSpan?)null));

        // Receita
        CreateMap<Receita, ReceitaDTO>();
        CreateMap<CreateReceitaDTO, Receita>();
        CreateMap<UpdateReceitaDTO, Receita>();

        // Melhoria
        CreateMap<Melhoria, MelhoriaDTO>();
        CreateMap<CreateMelhoriaDTO, Melhoria>();
        CreateMap<UpdateMelhoriaDTO, Melhoria>();

        // Sugestao
        CreateMap<Sugestao, SugestaoDTO>();
        CreateMap<CreateSugestaoDTO, Sugestao>();
        CreateMap<UpdateSugestaoDTO, Sugestao>();

        // ConfiguracaoEmail
        CreateMap<ConfiguracaoEmail, ConfiguracaoEmailDTO>();

        // Cadastro
        CreateMap<Cadastro, CadastroDTO>();
    }
}

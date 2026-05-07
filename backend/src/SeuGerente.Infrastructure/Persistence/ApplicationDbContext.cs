using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SeuGerente.Domain.Entities;

namespace SeuGerente.Infrastructure.Persistence;

/// <summary>
/// Contexto do Entity Framework Core para acesso ao banco Supabase PostgreSQL
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Morador> Moradores => Set<Morador>();
    public DbSet<Despesa> Despesas => Set<Despesa>();
    public DbSet<Pagamento> Pagamentos => Set<Pagamento>();
    public DbSet<Configuracao> Configuracoes => Set<Configuracao>();
    public DbSet<Receita> Receitas => Set<Receita>();
    public DbSet<Melhoria> Melhorias => Set<Melhoria>();
    public DbSet<Sugestao> Sugestoes => Set<Sugestao>();
    public DbSet<ConfiguracaoEmail> ConfiguracoesEmail => Set<ConfiguracaoEmail>();
    public DbSet<Cadastro> Cadastros => Set<Cadastro>();
    public DbSet<Administrativo> Administrativos => Set<Administrativo>();
    public DbSet<ConfiguracaoSistema> ConfiguracoesSistema => Set<ConfiguracaoSistema>();
    public DbSet<LogSistema> LogsSistema => Set<LogSistema>();
    public DbSet<Assinatura> Assinaturas => Set<Assinatura>();
    public DbSet<DespesaSistema> DespesasSistema => Set<DespesaSistema>();
    public DbSet<Reserva> Reservas => Set<Reserva>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<WhatsAppInstancia> WhatsAppInstancias => Set<WhatsAppInstancia>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração de Morador
        modelBuilder.Entity<Morador>(entity =>
        {
            entity.ToTable("moradores");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Numero).HasColumnName("numero").IsRequired();
            entity.Property(e => e.Nome).HasColumnName("nome").IsRequired();
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Telefone).HasColumnName("telefone");
            entity.Property(e => e.Whatsapp).HasColumnName("whatsapp");
            entity.Property(e => e.Tipo).HasColumnName("tipo").IsRequired();
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de Despesa
        modelBuilder.Entity<Despesa>(entity =>
        {
            entity.ToTable("despesas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Data).HasColumnName("data").IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").IsRequired();
            entity.Property(e => e.Categoria).HasColumnName("categoria");
            entity.Property(e => e.Valor).HasColumnName("valor").HasColumnType("numeric").IsRequired();
            
            // Npgsql mapeia decimal[]? automaticamente para numeric[] do PostgreSQL
            entity.Property(e => e.ValoresPorAp).HasColumnName("valoresporap");
            
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.TipoDivisao).HasColumnName("tipo_divisao").IsRequired();
            entity.Property(e => e.ComprovanteUrl).HasColumnName("comprovanteurl");
            entity.Property(e => e.Enviado).HasColumnName("enviado");
            entity.Property(e => e.MelhoriaId).HasColumnName("melhoria_id");
            entity.Property(e => e.MelhoriaTitulo).HasColumnName("melhoria_titulo");
            entity.Property(e => e.Origem).HasColumnName("origem");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de Pagamento
        modelBuilder.Entity<Pagamento>(entity =>
        {
            entity.ToTable("pagamentos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.MoradorId).HasColumnName("morador_id");
            entity.Property(e => e.MoradorNome).HasColumnName("morador_nome");
            entity.Property(e => e.MoradorEmail).HasColumnName("morador_email");
            entity.Property(e => e.MoradorNumero).HasColumnName("morador_numero");
            entity.Property(e => e.Valor).HasColumnName("valor").HasColumnType("numeric").IsRequired();
            entity.Property(e => e.DataVencimento).HasColumnName("data_vencimento").IsRequired();
            entity.Property(e => e.DataPagamento).HasColumnName("data_pagamento");
            entity.Property(e => e.Status).HasColumnName("status").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.MesAno).HasColumnName("mes_ano");
            entity.Property(e => e.UrlComprovante).HasColumnName("url_comprovante");
            entity.Property(e => e.Caixinha).HasColumnName("caixinha").HasColumnType("numeric");

            entity.HasIndex(e => e.MoradorId);
            entity.HasIndex(e => e.UsuarioId);
            entity.HasIndex(e => e.MesAno);

            // Relacionamento com Morador
            entity.HasOne(e => e.Morador)
                  .WithMany(m => m.Pagamentos)
                  .HasForeignKey(e => e.MoradorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuração de Configuracao
        modelBuilder.Entity<Configuracao>(entity =>
        {
            entity.ToTable("configuracao");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.EnvioAutomaticoAtivo).HasColumnName("envio_automatico_ativo");
            entity.Property(e => e.DiaEnvioRelatorio).HasColumnName("dia_envio_relatorio");
            entity.Property(e => e.DiaEnvioCobranca).HasColumnName("dia_envio_cobranca");
            entity.Property(e => e.HoraEnvioRelatorio).HasColumnName("hora_envio_relatorio");
            entity.Property(e => e.HoraEnvioCobranca).HasColumnName("hora_envio_cobranca");
            entity.Property(e => e.MesReferenciaCobranca).HasColumnName("mes_referencia_cobranca");
            entity.Property(e => e.DiaVencimento).HasColumnName("dia_vencimento");
            entity.Property(e => e.PixCobranca).HasColumnName("pix_cobranca");
            entity.Property(e => e.PixNomeBeneficiario).HasColumnName("pix_nome_beneficiario");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");
            entity.Property(e => e.Nome).HasColumnName("nome");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.WhatsApp).HasColumnName("whatsapp");
            entity.Property(e => e.MensagemRelatorio).HasColumnName("mensagem_relatorio");
            entity.Property(e => e.MensagemCobranca).HasColumnName("mensagem_cobranca");

            entity.HasIndex(e => e.UsuarioId).IsUnique();
        });

        // Configuração de Receita
        modelBuilder.Entity<Receita>(entity =>
        {
            entity.ToTable("receitas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Data).HasColumnName("data").IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").IsRequired();
            entity.Property(e => e.Categoria).HasColumnName("categoria");
            entity.Property(e => e.Valor).HasColumnName("valor").HasColumnType("numeric").IsRequired();
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de Melhoria
        modelBuilder.Entity<Melhoria>(entity =>
        {
            entity.ToTable("melhorias");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Titulo).HasColumnName("titulo").IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").IsRequired();
            entity.Property(e => e.Prioridade).HasColumnName("prioridade").IsRequired();
            entity.Property(e => e.Categoria).HasColumnName("categoria").IsRequired();
            entity.Property(e => e.CustoEstimado).HasColumnName("custo_estimado").HasColumnType("numeric");
            entity.Property(e => e.CustoReal).HasColumnName("custo_real").HasColumnType("numeric");
            entity.Property(e => e.DataInicio).HasColumnName("data_inicio");
            entity.Property(e => e.DataFimPrevista).HasColumnName("data_fim_prevista");
            entity.Property(e => e.DataFimReal).HasColumnName("data_fim_real");
            entity.Property(e => e.Responsavel).HasColumnName("responsavel");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.Observacoes).HasColumnName("observacoes");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de Sugestao
        modelBuilder.Entity<Sugestao>(entity =>
        {
            entity.ToTable("sugestoes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Titulo).HasColumnName("titulo").IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").IsRequired();
            entity.Property(e => e.Categoria).HasColumnName("categoria").IsRequired();
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.Observacoes).HasColumnName("observacoes");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de ConfiguracaoEmail
        modelBuilder.Entity<ConfiguracaoEmail>(entity =>
        {
            entity.ToTable("configuracao_email");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.EmailRemetente).HasColumnName("email_remetente");
            entity.Property(e => e.SenhaApp).HasColumnName("senha_app");
            entity.Property(e => e.Ativo).HasColumnName("ativo");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            entity.HasIndex(e => e.UsuarioId).IsUnique();
        });

        // Configuração de Cadastro
        modelBuilder.Entity<Cadastro>(entity =>
        {
            entity.ToTable("cadastro");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.SenhaHash).HasColumnName("senha_hash");
            entity.Property(e => e.Nome).HasColumnName("nome");
            entity.Property(e => e.CnpjCpf).HasColumnName("cnpj_cpf");
            entity.Property(e => e.Whatsapp).HasColumnName("whatsapp");
            entity.Property(e => e.NomeCondominio).HasColumnName("nome_condominio");
            entity.Property(e => e.QuantidadeApartamentos).HasColumnName("quantidade_apartamentos");
            entity.Property(e => e.Status).HasColumnName("status").IsRequired();
            entity.Property(e => e.EmailConfirmado).HasColumnName("email_confirmado");
            entity.Property(e => e.TokenConfirmacaoEmail).HasColumnName("token_confirmacao_email");
            entity.Property(e => e.TokenConfirmacaoExpiraEm).HasColumnName("token_confirmacao_expira_em");
            entity.Property(e => e.TokenResetSenha).HasColumnName("token_reset_senha");
            entity.Property(e => e.TokenResetSenhaExpiraEm).HasColumnName("token_reset_senha_expira_em");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configuração de Administrativo
        modelBuilder.Entity<Administrativo>(entity =>
        {
            entity.ToTable("administrativo");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.Nome).HasColumnName("nome");
            entity.Property(e => e.SenhaHash).HasColumnName("senha_hash");
            entity.Property(e => e.Ativo).HasColumnName("ativo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configuração de ConfiguracaoSistema
        modelBuilder.Entity<ConfiguracaoSistema>(entity =>
        {
            entity.ToTable("configuracao_sistema");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Chave).HasColumnName("chave").IsRequired();
            entity.Property(e => e.Valor).HasColumnName("valor");
            entity.Property(e => e.Descricao).HasColumnName("descricao");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.Chave).IsUnique();
        });

        // Configuração de LogSistema
        modelBuilder.Entity<LogSistema>(entity =>
        {
            entity.ToTable("logs_sistema");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Data).HasColumnName("data").IsRequired();
            entity.Property(e => e.Nivel).HasColumnName("nivel").IsRequired();
            entity.Property(e => e.Categoria).HasColumnName("categoria");
            entity.Property(e => e.Mensagem).HasColumnName("mensagem").IsRequired();
            entity.Property(e => e.Detalhes).HasColumnName("detalhes");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.HasIndex(e => e.Data);
            entity.HasIndex(e => e.Nivel);
            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de Assinatura
        modelBuilder.Entity<Assinatura>(entity =>
        {
            entity.ToTable("assinaturas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CadastroId).HasColumnName("cadastro_id").IsRequired();
            entity.Property(e => e.Plano).HasColumnName("plano").IsRequired();
            entity.Property(e => e.Valor).HasColumnName("valor").HasColumnType("numeric").IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").IsRequired();
            entity.Property(e => e.DataInicio).HasColumnName("data_inicio").IsRequired();
            entity.Property(e => e.DataVencimento).HasColumnName("data_vencimento");
            entity.Property(e => e.DataCancelamento).HasColumnName("data_cancelamento");
            entity.Property(e => e.MotivosCancelamento).HasColumnName("motivos_cancelamento");
            entity.Property(e => e.FormaPagamento).HasColumnName("forma_pagamento").IsRequired();
            entity.Property(e => e.ValorPago).HasColumnName("valor_pago").HasColumnType("numeric");
            entity.Property(e => e.StatusPagamento).HasColumnName("status_pagamento");
            entity.Property(e => e.DataPagamento).HasColumnName("data_pagamento");
            entity.Property(e => e.DiasAtraso).HasColumnName("dias_atraso");
            entity.Property(e => e.UltimaNotificacaoAtraso).HasColumnName("ultima_notificacao_atraso");
            entity.Property(e => e.ClienteNome).HasColumnName("cliente_nome");
            entity.Property(e => e.ClienteEmail).HasColumnName("cliente_email");
            entity.Property(e => e.ClienteWhatsapp).HasColumnName("cliente_whatsapp");
            entity.Property(e => e.NomeCondominio).HasColumnName("nome_condominio");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.CadastroId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.DataVencimento);

            // Relacionamento com Cadastro
            entity.HasOne(e => e.Cadastro)
                  .WithMany()
                  .HasForeignKey(e => e.CadastroId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuração de DespesaSistema
        modelBuilder.Entity<DespesaSistema>(entity =>
        {
            entity.ToTable("despesas_sistema");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Descricao).HasColumnName("descricao").IsRequired();
            entity.Property(e => e.Valor).HasColumnName("valor").HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.Categoria).HasColumnName("categoria").IsRequired();
            entity.Property(e => e.DataLancamento).HasColumnName("data_lancamento").IsRequired();
            entity.Property(e => e.DataPagamento).HasColumnName("data_pagamento");
            entity.Property(e => e.Status).HasColumnName("status").HasDefaultValue("pendente");
            entity.Property(e => e.Observacao).HasColumnName("observacao");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Categoria);
        });

        // Configuração de Reserva
        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.ToTable("reservas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Espaco).HasColumnName("espaco").IsRequired();
            entity.Property(e => e.Morador).HasColumnName("morador").IsRequired();
            entity.Property(e => e.DataReserva).HasColumnName("data_reserva").IsRequired();
            entity.Property(e => e.HoraInicio).HasColumnName("hora_inicio").IsRequired();
            entity.Property(e => e.HoraFim).HasColumnName("hora_fim").IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").IsRequired();
            entity.Property(e => e.Observacoes).HasColumnName("observacoes");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de RefreshToken
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("refresh_tokens");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.Token).HasColumnName("token").IsRequired();
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.ExpiresAt).HasColumnName("expires_at").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();

            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => e.UsuarioId);
        });

        // Configuração de Banner
        modelBuilder.Entity<Banner>(entity =>
        {
            entity.ToTable("banners");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImagemUrl).HasColumnName("imagem_url").IsRequired();
            entity.Property(e => e.ObjectPath).HasColumnName("object_path").IsRequired();
            entity.Property(e => e.Ordem).HasColumnName("ordem");
            entity.Property(e => e.Ativo).HasColumnName("ativo").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // Configuração de WhatsAppInstancia
        modelBuilder.Entity<WhatsAppInstancia>(entity =>
        {
            entity.ToTable("whatsapp_instancias");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.IsAdmin).HasColumnName("is_admin").HasDefaultValue(false);
            entity.Property(e => e.InstanceName).HasColumnName("instance_name").IsRequired();
            entity.Property(e => e.EvolutionInstanceId).HasColumnName("evolution_instance_id");
            entity.Property(e => e.EvolutionToken).HasColumnName("evolution_token");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UsuarioId);
            entity.HasIndex(e => e.InstanceName).IsUnique();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Preencher CreatedAt e UpdatedAt automaticamente
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                // Ao criar, define CreatedAt se a propriedade existir
                var createdAtProp = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "CreatedAt");
                if (createdAtProp != null && createdAtProp.CurrentValue == null)
                {
                    createdAtProp.CurrentValue = DateTime.UtcNow;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                // Ao atualizar, define UpdatedAt se a propriedade existir
                var updatedAtProp = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "UpdatedAt");
                if (updatedAtProp != null)
                {
                    updatedAtProp.CurrentValue = DateTime.UtcNow;
                }
            }
        }

        // Converter todos os DateTime para UTC antes de salvar
        foreach (var entry in ChangeTracker.Entries())
        {
            foreach (var property in entry.Properties)
            {
                if (property.Metadata.ClrType == typeof(DateTime))
                {
                    var dateTime = (DateTime?)property.CurrentValue;
                    if (dateTime.HasValue && dateTime.Value.Kind == DateTimeKind.Unspecified)
                    {
                        // Se o DateTime não tem Kind especificado, assume como Local e converte para UTC
                        property.CurrentValue = DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
                    }
                    else if (dateTime.HasValue && dateTime.Value.Kind == DateTimeKind.Local)
                    {
                        // Se é Local, converte para UTC
                        property.CurrentValue = dateTime.Value.ToUniversalTime();
                    }
                }
                else if (property.Metadata.ClrType == typeof(DateTime?))
                {
                    var dateTime = (DateTime?)property.CurrentValue;
                    if (dateTime.HasValue && dateTime.Value.Kind == DateTimeKind.Unspecified)
                    {
                        property.CurrentValue = DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
                    }
                    else if (dateTime.HasValue && dateTime.Value.Kind == DateTimeKind.Local)
                    {
                        property.CurrentValue = dateTime.Value.ToUniversalTime();
                    }
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}

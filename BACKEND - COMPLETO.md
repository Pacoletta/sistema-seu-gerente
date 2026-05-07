# Padrão de Projeto — Backend + Documentação Backend

## Objetivo

Este documento define o padrão de arquitetura, organização, implementação e documentação para o backend.

---

## 1. Princípios gerais

- Usar **Clean Architecture** no backend.
- Separar responsabilidades por camada.
- Organizar por **domínio/feature/use case**, e não por tipo técnico global.
- Aplicar **CQRS** para separar escrita e leitura.
- Manter o **Domain independente** de framework, banco e detalhes externos.
- Atualizar a **documentação no mesmo ciclo da implementação**.
- Priorizar clareza, manutenção e segurança.
- Reutilizar código existente antes de criar algo novo.

---

## 2. Camadas do backend

### API
Responsável pela entrada e saída HTTP.

**Contém:**
- Controllers
- Middlewares
- Configuração de autenticação/autorização
- Swagger / OpenAPI / Scalar
- Bootstrap da aplicação
- Filtros e helpers HTTP

**Responsabilidades:**
- Receber requisição
- Validar entrada básica
- Encaminhar para a Application
- Retornar resposta padronizada

---

### Application
Responsável pelos casos de uso.

**Contém:**
- Commands
- Queries
- Handlers
- DTOs
- Validators
- Behaviors
- UseCases
- Mapping manual
- Settings
- Interfaces de serviços de aplicação

**Responsabilidades:**
- Orquestrar o fluxo da funcionalidade
- Aplicar regras de aplicação
- Chamar contratos do Domain e da Infrastructure
- Separar leitura e escrita com CQRS

---

### Domain
Responsável pela regra de negócio central.

**Contém:**
- Entities
- ValueObjects
- Enums
- Interfaces
- Domain Services
- Exceptions
- Events

**Responsabilidades:**
- Definir regra de negócio pura
- Garantir consistência das entidades
- Ser independente de framework e infraestrutura

**Regra principal:**
- O Domain não depende de API, banco, EF, logger, HttpClient ou detalhes externos.

---

### Infrastructure
Responsável pelas implementações concretas.

**Contém:**
- DbContext
- Configurações EF Core
- Repositories
- Services de integração
- Handlers de eventos
- Migrations
- Strategies
- Serviços externos

**Responsabilidades:**
- Persistência
- Integrações externas
- Implementação de interfaces
- Estratégias de execução complexa
- Recursos de infraestrutura

---

### IoC
Responsável pela injeção de dependência.

**Contém:**
- ServiceCollectionExtensions
- Registros de dependências

**Responsabilidades:**
- Conectar Application, Infrastructure e API
- Centralizar os registros da aplicação

---

## 3. Regra de dependência entre camadas

Fluxo correto:

```text
API -> Application -> Domain
Infrastructure -> Application / Domain
IoC -> API / Application / Infrastructure
```

Regras:
- API pode acessar Application e IoC
- Application pode acessar Domain
- Infrastructure pode acessar Domain e Application quando precisar implementar contratos
- Domain não acessa ninguém
- Controller nunca acessa repositório direto

---

## 4. Organização por domínio e caso de uso

### Regra principal
Organizar por **feature/domínio/use case**, e não por pastas genéricas do sistema inteiro.

### Exemplo
- `Commands/GerenciarAlias/`
- `Queries/ConsultarCotacao/`
- `Queries/ListarAliases/`

### Estrutura sugerida por caso de uso
Cada Command/Query deve ficar em sua própria subpasta, contendo:
- Command ou Query
- Handler
- Validator
- Result ou Response
- DTOs específicos, quando necessário

---

## 5. CQRS

### Commands
Usados para escrita:
- criar
- editar
- excluir
- alterar estado

### Queries
Usadas para leitura:
- obter
- listar
- consultar
- pesquisar

### Regras
- Um handler por command/query
- Validators obrigatórios para Commands
- Query só usa validator quando houver regra de entrada não trivial
- Não misturar leitura e escrita no mesmo fluxo

---

## 6. Padrões de implementação

### Mapeamento
- Não usar AutoMapper
- Fazer mapeamento manual
- Colocar em `Application/Mapping/` ou no próprio handler quando simples

### Repositórios
- Interface no Domain
- Implementação na Infrastructure
- Expor apenas o necessário
- Não expor `DbSet<T>` para fora da Infrastructure

### EF Core
- Configurações por entidade com `IEntityTypeConfiguration<T>`
- Usar Fluent API
- Aplicar configurações com `ApplyConfigurationsFromAssembly(...)`
- Evitar configuração inline no `DbContext`

### Leituras
- Queries read-only com `AsNoTracking()`
- Dapper pode ser usado em consultas críticas de performance

### Responses
- Padronizar resposta da API
- Incluir `success`, `data`, `errors`, `traceId`
- Nunca retornar stacktrace para o cliente

---

## 7. Segurança backend

- Autenticação principal com JWT
- Autorização por perfil e permissão
- Rate limiting obrigatório para reduzir abuso, flood e sobrecarga do sistema
- Aplicar limites por IP, usuário, token ou rota, conforme o tipo de endpoint
- Endpoints sensíveis como login, upload e operações críticas devem ter limites mais rígidos
- `X-Api-Key` não deve ser padrão da aplicação; usar apenas se houver integração externa, webhook ou cenário técnico específico
- Senhas com BCrypt
- CORS restrito
- Validação sempre no backend
- Nunca logar segredo, senha, token ou payload sensível completo
- Segredos apenas por variáveis de ambiente

---

## 8. Observabilidade

- Logs estruturados
- Incluir contexto útil como `traceId`
- Logar erro sem vazar dado sensível
- Ter padrão de alerta/webhook quando necessário
- Registrar eventos relevantes de bloqueio, abuso e rate limit quando aplicável
- Evitar payload bruto desnecessário nos logs

---

## 9. Testes

Prioridade:
1. Domain
2. Application
3. API / Integração
4. Infrastructure

### Cobertura mínima
- Happy path
- Erro comum
- Regras de negócio
- Fluxos críticos

### Regras
- Regra de negócio pura deve ter unit test
- Pipelines/orquestrações críticas devem ter teste de integração
- Bug crítico: idealmente primeiro escrever teste que reproduz o problema

---

## 10. Anti-patterns que não devem acontecer

- Regra de negócio em Controller
- Domain depender de Infrastructure
- Domain depender de framework web
- AutoMapper sem necessidade
- Repositório genérico inflado
- Query LINQ enorme escondendo regra de negócio
- Múltiplos `SaveChangesAsync` sem necessidade no mesmo handler
- Expor stacktrace na API
- Validar só no frontend
- Duplicar código sem pesquisar antes

---

## 11. Estrutura sugerida de pastas

```text
backend/
└── src/
    ├── MeuProjeto.Api
    │   ├── Controllers
    │   ├── Middleware
    │   ├── Helpers
    │   └── Program.cs
    │
    ├── MeuProjeto.Application
    │   ├── Commands
    │   ├── Queries
    │   ├── DTOs
    │   ├── Interfaces
    │   ├── Validators
    │   ├── Behaviors
    │   ├── UseCases
    │   ├── Mapping
    │   └── Settings
    │
    ├── MeuProjeto.Domain
    │   ├── Entities
    │   ├── ValueObjects
    │   ├── Enums
    │   ├── Interfaces
    │   ├── Services
    │   └── Events
    │
    ├── MeuProjeto.Infrastructure
    │   ├── Data
    │   ├── Repositories
    │   ├── Services
    │   ├── Strategies
    │   ├── Handlers
    │   └── Migrations
    │
    └── MeuProjeto.IoC
        └── ServiceCollectionExtensions.cs
```

---

## 12. Documentação do backend

### Regra principal
A pasta `docs/` na raiz é a fonte de verdade da documentação.

### Estrutura mínima
```text
docs/
├── setup.md
├── architecture.md
├── decisions.md
└── features/
    └── dotnet/
        └── <modulo>.md
```

### Regras
- Documentar backend separadamente do frontend
- Um domínio = um documento
- Atualizar documentação no mesmo PR da implementação
- Decisão arquitetural relevante deve virar ADR

---

## 13. Template obrigatório para docs/features/dotnet/<modulo>.md

### 1. Visão geral
- O que é a feature
- Para quem serve
- Qual problema resolve

### 2. Fluxo
- Passo a passo
- Diagrama Mermaid quando ajudar

### 3. Regras de negócio
- Regras numeradas como:
  - RN-001
  - RN-002

### 4. Interface / API
- Endpoints
- Contratos
- Request / response
- curl quando fizer sentido

### 5. Dados
- Entidades
- Tabelas
- Campos relevantes
- Índices / observações

### 6. Segurança
- Autenticação
- Autorização
- Validações
- Dados sensíveis

### 7. Observabilidade
- Logs esperados
- Métricas
- Alertas
- traceId

### 8. Performance
- Paginação
- Cache
- Payloads grandes
- Pontos críticos

### 9. Testes
- Unit
- Integration
- Cenários principais

### 10. Troubleshooting
- Erros comuns
- Causa raiz
- Como corrigir
- Pendências conhecidas:
  - P-001
  - P-002

---

## 14. Fluxo padrão para criar uma nova feature backend

1. Ler instruções globais e de backend
2. Pesquisar código semelhante antes de criar novo
3. Verificar documentação existente
4. Identificar camadas afetadas
5. Planejar:
   - arquivos a criar
   - arquivos a alterar
   - regras de negócio
   - integrações
   - testes
6. Implementar seguindo o padrão
7. Criar ou atualizar testes
8. Atualizar `docs/features/dotnet/<modulo>.md`
9. Criar ADR se houver decisão arquitetural
10. Validar build e testes

---

## 15. Checklist final backend

- [ ] A mudança está na camada correta
- [ ] O código foi organizado por domínio/use case
- [ ] Command e Query foram separados corretamente
- [ ] Command possui Validator
- [ ] Query read-only usa `AsNoTracking()` quando aplicável
- [ ] Interface e implementação estão no lugar certo
- [ ] Não foi usado AutoMapper
- [ ] Não há regra de negócio no Controller
- [ ] Logs não vazam dados sensíveis
- [ ] Rate limit foi avaliado para o endpoint ou fluxo criado/alterado
- [ ] Testes foram criados ou atualizados
- [ ] Documentação em `docs/features/dotnet/` foi atualizada
- [ ] ADR foi registrada quando necessário

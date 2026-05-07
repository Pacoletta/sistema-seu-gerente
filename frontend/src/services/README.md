# Services

Camada de integração com o backend.

## Responsabilidades

- Chamadas `fetch` para a API .NET
- Centralizar endpoints
- Lidar com headers, tokens e autenticação
- Tratamento de erros de API
- Transformação de dados

## Arquivos Atuais

- `api.ts` - Cliente HTTP base
- `apiConfig.ts` - Configurações de API
- `supabaseClient.ts` - Cliente Supabase
- `supabaseApi.ts` - Funções de API Supabase
- `assinaturaService.ts` - Serviço de assinaturas
- `configService.ts` - Serviço de configurações
- `valoresTotaisService.ts` - Serviço de valores totais

## Padrão de Uso

```typescript
// services/moradorService.ts
export const moradorService = {
  async getAll() {
    return fetchApi<Morador[]>("/api/moradores");
  },

  async create(data: CreateMoradorDto) {
    return fetchApi<Morador>("/api/moradores", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
```

## Regra

Toda chamada ao backend deve passar por um service.
Nunca fazer `fetch` direto nos componentes.

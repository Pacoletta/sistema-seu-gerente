# Padrão de Projeto — Frontend + Documentação Frontend

## Objetivo

Este documento define o padrão de organização, implementação e documentação para o frontend.

---

## 1. Princípios gerais

- Usar estrutura simples, clara e fácil de manter.
- Server Components por padrão.
- Separar bem rotas públicas, rotas autenticadas, componentes compartilhados e lógica utilitária.
- Evitar colocar segredo no browser.
- Atualizar a documentação junto com a implementação.
- Reutilizar componentes e helpers antes de criar novos.
- Priorizar acessibilidade, segurança e performance.

---

## 2. Estrutura base do frontend

Estrutura sugerida:

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── login/
│   │   └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── perfil/
│   │   └── pedidos/
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── admin/
│   │   ├── admin/usuarios/
│   │   └── admin/configuracoes/
│   └── api/
│       └── <rota>/route.ts
│
├── components/
├── lib/
├── public/
├── proxy.ts
├── next.config.ts
└── package.json
```

---

## 3. Organização das rotas

### Rotas públicas
Ficam em:
- `app/<rota>/`

Exemplo:
- `app/login/page.tsx`

### Rotas autenticadas de usuário comum
Ficam em:
- `app/(app)/<rota>/`

Exemplo:
- `app/(app)/dashboard/page.tsx`
- `app/(app)/perfil/page.tsx`

### Rotas autenticadas administrativas
Ficam em:
- `app/(admin)/admin/<rota>/`
- ou outro padrão equivalente com prefixo claro de administração

Exemplo:
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/usuarios/page.tsx`

### Regra
- Tudo que exige layout autenticado, sidebar ou contexto interno deve ficar em uma área protegida
- A área administrativa deve ter rotas claramente separadas da área comum
- O padrão recomendado é manter prefixo `/admin` para rotas administrativas

---

## 4. Organização dos componentes

### Componentes compartilhados
Ficam em:
- `frontend/components/`

Usar quando:
- o componente é reutilizado em várias rotas

### Componentes específicos de rota
Ficam em:
- `app/<rota>/_components/`

Usar quando:
- o componente pertence apenas àquela tela ou fluxo

### Componentes visuais básicos
Podem ficar em:
- `frontend/components/ui/`

Usar quando:
- forem componentes visuais pequenos e reutilizáveis

---

## 5. Organização da lógica e clients

### Helpers, clients e utilitários
Ficam em:
- `frontend/lib/`

Exemplos:
- `api.ts`
- `auth.ts`
- `dicionario.ts`
- `curadoria.ts`

### Regra
Tudo que for lógica reutilizável, acesso HTTP, helper ou função utilitária deve sair da página e ir para `lib/`.

---

## 6. Padrão de renderização

### Regra principal
- Server Components por padrão
- Usar `'use client'` somente quando realmente precisar

### Usar `'use client'` quando houver:
- eventos do browser
- `useState`
- `useReducer`
- hooks do cliente
- interação local
- APIs do navegador

### Evitar
- colocar `'use client'` em árvore grande sem necessidade
- transformar página inteira em client component quando só um pedaço precisa

---

## 7. Estado e dados

### Estado local
Usar:
- `useState`
- `useReducer`

### Estado do servidor
Usar:
- `fetch`
- recursos nativos do Next.js
- `revalidate`
- `cache`
- route handlers
- Server Actions, quando fizer sentido

### Regra
Não adicionar biblioteca de estado ou validação sem necessidade clara.

---

## 8. Segurança no frontend

- Nunca colocar JWT ou credenciais sensíveis em `localStorage`
- Preferir cookies httpOnly
- Toda chamada autenticada ao backend deve passar por proxy server-side quando necessário
- O browser não deve receber nem enviar segredos técnicos do backend
- Validar entrada também no backend
- Auditar tudo que estiver em `NEXT_PUBLIC_*`

---

## 9. Integração com backend

### Regra principal
Chamadas autenticadas devem passar por:
- `app/api/`
- `proxy.ts`

### Objetivo
- proteger segredos
- centralizar autenticação
- evitar exposição de credenciais técnicas no cliente
- simplificar consumo no frontend

---

## 10. Login único para usuário e área administrativa

### Regra principal
O frontend deve usar **uma única tela de login** para todos os perfis do sistema.

### Como funciona
- A rota de login deve ser única, por exemplo: `app/login/page.tsx`
- Usuário comum e administrador autenticam na mesma tela
- O backend deve devolver, além da autenticação, a informação de perfil, papel ou permissão do usuário
- O frontend não deve criar uma tela de login separada para admin, a menos que exista uma necessidade real de negócio

### O que muda entre usuário e admin
O que muda **não é a tela de login**, e sim:
- as rotas que cada perfil pode acessar
- o layout que cada perfil visualiza
- o redirecionamento após autenticação
- as permissões liberadas pelo middleware e pelo backend

### Estrutura recomendada
```text
app/
├── login/
│   └── page.tsx
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/
│   ├── perfil/
│   └── pedidos/
├── (admin)/
│   ├── layout.tsx
│   ├── admin/
│   ├── admin/usuarios/
│   └── admin/configuracoes/
```

### Regras de rota
- A rota `/login` deve ser única
- Rotas administrativas devem ficar sob um padrão claro, preferencialmente com prefixo `/admin`
- Rotas comuns do usuário devem ficar em sua própria área funcional
- O middleware deve ser o responsável por decidir se o usuário pode ou não acessar determinada rota

### Regra do middleware
O middleware deve:
- redirecionar para `/login` quando o usuário não estiver autenticado e tentar acessar rota protegida
- redirecionar para a área correta quando o usuário já estiver autenticado e acessar `/login`
- bloquear o acesso a rotas administrativas quando o perfil não tiver permissão
- respeitar o perfil retornado pela autenticação, como `role`, `perfil`, `tipoUsuario` ou equivalente

### Redirecionamento após login
Após autenticar:
- administrador deve ser redirecionado para a área administrativa
- usuário comum deve ser redirecionado para a área comum
- o frontend pode fazer esse redirecionamento logo após o login
- o middleware ainda deve existir e validar a navegação, mesmo que o frontend já redirecione corretamente

### Regra de segurança
- O middleware protege a navegação no frontend
- O backend continua sendo a autoridade final de autorização
- Mesmo que o frontend esconda menus ou bloqueie rotas, o backend deve validar permissões em endpoints sensíveis

### Exemplo de regra prática
- `/login` é único para todos
- `/admin` e subrotas são exclusivas da área administrativa
- `/dashboard`, `/perfil` e rotas equivalentes pertencem à área comum
- usuário comum não deve acessar rota administrativa
- administrador pode ser redirecionado para uma home própria de administração

---

## 11. Acessibilidade

Obrigatório verificar:
- `aria-*` quando necessário
- navegação por teclado
- foco visível
- contraste
- labels e semântica adequada

---

## 12. Performance

- Usar cache e revalidate corretamente
- Fazer lazy load em componentes pesados
- Evitar `'use client'` desnecessário
- Usar `next/image` quando fizer sentido
- Evitar componentes grandes demais com muita lógica misturada

---

## 13. Build e qualidade

Antes de finalizar:
- `npm run build`
- `npm run lint`

O frontend só deve ser considerado pronto quando build e lint passarem.

---

## 14. Anti-patterns que não devem acontecer

- Segredo exposto no browser
- JWT salvo em localStorage
- Página inteira como client component sem necessidade
- Criar duas telas de login sem necessidade real
- Misturar rotas administrativas e comuns sem separação clara
- Deixar controle de acesso apenas na UI sem middleware e sem validação no backend
- Componente específico jogado em `components/` sem reaproveitamento real
- Lógica de API espalhada dentro de várias páginas
- Criar biblioteca nova sem necessidade ou sem ADR quando relevante
- Não documentar feature alterada

---

## 15. Estrutura de documentação do frontend

### Regra principal
A pasta `docs/` na raiz é a fonte de verdade.

### Estrutura mínima
```text
docs/
├── setup.md
├── architecture.md
├── decisions.md
└── features/
    └── frontend/
        └── <modulo>.md
```

### Regras
- Documentar frontend separado do backend
- Um domínio/feature = um documento
- Atualizar documentação no mesmo PR
- Criar links cruzados com backend quando o fluxo atravessar as duas pontas

---

## 16. Template obrigatório para docs/features/frontend/<modulo>.md

### 1. Visão geral
- O que é a feature
- Para quem serve
- Qual problema resolve

### 2. Fluxo
- Passo a passo do usuário
- Diagrama Mermaid quando ajudar

### 3. Regras de negócio
- Regras numeradas:
  - RN-001
  - RN-002

### 4. Interface / UI / API
- Telas
- Componentes relevantes
- Chamadas para backend
- Contratos importantes
- Exemplos visuais ou payloads quando necessário

### 5. Dados
- Dados exibidos
- Estados relevantes
- Filtros
- Observações de consumo

### 6. Segurança
- Auth
- Permissão
- Proteção de segredo
- Validações

### 7. Observabilidade
- Logs esperados
- Métricas
- Alertas
- traceId/correlation quando existir

### 8. Performance
- Cache
- Revalidate
- Lazy loading
- Componentes pesados
- Otimização de renderização

### 9. Testes
- Fluxo feliz
- Erros comuns
- Casos de permissão
- Estados de loading/error

### 10. Troubleshooting
- Problemas comuns
- Causa raiz
- Como corrigir
- Pendências:
  - P-001
  - P-002

---

## 17. Fluxo padrão para criar uma nova feature frontend

1. Ler instruções globais e de frontend
2. Pesquisar rotas, componentes e helpers existentes
3. Verificar documentação da feature
4. Identificar:
   - rota
   - componentes
   - clients/helpers
   - integração com backend
5. Planejar:
   - arquivos a criar
   - arquivos a alterar
   - estados
   - regras da interface
   - segurança
   - testes
6. Implementar seguindo o padrão
7. Atualizar documentação em `docs/features/frontend/<modulo>.md`
8. Criar ADR se houver decisão arquitetural relevante
9. Validar build e lint

---

## 18. Checklist final frontend

- [ ] Componente está na pasta correta
- [ ] Server Component foi mantido por padrão
- [ ] `'use client'` foi usado só quando necessário
- [ ] Nenhum segredo vazou para o browser
- [ ] Chamadas autenticadas passam pelo proxy server-side
- [ ] Login único foi mantido para usuário e admin, salvo necessidade real de negócio
- [ ] Rotas administrativas estão separadas das rotas comuns
- [ ] Middleware foi considerado para controle de acesso
- [ ] Acessibilidade foi considerada
- [ ] Build passou
- [ ] Lint passou
- [ ] Documentação em `docs/features/frontend/` foi atualizada
- [ ] Link com backend foi documentado quando necessário

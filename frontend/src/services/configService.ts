/**
 * Serviço de configuração - Busca todas as configs do backend
 */

interface WebhooksConfig {
  chat_suporte: string;
  chat_landing: string;
  enviar_pdf: string;
  conectar: string;
  verificar: string;
  deletar: string;
  cadastro: string;
  enviar_todos: string;
  chat: string;
}

interface BusinessConfig {
  site_url: string;
  whatsapp: string;
  whatsapp_support: string;
}

interface StorageConfig {
  base_url: string;
  logo_path: string;
  logo_url: string;
}

interface AppConfig {
  mercadopago_public_key: string;
  webhooks: WebhooksConfig;
  business: BusinessConfig;
  storage: StorageConfig;
}

// Cache da configuração
let configCache: AppConfig | null = null;
let configPromise: Promise<AppConfig> | null = null;

/**
 * Busca configurações públicas do backend
 */
export async function fetchConfig(): Promise<AppConfig> {
  // Se já tem cache, retorna
  if (configCache) {
    return configCache;
  }

  // Se já está buscando, retorna a promise em andamento
  if (configPromise) {
    return configPromise;
  }

  // Inicia nova busca
  configPromise = (async () => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/configpublica`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar configurações: ${response.status}`);
      }

      const config = await response.json();
      configCache = config;
      configPromise = null;
      return config;
    } catch (error) {
      configPromise = null;
      console.error("Erro ao buscar configurações do backend:", error);

      // Retorna configurações padrão em caso de erro
      const n8nBase =
        process.env.NEXT_PUBLIC_N8N_BASE_URL ||
        "https://n8n-hook.paxstecnologia.com";
      return {
        mercadopago_public_key: "",
        webhooks: {
          chat_suporte: `${n8nBase}/webhook/chatsuporte`,
          chat_landing: `${n8nBase}/webhook/chatlanding`,
          enviar_pdf: `${n8nBase}/webhook/enviarpdf`,
          conectar: `${n8nBase}/webhook/conectar`,
          verificar: `${n8nBase}/webhook/verificar`,
          deletar: `${n8nBase}/webhook/deletar`,
          cadastro: `${n8nBase}/webhook/whatsapp-email`,
          enviar_todos: `${n8nBase}/webhook/whatsapp-email`,
          chat: `${n8nBase}/webhook/chat`,
        },
        business: {
          site_url:
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://sistemaseugerente.com.br",
          whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531983625590",
          whatsapp_support:
            process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || "5511999999999",
        },
        storage: {
          base_url: "",
          logo_path: "/logo.png",
          logo_url: "/logo.png",
        },
      };
    }
  })();

  return configPromise;
}

/**
 * Retorna a URL do backend
 */
export function getBackendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  );
}

/**
 * Limpa o cache de configuração (útil para testes)
 */
export function clearConfigCache(): void {
  configCache = null;
  configPromise = null;
}

/**
 * Retorna configurações da aplicação (compatibilidade com código antigo)
 * @deprecated Use fetchConfig() em vez disso
 */
export function getConfig(): {
  webhooks: { n8n: string };
  backend: { url: string };
} {
  return {
    webhooks: {
      n8n: "",
    },
    backend: {
      url: getBackendUrl(),
    },
  };
}

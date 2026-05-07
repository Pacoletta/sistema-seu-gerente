// Configuração da API (agora usando Next.js API Routes)
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  endpoints: {
    auth: "/api/auth",
    config: "/api/config",
  },
};

// Helper para fazer requisições à API
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

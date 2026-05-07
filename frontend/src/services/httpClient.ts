const getBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

let _baseUrl: string | null = null;
const getBase = (): string => {
  if (_baseUrl === null) _baseUrl = getBaseUrl();
  return _baseUrl;
};

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getTokenFromCookie();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${getBase()}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expirado — limpar cookie e redirecionar para login
    if (typeof document !== "undefined") {
      document.cookie = "auth_token=; path=/; max-age=0";
      document.cookie = "refresh_token=; path=/; max-age=0";
      window.location.href = "/login";
    }
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "Erro na requisição");
  }

  if (response.status === 204) return {} as T;

  return response.json();
}

export async function backendFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getTokenFromCookie();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${getBase()}${endpoint}`, { ...options, headers });
}

export function getBackendUrl(): string {
  return getBase();
}

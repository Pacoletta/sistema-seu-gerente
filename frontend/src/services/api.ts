import { request } from "./httpClient";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// ==================================
// Helpers de cookie
// ==================================
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

function clearAuthCookies() {
  const expired = "; path=/; max-age=0";
  document.cookie = `auth_token=${expired}`;
  document.cookie = `refresh_token=${expired}`;
}

// ==================================
// API Client — Backend .NET
// ==================================
export const API = {
  auth: {
    async login(email: string, senha: string) {
      const data = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!data.ok) {
        const err = await data
          .json()
          .catch(() => ({ message: "Erro ao fazer login" }));
        throw new Error(err.message || "Credenciais inválidas");
      }

      const result = await data.json();

      // Salva token em cookie (60 min = expiresIn / 60 / 24 dias)
      const expirationDays = (result.expiresIn || 3600) / 86400;
      setCookie("auth_token", result.accessToken, expirationDays);
      setCookie("refresh_token", result.refreshToken, 7);

      return {
        success: true,
        session: {
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
          expires_at:
            Math.floor(Date.now() / 1000) + (result.expiresIn || 3600),
        },
        user: {
          id: result.usuarioId,
          email: result.email,
          nome: result.nome || "",
          role: result.role || "user",
        },
      };
    },

    async register(
      email: string,
      senha: string,
      nome: string,
      codigoIndicacao?: string,
    ) {
      const data = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha, nome, codigoIndicacao }),
      });

      if (!data.ok) {
        const err = await data
          .json()
          .catch(() => ({ message: "Erro ao registrar" }));
        throw new Error(err.message || "Erro ao registrar");
      }

      const result = await data.json();

      const expirationDays = (result.expiresIn || 3600) / 86400;
      setCookie("auth_token", result.accessToken, expirationDays);
      setCookie("refresh_token", result.refreshToken, 7);

      return { success: true, data: result };
    },

    async resetPasswordEmail(_email: string) {
      // TODO: implementar endpoint de reset de senha no backend
      return { success: true };
    },

    async resetPassword(_newPassword: string) {
      // TODO: implementar endpoint de update de senha no backend
      return { success: true };
    },

    async logout() {
      try {
        await request("/api/auth/logout", { method: "POST" });
      } catch {
        // Ignorar erros de rede no logout
      } finally {
        clearAuthCookies();
      }
      return { success: true };
    },

    async getSession() {
      // Verifica se há token no cookie
      if (typeof document === "undefined") return null;
      const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
      if (!match) return null;

      const token = decodeURIComponent(match[1]);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) return null;
        return { access_token: token, expires_at: payload.exp };
      } catch {
        return null;
      }
    },

    async me() {
      try {
        const cadastroData = await request<any>("/api/cadastro/me", {
          method: "GET",
        });

        // Decodificar token para pegar sub (usuarioId)
        let userId = "";
        if (typeof document !== "undefined") {
          const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
          if (match) {
            try {
              const payload = JSON.parse(
                atob(decodeURIComponent(match[1]).split(".")[1]),
              );
              userId = payload.sub || payload.nameid || "";
            } catch {}
          }
        }

        return {
          success: true,
          user: {
            id: userId,
            email: cadastroData?.email || "",
            nome: cadastroData?.nome || "",
            whatsapp: cadastroData?.whatsapp || "",
            cnpj_cpf: cadastroData?.cnpjCpf || cadastroData?.cnpj_cpf || "",
            nome_condominio:
              cadastroData?.nomeCondominio ||
              cadastroData?.nome_condominio ||
              "",
            quantidade_apartamentos:
              cadastroData?.quantidadeApartamentos ||
              cadastroData?.quantidade_apartamentos ||
              0,
            status: cadastroData?.status || "",
          },
        };
      } catch {
        return { success: false, user: null };
      }
    },
  },

  configuracao: {
    async get(_usuarioId: string) {
      return request("/api/configuracao", { method: "GET" });
    },

    async update(_usuarioId: string, config: any) {
      await request("/api/configuracao", {
        method: "PUT",
        body: JSON.stringify(config),
      });
      return { success: true };
    },
  },

  whatsapp: {
    async status(_usuarioId: string) {
      return request("/api/notificacoes/whatsapp/status", { method: "GET" });
    },

    async cadastro(_usuarioId: string, nome: string, whatsapp: string) {
      return request("/api/notificacoes/whatsapp/cadastro", {
        method: "POST",
        body: JSON.stringify({ nome, whatsapp }),
      });
    },

    async deletar(_usuarioId: string) {
      return request("/api/notificacoes/whatsapp/deletar", { method: "POST" });
    },

    async enviarPdf(
      _usuarioId: string,
      pdfBase64: string,
      telefone: string,
      nomeUsuario: string,
      emailUsuario: string,
    ) {
      return request("/api/notificacoes/whatsapp/enviar-pdf", {
        method: "POST",
        body: JSON.stringify({
          pdf_base64: pdfBase64,
          telefone,
          nome_usuario: nomeUsuario,
          email_usuario: emailUsuario,
        }),
      });
    },
  },

  moradores: {
    async list(_usuarioId: string) {
      return request<any[]>("/api/moradores", { method: "GET" });
    },
    async create(data: any) {
      await request("/api/moradores", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async update(id: string, data: any) {
      await request(`/api/moradores/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async delete(id: string) {
      await request(`/api/moradores/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },

  despesas: {
    async list(_usuarioId: string) {
      return request<any[]>("/api/despesas", { method: "GET" });
    },
    async create(data: any) {
      await request("/api/despesas", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async update(id: string, data: any) {
      return request<any>(`/api/despesas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async delete(id: string) {
      await request(`/api/despesas/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },

  receitas: {
    async list(_usuarioId: string) {
      return request<any[]>("/api/receitas", { method: "GET" });
    },
    async create(data: any) {
      await request("/api/receitas", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async update(id: string, data: any) {
      await request(`/api/receitas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async delete(id: string) {
      await request(`/api/receitas/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },

  pagamentos: {
    async list(_usuarioId: string) {
      return request<any[]>("/api/pagamentos", { method: "GET" });
    },
    async create(data: any) {
      await request("/api/pagamentos", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async update(id: string, data: any) {
      await request(`/api/pagamentos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async delete(id: string) {
      await request(`/api/pagamentos/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },

  melhorias: {
    async list(_usuarioId: string) {
      return request<any[]>("/api/melhorias", { method: "GET" });
    },
    async create(data: any) {
      await request("/api/melhorias", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async update(id: string, data: any) {
      await request(`/api/melhorias/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async delete(id: string) {
      await request(`/api/melhorias/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },

  sugestoes: {
    async list(_usuarioId: string) {
      return request<any[]>("/api/sugestoes", { method: "GET" });
    },
    async create(data: any) {
      await request("/api/sugestoes", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async update(id: string, data: any) {
      await request(`/api/sugestoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    },
    async delete(id: string) {
      await request(`/api/sugestoes/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },

  banners: {
    async listAtivos() {
      return request<any[]>("/api/banner", { method: "GET" });
    },
    async listTodos() {
      return request<any[]>("/api/banner/todos", { method: "GET" });
    },
    async upload(formData: FormData) {
      const token =
        typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((r) => r.startsWith("auth_token="))
              ?.split("=")[1]
          : "";
      const res = await fetch(`${BACKEND_URL}/api/banner`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao fazer upload");
      }
      return res.json();
    },
    async delete(id: string) {
      await request(`/api/banner/${id}`, { method: "DELETE" });
      return { success: true };
    },
  },
};

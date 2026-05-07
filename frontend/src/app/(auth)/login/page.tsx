"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LOGO_URL = `/logo-seugerente.png`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { API } = await import("@/services/api");
      const data = await API.auth.login(
        email.toLowerCase().trim(),
        password.trim(),
      );

      if (!data?.success) {
        throw new Error("Erro ao fazer login");
      }

      if (data?.success && data?.session && data?.user) {
        setLoading(false);
        setRedirecting(true);
        window.location.href = data.user.role === "admin" ? "/administrativo" : "/dashboard";
      } else {
        console.error("❌ Dados incompletos - sem session ou user");
        setError("Erro ao fazer login. Verifique suas credenciais.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
      setLoading(false);
      setRedirecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Elementos de fundo animados - Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Elementos de fundo animados - Gradientes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Botão Voltar */}
      <div className="absolute top-6 left-6 z-30">
        <a
          href="/"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl text-white/90 hover:text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar
        </a>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Lado Esquerdo - Branding (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center items-center p-12 relative">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="mb-12 flex items-center gap-4">
              <div className="relative">
                <img
                  src={LOGO_URL}
                  alt="Seu Gerente"
                  className="w-16 h-16 rounded-2xl border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Seu Gerente</h1>
                <p className="text-blue-300 text-sm">Gestão Profissional</p>
              </div>
            </div>

            {/* Título */}
            <div className="mb-12">
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                Bem-vindo de volta!
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Gerencie seu condomínio de forma profissional e eficiente
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="mt-1 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Gestão Completa
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Controle total de moradores, cobranças e despesas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="mt-1 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Relatórios Detalhados
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Acompanhe métricas e gere relatórios automaticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="mt-1 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">100% Seguro</h3>
                  <p className="text-slate-400 text-sm">
                    Seus dados protegidos com criptografia de ponta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo Mobile */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center gap-3 mb-2">
                <img
                  src={LOGO_URL}
                  alt="Seu Gerente"
                  className="w-12 h-12 rounded-xl border border-blue-400/30"
                />
                <h1 className="text-2xl font-bold text-white">Seu Gerente</h1>
              </div>
            </div>

            <div className="bg-white/3 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Acesse sua conta
                </h2>
                <p className="text-slate-400">
                  Entre com suas credenciais para continuar
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">
                      Senha
                    </label>
                    <a
                      href="/reset-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Esqueceu?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3 backdrop-blur-xl">
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || redirecting}
                  className={`group relative w-full px-6 py-4 font-semibold text-base rounded-xl transition-all duration-300 transform overflow-hidden ${
                    loading || redirecting
                      ? "bg-linear-to-r from-slate-700 to-slate-600 cursor-wait"
                      : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0"
                  } text-white disabled:transform-none`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Entrando...</span>
                      </>
                    ) : redirecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Redirecionando...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Entrar
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divisor */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-slate-400">ou</span>
                </div>
              </div>

              {/* Link Criar Conta */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Ainda não tem uma conta?
                </p>
                <a
                  href="/login/cadastro"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-200 w-full"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                  Criar nova conta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

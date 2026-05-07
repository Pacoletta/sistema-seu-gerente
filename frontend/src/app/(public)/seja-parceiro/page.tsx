"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHandshake,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaCheck,
  FaPercent,
  FaGift,
  FaHeadset,
} from "react-icons/fa";
import Link from "next/link";

export default function SejaParceiro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validações
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!aceitouTermos) {
      setErro("Você deve aceitar os termos do programa de parceiros");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parceiro/cadastro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            email,
            senha,
            telefone: telefone || null,
            chavePix: chavePix || null,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha ao realizar cadastro");
      }

      const data = await response.json();

      console.log("✅ Cadastro parceiro bem-sucedido:", data);

      // Salvar token no localStorage
      localStorage.setItem("parceiro_token", data.token);
      localStorage.setItem("parceiroEmail", data.email);
      localStorage.setItem("parceiroNome", data.nome);
      localStorage.setItem("parceiroId", data.id);
      localStorage.setItem("isParceiro", "true");

      // Setar cookie para o middleware validar
      const maxAge = 7 * 24 * 60 * 60;
      document.cookie = `parceiro_token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `isParceiro=true; path=/; max-age=${maxAge}; SameSite=Lax`;

      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push("/parceiro");
    } catch (error: any) {
      console.error("❌ Erro no cadastro parceiro:", error);
      setErro(error.message || "Erro ao realizar cadastro.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Header */}
      <header className="bg-linear-to-r from-emerald-600 to-teal-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <FaArrowLeft />
              <span>Voltar ao site</span>
            </Link>
            <Link
              href="/parceiro-login"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Já sou parceiro
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Lado Esquerdo - Benefícios */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-6">
                <FaHandshake className="text-4xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Seja um Parceiro
              </h1>
              <p className="text-xl text-gray-600">
                Ganhe comissões indicando o Sistema Seu Gerente para condomínios
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Por que ser parceiro?
              </h2>

              <div className="grid gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <FaPercent className="text-2xl text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">20% de Comissão</h3>
                    <p className="text-gray-600 text-sm">
                      Ganhe 20% sobre cada venda realizada através do seu link
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <FaMoneyBillWave className="text-2xl text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Comissões Recorrentes
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Enquanto seu indicado for cliente, você continua ganhando
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 flex items-start gap-4">
                  <div className="bg-cyan-100 p-3 rounded-xl">
                    <FaChartLine className="text-2xl text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Dashboard Completo
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Acompanhe suas indicações e ganhos em tempo real
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <FaGift className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Materiais de Divulgação
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Acesse banners e textos prontos para divulgar
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FaHeadset className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Suporte Dedicado
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Equipe exclusiva para ajudar você a vender mais
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Como funciona */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-bold text-emerald-800 text-lg mb-4">
                Como funciona?
              </h3>
              <ol className="space-y-3 text-emerald-700">
                <li className="flex items-start gap-3">
                  <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </span>
                  <span>Cadastre-se gratuitamente e receba seu link único</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </span>
                  <span>
                    Compartilhe seu link com síndicos e administradores
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </span>
                  <span>
                    Quando se tornarem clientes, você ganha 10% de comissão
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    4
                  </span>
                  <span>Solicite saques via PIX a partir de R$ 50,00</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Cadastre-se Agora
            </h2>

            <form onSubmit={handleCadastro} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-emerald-500" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Seu nome"
                  required
                  disabled={carregando}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-emerald-500" />
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="seu@email.com"
                  required
                  disabled={carregando}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2 text-emerald-500" />
                  Telefone/WhatsApp
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="(11) 99999-9999"
                  disabled={carregando}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-emerald-500" />
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                    required
                    disabled={carregando}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-emerald-500" />
                    Confirmar *
                  </label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                    required
                    disabled={carregando}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-emerald-500" />
                  Chave PIX (para receber comissões)
                </label>
                <input
                  type="text"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="CPF, Email ou Telefone"
                  disabled={carregando}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pode ser atualizado depois
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termos"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="termos" className="text-sm text-gray-600">
                  Li e aceito os{" "}
                  <a
                    href="/termos-parceiros"
                    className="text-emerald-600 hover:underline"
                  >
                    Termos do Programa de Parceiros
                  </a>{" "}
                  e a{" "}
                  <a
                    href="/privacidade"
                    className="text-emerald-600 hover:underline"
                  >
                    Política de Privacidade
                  </a>
                </label>
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {carregando ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <FaHandshake />
                    Quero Ser Parceiro
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                href="/parceiro-login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

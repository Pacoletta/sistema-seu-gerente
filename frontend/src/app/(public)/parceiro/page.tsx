"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaHandshake,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaCopy,
  FaCheck,
  FaSignOutAlt,
  FaSpinner,
  FaLink,
  FaCalendarAlt,
  FaWhatsapp,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaExternalLinkAlt,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaGift,
  FaPercent,
  FaWallet,
  FaHistory,
} from "react-icons/fa";

// Interfaces
interface Indicacao {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente?: string;
  dataIndicacao: string;
  status: string;
  nomeCondominio?: string;
  quantidadeApartamentos?: number;
  comissao?: number;
  plano?: string;
  dataConversao?: string;
}

interface Assinatura {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  dataAssinatura: string;
  dataPagamento?: string;
  dataVencimento?: string;
  status: string;
  plano: string;
  valorAssinatura: number;
  comissao: number;
  formaPagamento: string;
  mercadopagoPaymentId?: string;
}

interface Saque {
  id: string;
  valor: number;
  dataSolicitacao: string;
  dataPagamento?: string;
  status: "pendente" | "aprovado" | "pago" | "rejeitado";
  metodoPagamento: string;
  dadosPagamento?: string;
}

interface Parceiro {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  codigoIndicacao: string;
  linkIndicacao: string;
  percentualComissao: number;
  saldoDisponivel: number;
  saldoPendente: number;
  totalGanhos: number;
  totalIndicacoes: number;
  indicacoesAtivas: number;
  createdAt: string;
  chavePix?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
}

// Componente MiniStatCard
const MiniStatCard = ({
  icon: Icon,
  title,
  value,
  color,
  loading = false,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
  loading?: boolean;
  subtitle?: string;
}) => {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    teal: "bg-teal-100 text-teal-600",
    cyan: "bg-cyan-100 text-cyan-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-lg ${colorClasses[color] || colorClasses.emerald}`}
        >
          <Icon className="text-lg" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          {loading ? (
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <>
              <p className="text-lg font-bold text-gray-800">{value}</p>
              {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ParceiroDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parceiro, setParceiro] = useState<Parceiro | null>(null);
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [saques, setSaques] = useState<Saque[]>([]);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "indicacoes" | "assinaturas" | "saques" | "config"
  >("dashboard");
  const [copiado, setCopiado] = useState(false);
  const [showSaqueModal, setShowSaqueModal] = useState(false);
  const [valorSaque, setValorSaque] = useState("");
  const [processandoSaque, setProcessandoSaque] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("parceiro_token");
    if (!token) {
      router.push("/parceiro-login");
      return;
    }
    loadDados();
  }, [router]);

  const getToken = () => localStorage.getItem("parceiro_token");
  const getBackendUrl = () => process.env.NEXT_PUBLIC_API_URL;

  const loadDados = async () => {
    setLoading(true);
    const token = getToken();
    const backendUrl = getBackendUrl();

    console.log("🔄 Carregando dados do parceiro...");
    console.log("Token:", token?.substring(0, 20) + "...");
    console.log("Backend URL:", backendUrl);

    try {
      // Carregar dados do parceiro
      const resParceiro = await fetch(`${backendUrl}/api/parceiro/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📊 Resposta /me:", resParceiro.status);
      if (resParceiro.ok) {
        const data = await resParceiro.json();
        console.log("✅ Dados do parceiro:", data);
        setParceiro(data);
      } else {
        const errorText = await resParceiro.text();
        console.error("❌ Erro ao carregar parceiro:", errorText);
      }

      // Carregar indicações
      const resIndicacoes = await fetch(
        `${backendUrl}/api/parceiro/indicacoes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (resIndicacoes.ok) {
        const data = await resIndicacoes.json();
        setIndicacoes(data);
      }

      // Carregar assinaturas
      const resAssinaturas = await fetch(
        `${backendUrl}/api/parceiro/assinaturas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("📊 Resposta /assinaturas:", resAssinaturas.status);
      if (resAssinaturas.ok) {
        const data = await resAssinaturas.json();
        console.log("✅ Assinaturas carregadas:", data.length, data);
        setAssinaturas(data);
      } else {
        const errorText = await resAssinaturas.text();
        console.error("❌ Erro ao carregar assinaturas:", errorText);
      }

      // Carregar saques
      const resSaques = await fetch(`${backendUrl}/api/parceiro/saques`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resSaques.ok) {
        const data = await resSaques.json();
        setSaques(data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const copiarLink = () => {
    if (parceiro?.linkIndicacao) {
      navigator.clipboard.writeText(parceiro.linkIndicacao);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const compartilharWhatsApp = () => {
    if (parceiro?.linkIndicacao) {
      const texto = encodeURIComponent(
        `🏠 Conheça o Sistema Seu Gerente!\n\nO melhor sistema para gestão de condomínios. Simplifique a administração com transparência e eficiência.\n\n👉 Cadastre-se aqui: ${parceiro.linkIndicacao}`,
      );
      window.open(`https://wa.me/?text=${texto}`, "_blank");
    }
  };

  const solicitarSaque = async () => {
    if (!valorSaque || parseFloat(valorSaque) <= 0) {
      alert("Informe um valor válido");
      return;
    }
    if (parseFloat(valorSaque) > (parceiro?.saldoDisponivel || 0)) {
      alert("Saldo insuficiente");
      return;
    }

    setProcessandoSaque(true);
    const token = getToken();
    const backendUrl = getBackendUrl();

    try {
      const res = await fetch(`${backendUrl}/api/parceiro/saques`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valor: parseFloat(valorSaque) }),
      });

      if (res.ok) {
        alert("✅ Solicitação de saque enviada com sucesso!");
        setShowSaqueModal(false);
        setValorSaque("");
        loadDados();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.message || "Erro ao solicitar saque"}`);
      }
    } catch (error) {
      alert("❌ Erro de conexão");
    } finally {
      setProcessandoSaque(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("parceiro_token");
    localStorage.removeItem("parceiroEmail");
    localStorage.removeItem("parceiroNome");
    localStorage.removeItem("parceiroId");
    localStorage.removeItem("isParceiro");
    document.cookie =
      "parceiro_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "isParceiro=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/parceiro-login");
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { color: string; icon: React.ElementType; label: string }
    > = {
      pendente: { color: "yellow", icon: FaClock, label: "Pendente" },
      ativo: { color: "green", icon: FaCheckCircle, label: "Ativo" },
      trial: { color: "blue", icon: FaClock, label: "Trial" },
      cancelado: { color: "red", icon: FaTimesCircle, label: "Cancelado" },
      aprovado: { color: "blue", icon: FaCheck, label: "Aprovado" },
      pago: { color: "green", icon: FaCheckCircle, label: "Pago" },
      rejeitado: { color: "red", icon: FaTimesCircle, label: "Rejeitado" },
    };

    const badge = badges[status] || badges.pendente;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-700`}
      >
        <badge.icon className="text-xs" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-linear-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <FaHandshake className="text-2xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Área do Parceiro</h1>
                <p className="text-emerald-100 text-sm">
                  Olá, {parceiro?.nome || "Parceiro"}!
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: FaChartLine },
              { id: "indicacoes", label: "Indicações", icon: FaUsers },
              {
                id: "assinaturas",
                label: "Assinaturas",
                icon: FaMoneyBillWave,
              },
              { id: "saques", label: "Saques", icon: FaWallet },
              { id: "config", label: "Configurações", icon: FaCog },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gray-50 text-emerald-700"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniStatCard
                icon={FaMoneyBillWave}
                title="Saldo Disponível"
                value={formatCurrency(parceiro?.saldoDisponivel || 0)}
                color="green"
                subtitle="Disponível para saque"
              />
              <MiniStatCard
                icon={FaClock}
                title="Saldo Pendente"
                value={formatCurrency(parceiro?.saldoPendente || 0)}
                color="yellow"
                subtitle="Aguardando confirmação"
              />
              <MiniStatCard
                icon={FaChartLine}
                title="Total Ganhos"
                value={formatCurrency(parceiro?.totalGanhos || 0)}
                color="emerald"
                subtitle="Desde o início"
              />
              <MiniStatCard
                icon={FaUsers}
                title="Indicações Ativas"
                value={`${parceiro?.indicacoesAtivas || 0}`}
                color="blue"
                subtitle={`de ${parceiro?.totalIndicacoes || 0} total`}
              />
            </div>

            {/* Link de Indicação */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaLink className="text-emerald-500" />
                Seu Link de Indicação
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm break-all">
                  {parceiro?.linkIndicacao || "Carregando..."}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copiarLink}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      copiado
                        ? "bg-green-500 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {copiado ? <FaCheck /> : <FaCopy />}
                    {copiado ? "Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={compartilharWhatsApp}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FaWhatsapp />
                    <span className="hidden sm:inline">Compartilhar</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaPercent className="text-emerald-500" />
                  Comissão:{" "}
                  <strong>{parceiro?.percentualComissao || 10}%</strong>
                </span>
                <span className="flex items-center gap-1">
                  <FaGift className="text-emerald-500" />
                  Código: <strong>{parceiro?.codigoIndicacao || "..."}</strong>
                </span>
              </div>
            </div>

            {/* Solicitar Saque */}
            <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Solicitar Saque</h3>
                  <p className="text-emerald-100">
                    Saldo disponível:{" "}
                    <strong>
                      {formatCurrency(parceiro?.saldoDisponivel || 0)}
                    </strong>
                  </p>
                </div>
                <button
                  onClick={() => setShowSaqueModal(true)}
                  disabled={(parceiro?.saldoDisponivel || 0) < 50}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaWallet className="inline mr-2" />
                  Solicitar Saque
                </button>
              </div>
              {(parceiro?.saldoDisponivel || 0) < 50 && (
                <p className="mt-3 text-sm text-emerald-200">
                  * Valor mínimo para saque: R$ 50,00
                </p>
              )}
            </div>

            {/* Últimas Indicações */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaHistory className="text-emerald-500" />
                  Últimas Indicações
                </h2>
                <button
                  onClick={() => setActiveTab("indicacoes")}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Ver todas →
                </button>
              </div>

              {indicacoes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaUsers className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma indicação ainda</p>
                  <p className="text-sm mt-1">
                    Compartilhe seu link e comece a ganhar!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">Cliente</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-right">Comissão</th>
                        <th className="px-3 py-2 text-left">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {indicacoes.slice(0, 5).map((indicacao) => (
                        <tr key={indicacao.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-800">
                              {indicacao.nomeCliente}
                            </div>
                            <div className="text-xs text-gray-500">
                              {indicacao.emailCliente}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {getStatusBadge(indicacao.status)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-green-600">
                            {indicacao.comissao
                              ? formatCurrency(indicacao.comissao)
                              : "-"}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {formatDate(indicacao.dataIndicacao)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicações Tab */}
        {activeTab === "indicacoes" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUsers className="text-emerald-500" />
                Todas as Indicações ({indicacoes.length})
              </h2>

              {indicacoes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaUsers className="text-5xl mx-auto mb-3 text-gray-300" />
                  <p className="text-lg">Nenhuma indicação ainda</p>
                  <p className="text-sm mt-2">
                    Compartilhe seu link de indicação e comece a ganhar
                    comissões!
                  </p>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Ver meu link
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">Cliente</th>
                        <th className="px-3 py-2 text-left">Contato</th>
                        <th className="px-3 py-2 text-center">Plano</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-right">Comissão</th>
                        <th className="px-3 py-2 text-left">Data Indicação</th>
                        <th className="px-3 py-2 text-left">Data Conversão</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {indicacoes.map((indicacao) => (
                        <tr key={indicacao.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-800">
                              {indicacao.nomeCliente}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-xs text-gray-600">
                              {indicacao.emailCliente}
                            </div>
                            {indicacao.telefoneCliente && (
                              <div className="text-xs text-gray-500">
                                {indicacao.telefoneCliente}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                              {indicacao.plano || "-"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {getStatusBadge(indicacao.status)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {indicacao.comissao ? (
                              <span className="font-bold text-green-600">
                                {formatCurrency(indicacao.comissao)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {formatDate(indicacao.dataIndicacao)}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {indicacao.dataConversao
                              ? formatDate(indicacao.dataConversao)
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assinaturas Tab */}
        {activeTab === "assinaturas" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-emerald-500" />
                Pagamentos de Assinaturas ({assinaturas.length})
              </h2>

              {assinaturas.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaMoneyBillWave className="text-5xl mx-auto mb-3 text-gray-300" />
                  <p className="text-lg">Nenhuma assinatura encontrada</p>
                  <p className="text-sm mt-2">
                    Aguarde suas indicações gerarem assinaturas pagas
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">Cliente</th>
                        <th className="px-3 py-2 text-left">Contato</th>
                        <th className="px-3 py-2 text-center">Plano</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-right">
                          Valor Assinatura
                        </th>
                        <th className="px-3 py-2 text-right">Comissão</th>
                        <th className="px-3 py-2 text-left">Data Assinatura</th>
                        <th className="px-3 py-2 text-left">Data Pagamento</th>
                        <th className="px-3 py-2 text-center">Forma Pgto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assinaturas.map((assinatura) => (
                        <tr key={assinatura.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-800">
                              {assinatura.nomeCliente}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-xs text-gray-600">
                              {assinatura.emailCliente}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              {assinatura.plano || "-"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {getStatusBadge(assinatura.status)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-gray-800">
                            {formatCurrency(assinatura.valorAssinatura)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <span className="font-bold text-green-600">
                              {formatCurrency(assinatura.comissao)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {formatDate(assinatura.dataAssinatura)}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {assinatura.dataPagamento
                              ? formatDate(assinatura.dataPagamento)
                              : "-"}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-xs text-gray-600">
                              {assinatura.formaPagamento || "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saques Tab */}
        {activeTab === "saques" && (
          <div className="space-y-4">
            {/* Resumo de Saques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniStatCard
                icon={FaWallet}
                title="Disponível"
                value={formatCurrency(parceiro?.saldoDisponivel || 0)}
                color="green"
              />
              <MiniStatCard
                icon={FaClock}
                title="Pendente"
                value={formatCurrency(
                  saques
                    .filter((s) => s.status === "pendente")
                    .reduce((a, s) => a + s.valor, 0),
                )}
                color="yellow"
              />
              <MiniStatCard
                icon={FaCheckCircle}
                title="Total Sacado"
                value={formatCurrency(
                  saques
                    .filter((s) => s.status === "pago")
                    .reduce((a, s) => a + s.valor, 0),
                )}
                color="emerald"
              />
              <MiniStatCard
                icon={FaHistory}
                title="Total Saques"
                value={saques.length}
                color="blue"
              />
            </div>

            {/* Histórico de Saques */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaHistory className="text-emerald-500" />
                  Histórico de Saques
                </h2>
                <button
                  onClick={() => setShowSaqueModal(true)}
                  disabled={(parceiro?.saldoDisponivel || 0) < 50}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Novo Saque
                </button>
              </div>

              {saques.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaWallet className="text-5xl mx-auto mb-3 text-gray-300" />
                  <p className="text-lg">Nenhum saque realizado</p>
                  <p className="text-sm mt-2">
                    Acumule saldo e solicite seu primeiro saque!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          Data Solicitação
                        </th>
                        <th className="px-3 py-2 text-right">Valor</th>
                        <th className="px-3 py-2 text-center">Método</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-left">Data Pagamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {saques.map((saque) => (
                        <tr key={saque.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-600">
                            {formatDate(saque.dataSolicitacao)}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-gray-800">
                            {formatCurrency(saque.valor)}
                          </td>
                          <td className="px-3 py-2 text-center text-gray-600">
                            {saque.metodoPagamento}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {getStatusBadge(saque.status)}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {saque.dataPagamento
                              ? formatDate(saque.dataPagamento)
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configurações Tab */}
        {activeTab === "config" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCog className="text-emerald-500" />
                Dados do Parceiro
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={parceiro?.nome || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={parceiro?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={parceiro?.telefone || "-"}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Indicação
                  </label>
                  <input
                    type="text"
                    value={parceiro?.codigoIndicacao || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentual de Comissão
                  </label>
                  <input
                    type="text"
                    value={`${parceiro?.percentualComissao || 10}%`}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parceiro Desde
                  </label>
                  <input
                    type="text"
                    value={
                      parceiro?.createdAt ? formatDate(parceiro.createdAt) : "-"
                    }
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Dados Bancários */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaWallet className="text-emerald-500" />
                Dados Bancários para Saque
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chave PIX
                  </label>
                  <input
                    type="text"
                    value={parceiro?.chavePix || "-"}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco
                  </label>
                  <input
                    type="text"
                    value={parceiro?.banco || "-"}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agência
                  </label>
                  <input
                    type="text"
                    value={parceiro?.agencia || "-"}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conta
                  </label>
                  <input
                    type="text"
                    value={parceiro?.conta || "-"}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                * Para atualizar seus dados, entre em contato com o suporte.
              </p>
            </div>

            {/* Ajuda */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <FaQuestionCircle />
                Precisa de Ajuda?
              </h3>
              <p className="text-emerald-700 text-sm mb-4">
                Entre em contato conosco para dúvidas sobre o programa de
                parceiros, comissões ou saques.
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || "5511999999999"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <FaWhatsapp />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Saque */}
      {showSaqueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Solicitar Saque
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Saldo disponível:{" "}
                <strong className="text-green-600">
                  {formatCurrency(parceiro?.saldoDisponivel || 0)}
                </strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor do Saque (R$)
              </label>
              <input
                type="number"
                value={valorSaque}
                onChange={(e) => setValorSaque(e.target.value)}
                min="50"
                max={parceiro?.saldoDisponivel || 0}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0,00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Valor mínimo: R$ 50,00
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Dados para pagamento:</strong>
              </p>
              <p className="text-sm text-gray-800">
                PIX: {parceiro?.chavePix || "Não cadastrado"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaqueModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={solicitarSaque}
                disabled={processandoSaque}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50"
              >
                {processandoSaque ? (
                  <>
                    <FaSpinner className="inline animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Saque"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

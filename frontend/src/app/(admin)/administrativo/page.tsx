"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserShield,
  FaUsers,
  FaChartBar,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaUserFriends,
  FaReceipt,
  FaWallet,
  FaCog,
  FaFileAlt,
  FaPaperPlane,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaFilter,
  FaSync,
  FaSearch,
  FaBan,
  FaCheck,
  FaCalendarAlt,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaTachometerAlt,
  FaHistory,
  FaServer,
  FaCreditCard,
  FaWhatsapp,
  FaCheckSquare,
  FaRegSquare,
  FaBell,
  FaPlus,
} from "react-icons/fa";

type TabType =
  | "dashboard"
  | "usuarios"
  | "logs"
  | "cobrancas"
  | "despesas"
  | "banners"
  | "whatsapp";

interface Usuario {
  id: string;
  email: string;
  nome: string | null;
  cnpjCpf: string | null;
  whatsapp: string | null;
  nomeCondominio: string | null;
  quantidadeApartamentos: number | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

interface Assinatura {
  id: string;
  cadastroId: string;
  cliente: {
    nome: string | null;
    email: string;
    whatsapp: string | null;
    nomeCondominio: string | null;
  };
  plano: string;
  valor: number;
  status: string;
  dataInicio: string;
  dataVencimento: string | null;
  dataCancelamento: string | null;
  motivosCancelamento: string | null;
  formaPagamento: string;
  mercadopagoSubscriptionId: string | null;
  mercadopagoPaymentId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface LogItem {
  id: string;
  nivel: string;
  categoria: string;
  mensagem: string;
  detalhes: string | null;
  email: string | null;
  data: string;
}

interface DespesaSistema {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  dataLancamento: string;
  dataPagamento?: string;
  status: "pendente" | "pago";
  observacao?: string;
  createdAt: string;
}

// Componente de Card Estatístico Premium
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend,
  trendValue,
  loading = false,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  loading?: boolean;
}) => {
  const colorClasses: Record<
    string,
    { bg: string; icon: string; border: string }
  > = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-500",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      border: "border-green-500",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      border: "border-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      border: "border-orange-500",
    },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-500" },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
      border: "border-yellow-500",
    },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      border: "border-indigo-500",
    },
    gray: {
      bg: "bg-gray-50",
      icon: "text-gray-600",
      border: "border-gray-500",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-l-4 ${colors.border} p-5 hover:shadow-md transition-all duration-300 group`}
    >
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <FaSpinner className="animate-spin text-gray-400 text-2xl" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div
              className={`${colors.bg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className={`text-xl ${colors.icon}`} />
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {trend === "up" ? (
                  <FaArrowUp />
                ) : trend === "down" ? (
                  <FaArrowDown />
                ) : null}
                {trendValue}
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Componente de Card Estatístico Compacto (Mini)
const MiniStatCard = ({
  icon: Icon,
  title,
  value,
  color,
  loading = false,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
  loading?: boolean;
}) => {
  const colorClasses: Record<
    string,
    { bg: string; icon: string; text: string }
  > = {
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      text: "text-green-700",
    },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
      text: "text-yellow-700",
    },
    red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      text: "text-indigo-700",
    },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div
      className={`${colors.bg} rounded-lg px-4 py-3 flex items-center gap-3`}
    >
      {loading ? (
        <FaSpinner className="animate-spin text-gray-400" />
      ) : (
        <>
          <Icon className={`text-lg ${colors.icon}`} />
          <div>
            <p className={`text-lg font-bold ${colors.text}`}>{value}</p>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </>
      )}
    </div>
  );
};

// Componente de Badge de Status
const StatusBadge = ({ status }: { status: string }) => {
  // Normalizar status para: ativa, pendente, cancelada ou inativo
  const normalizeStatus = (s: string): string => {
    const lower = s?.toLowerCase();
    if (lower === "ativa" || lower === "ativo" || lower === "active")
      return "ativa";
    if (lower === "pendente") return "pendente";
    if (lower === "inativo") return "inativo";
    // Tudo mais (cancelada, suspensa, expirada) é cancelada
    return "cancelada";
  };

  const normalizedStatus = normalizeStatus(status);

  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: React.ElementType; label: string }
  > = {
    ativa: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: FaCheckCircle,
      label: "Ativa",
    },
    pendente: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: FaClock,
      label: "Pendente",
    },
    cancelada: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: FaTimes,
      label: "Cancelada",
    },
    inativo: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: FaTimes,
      label: "Inativo",
    },
  };

  const config = statusConfig[normalizedStatus] || statusConfig.pendente;
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <IconComponent className="text-[10px]" />
      {config.label}
    </span>
  );
};

// Componente de Loading Skeleton
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Componente de Tabela com Loading
const TableSkeleton = ({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-10 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");

  // Estados de dados
  const [stats, setStats] = useState<any>(null);
  const [financeiro, setFinanceiro] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosRecentes, setUsuariosRecentes] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [configuracoes, setConfiguracoes] = useState<any[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [logStats, setLogStats] = useState<any[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [assinaturasStats, setAssinaturasStats] = useState<any>(null);

  // Estados de paginação
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalAssinaturas, setTotalAssinaturas] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);

  // Estados de banners
  const [banners, setBanners] = useState<{ id: string; imagemUrl: string; ordem: number }[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerMsg, setBannerMsg] = useState("");

  // Estados de WhatsApp admin
  type WaStatus = "not_configured" | "connecting" | "open" | "close" | "error";
  const [waStatus, setWaStatus] = useState<WaStatus>("not_configured");
  const [waInstanceName, setWaInstanceName] = useState<string | null>(null);
  const [waQrCode, setWaQrCode] = useState<string | null>(null);
  const [waLoading, setWaLoading] = useState(false);
  const [waLoadingStatus, setWaLoadingStatus] = useState(false);
  const [waMsg, setWaMsg] = useState<string | null>(null);
  const [waResetting, setWaResetting] = useState(false);
  const waPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Estados de loading por seção
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingAssinaturas, setLoadingAssinaturas] = useState(false);
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Estados de filtros
  const [usuarioSearch, setUsuarioSearch] = useState("");
  const [usuarioStatusFilter, setUsuarioStatusFilter] = useState("");
  const [assinaturaStatusFilter, setAssinaturaStatusFilter] = useState("");
  const [logFilters, setLogFilters] = useState({ nivel: "", categoria: "" });

  // Estados de edição
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [sendingCobrancas, setSendingCobrancas] = useState(false);

  // Estados de administradores
  const [administradores, setAdministradores] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [novoAdmin, setNovoAdmin] = useState({
    email: "",
    nome: "",
    senha: "",
  });
  const [showNovoAdminForm, setShowNovoAdminForm] = useState(false);

  // Modal de criação unificado (cliente ou admin)
  const [showNovoUsuarioModal, setShowNovoUsuarioModal] = useState(false);
  const [novoUsuarioTipo, setNovoUsuarioTipo] = useState<"cliente" | "admin">("cliente");
  const [novoUsuario, setNovoUsuario] = useState({ email: "", nome: "", senha: "" });
  const [criandoUsuario, setCriandoUsuario] = useState(false);

  // Filtro de tipo na aba usuários
  const [usuarioTipoFilter, setUsuarioTipoFilter] = useState<"todos" | "cliente" | "admin">("todos");

  // Estados de notificações/cobranças
  const [notificacaoTipo, setNotificacaoTipo] = useState({
    email: true,
    whatsapp: true,
  });
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>(
    [],
  );
  const [enviandoNotificacoes, setEnviandoNotificacoes] = useState(false);
  const [resultadoEnvio, setResultadoEnvio] = useState<{
    emailsEnviados: number;
    whatsappEnviados: number;
    erros: string[];
  } | null>(null);

  // Campos editáveis de cobrança
  const [valorCobranca, setValorCobranca] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [agendamentoAtivo, setAgendamentoAtivo] = useState(false);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");

  // Estados de despesas do sistema
  const [despesasSistema, setDespesasSistema] = useState<DespesaSistema[]>([]);
  const [loadingDespesas, setLoadingDespesas] = useState(false);
  const [showNovaDespesaForm, setShowNovaDespesaForm] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState({
    descricao: "",
    valor: "",
    categoria: "infraestrutura",
    dataLancamento: new Date().toISOString().split("T")[0],
    observacao: "",
  });
  const [despesaFiltroStatus, setDespesaFiltroStatus] = useState("");
  const [despesaFiltroCategoria, setDespesaFiltroCategoria] = useState("");

  // Estados de UI
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const getToken = () => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };
  const getBackendUrl = () =>
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateShort = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  const checkAdminAndLoadData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const backendUrl = getBackendUrl();
      const checkResponse = await fetch(`${backendUrl}/api/admin/check-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!checkResponse.ok) {
        throw new Error("Não autorizado");
      }

      const checkData = await checkResponse.json();
      if (!checkData.isAdmin) {
        alert("Acesso negado! Você não tem permissão de administrador.");
        router.push("/dashboard");
        return;
      }

      setAdminEmail(checkData.email || localStorage.getItem("userEmail") || "");
      setAdminName(localStorage.getItem("userName") || "Administrador");
      await loadDashboardData();
    } catch (error) {
      console.error("Erro:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAndLoadData();
  }, [checkAdminAndLoadData]);

  const loadDashboardData = async () => {
    setLoadingStats(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const [
        statsRes,
        financeiroRes,
        recentesRes,
        adminsRes,
        assinaturasStatsRes,
      ] = await Promise.all([
        fetch(`${backendUrl}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${backendUrl}/api/admin/financeiro`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${backendUrl}/api/admin/usuarios-recentes?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${backendUrl}/api/admin/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${backendUrl}/api/admin/assinaturas/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (financeiroRes.ok) setFinanceiro(await financeiroRes.json());
      if (recentesRes.ok) setUsuariosRecentes(await recentesRes.json());
      if (adminsRes.ok) setAdmins(await adminsRes.json());
      if (assinaturasStatsRes.ok)
        setAssinaturasStats(await assinaturasStatsRes.json());

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsuarios = async () => {
    setLoadingUsuarios(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/usuarios?pageSize=1000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.data || []);
        setTotalUsuarios(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const loadAssinaturas = async () => {
    setLoadingAssinaturas(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (assinaturaStatusFilter)
        params.append("status", assinaturaStatusFilter);

      const res = await fetch(`${backendUrl}/api/admin/assinaturas?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📡 Resposta assinaturas:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("📦 Dados assinaturas:", data);
        console.log("📋 Lista assinaturas:", data.data);
        setAssinaturas(data.data || []);
        setTotalAssinaturas(data.pagination?.total || 0);
      } else {
        const errorText = await res.text();
        console.error("❌ Erro na resposta:", res.status, errorText);
      }
    } catch (error) {
      console.error("Erro ao carregar assinaturas:", error);
    } finally {
      setLoadingAssinaturas(false);
    }
  };

  const loadAssinaturasStats = async () => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/assinaturas/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAssinaturasStats(await res.json());
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  // Função para atualizar todos os dados
  const refreshAllData = async () => {
    await loadDashboardData();
    // Recarrega dados da tab ativa se necessário
    switch (activeTab) {
      case "usuarios":
        await loadUsuarios();
        break;
      case "logs":
        await loadLogs();
        break;
    }
  };

  const loadConfiguracoes = async () => {
    setLoadingConfigs(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/configuracoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setConfiguracoes(await res.json());
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoadingConfigs(false);
    }
  };

  // =====================================================
  // FUNÇÕES DE GERENCIAMENTO DE ADMINISTRADORES
  // =====================================================

  const loadAdministradores = async () => {
    setLoadingAdmins(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/administradores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdministradores(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar administradores:", error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const criarAdministrador = async () => {
    if (!novoAdmin.email) {
      alert("Email é obrigatório");
      return;
    }

    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/administradores`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoAdmin),
      });

      if (res.ok) {
        alert("✅ Administrador criado com sucesso!");
        setNovoAdmin({ email: "", nome: "", senha: "" });
        setShowNovoAdminForm(false);
        await loadAdministradores();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao criar administrador"}`);
      }
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
      alert("❌ Erro de conexão");
    }
  };

  const criarUsuario = async () => {
    if (!novoUsuario.email || !novoUsuario.senha) {
      alert("Email e senha são obrigatórios");
      return;
    }
    setCriandoUsuario(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const url = novoUsuarioTipo === "admin"
        ? `${backendUrl}/api/admin/administradores`
        : `${backendUrl}/api/admin/usuarios`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      if (res.ok) {
        setShowNovoUsuarioModal(false);
        setNovoUsuario({ email: "", nome: "", senha: "" });
        await Promise.all([loadUsuarios(), loadAdministradores()]);
      } else {
        const err = await res.json();
        alert(`❌ ${err.error || "Erro ao criar usuário"}`);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("❌ Erro de conexão");
    } finally {
      setCriandoUsuario(false);
    }
  };

  const alterarStatusUsuario = async (id: string, novoStatus: string) => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/usuarios/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (res.ok) {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: novoStatus } : u))
        );
      } else {
        const err = await res.json();
        alert(`❌ ${err.error || "Erro ao alterar status"}`);
      }
    } catch {
      alert("❌ Erro de conexão");
    }
  };

  const toggleAdminStatus = async (id: string, ativo: boolean) => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/administradores/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Ativo: ativo }),
        },
      );

      if (res.ok) {
        await loadAdministradores();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao atualizar status"}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const definirSenhaAdmin = async (id: string) => {
    const novaSenha = prompt("Digite a nova senha (mínimo 6 caracteres):");
    if (!novaSenha || novaSenha.length < 6) {
      alert("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/administradores/${id}/senha`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ NovaSenha: novaSenha }),
        },
      );

      if (res.ok) {
        alert("✅ Senha atualizada com sucesso!");
        await loadAdministradores();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao atualizar senha"}`);
      }
    } catch (error) {
      console.error("Erro ao definir senha:", error);
    }
  };

  const excluirAdministrador = async (id: string, email: string) => {
    if (
      !confirm(
        `⚠️ Excluir administrador ${email}?\nEssa ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/administradores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Administrador excluído com sucesso!");
        await loadAdministradores();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao excluir"}`);
      }
    } catch (error) {
      console.error("Erro ao excluir administrador:", error);
    }
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (logFilters.nivel) params.append("nivel", logFilters.nivel);
      if (logFilters.categoria)
        params.append("categoria", logFilters.categoria);

      const res = await fetch(`${backendUrl}/api/admin/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
        setLogStats(data.stats || []);
        setTotalLogs(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const updateAssinaturaStatus = async (
    id: string,
    status: string,
    motivo?: string,
  ) => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/assinaturas/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Status: status, Motivo: motivo }),
        },
      );

      if (res.ok) {
        await Promise.all([loadAssinaturas(), loadAssinaturasStats()]);
        alert(`✅ Status atualizado para "${status}" com sucesso!`);
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao atualizar status"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão ao atualizar status");
    }
  };

  const updateConfiguracao = async (chave: string, valor: string) => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/configuracoes/${chave}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Valor: valor }),
        },
      );

      if (res.ok) {
        await loadConfiguracoes();
        setEditingConfig(null);
        alert("✅ Configuração atualizada com sucesso!");
      } else {
        alert("❌ Erro ao atualizar configuração");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão");
    }
  };

  const enviarCobrancas = async () => {
    if (
      !confirm(
        "⚠️ Tem certeza que deseja enviar cobranças para TODOS os usuários ativos?",
      )
    )
      return;

    setSendingCobrancas(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/enviar-cobrancas`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ ${data.cobrancasCriadas} cobranças enviadas com sucesso!`);
        await loadLogs();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao enviar cobranças"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão");
    } finally {
      setSendingCobrancas(false);
    }
  };

  // Função para enviar notificações para usuários pendentes
  const enviarNotificacoesPendentes = async () => {
    // Valida se há usuários selecionados
    const pendentes = usuarios.filter((u) => u.status === "pendente");
    const selecionados =
      usuariosSelecionados.length > 0
        ? usuarios.filter((u) => usuariosSelecionados.includes(u.id))
        : pendentes;

    if (selecionados.length === 0) {
      alert("⚠️ Nenhum usuário pendente para notificar");
      return;
    }

    if (!notificacaoTipo.email && !notificacaoTipo.whatsapp) {
      alert(
        "⚠️ Selecione pelo menos um tipo de notificação (Email ou WhatsApp)",
      );
      return;
    }

    // Validar valor da cobrança
    const valorNum = parseFloat(valorCobranca.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) {
      alert("⚠️ Informe um valor de cobrança válido");
      return;
    }

    // Validar data de vencimento
    if (!dataVencimento) {
      alert("⚠️ Informe a data de vencimento");
      return;
    }

    const tipoMsg = [];
    if (notificacaoTipo.email) tipoMsg.push("email");
    if (notificacaoTipo.whatsapp) tipoMsg.push("WhatsApp");

    if (
      !confirm(
        `⚠️ Enviar ${tipoMsg.join(" e ")} para ${selecionados.length} usuário(s) pendente(s)?\n\nValor: R$ ${valorNum.toFixed(2)}\nVencimento: ${new Date(dataVencimento + "T12:00:00").toLocaleDateString("pt-BR")}`,
      )
    ) {
      return;
    }

    setEnviandoNotificacoes(true);
    setResultadoEnvio(null);
    const token = getToken();
    const backendUrl = getBackendUrl();

    // Usar valores editáveis
    const dataVenc = new Date(dataVencimento + "T12:00:00");

    let emailsEnviados = 0;
    let whatsappEnviados = 0;
    const erros: string[] = [];

    for (const usuario of selecionados) {
      try {
        // Enviar Email
        if (notificacaoTipo.email && usuario.email) {
          const resEmail = await fetch(
            `${backendUrl}/api/notificacoes/email/cobranca`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: usuario.email,
                nomeDevedor: usuario.nome || usuario.email,
                valor: valorNum,
                vencimento: dataVenc.toISOString(),
              }),
            },
          );
          if (resEmail.ok) {
            emailsEnviados++;
          } else {
            erros.push(`Email falhou para ${usuario.email}`);
          }
        }

        // Enviar WhatsApp
        if (notificacaoTipo.whatsapp && usuario.whatsapp) {
          const resWhatsApp = await fetch(
            `${backendUrl}/api/notificacoes/whatsapp/cobranca`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                telefone: usuario.whatsapp,
                nomeDevedor: usuario.nome || usuario.email,
                valor: valorNum,
                vencimento: dataVenc.toISOString(),
              }),
            },
          );
          if (resWhatsApp.ok) {
            whatsappEnviados++;
          } else {
            erros.push(`WhatsApp falhou para ${usuario.whatsapp}`);
          }
        }
      } catch (error) {
        erros.push(`Erro com ${usuario.email}: ${error}`);
      }
    }

    setResultadoEnvio({ emailsEnviados, whatsappEnviados, erros });
    setUsuariosSelecionados([]);
    setEnviandoNotificacoes(false);

    // Recarregar logs
    await loadLogs();
  };

  // Toggle seleção de usuário
  const toggleUsuarioSelecionado = (id: string) => {
    setUsuariosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  // Selecionar todos os pendentes
  const selecionarTodosPendentes = () => {
    const pendentes = usuarios.filter((u) => u.status === "pendente");
    if (usuariosSelecionados.length === pendentes.length) {
      setUsuariosSelecionados([]);
    } else {
      setUsuariosSelecionados(pendentes.map((u) => u.id));
    }
  };

  const limparLogsAntigos = async () => {
    if (
      !confirm(
        "⚠️ Deseja remover logs com mais de 90 dias? Esta ação não pode ser desfeita.",
      )
    )
      return;

    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/logs/limpar?dias=90`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ ${data.message}`);
        await loadLogs();
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    switch (tab) {
      case "usuarios":
        if (usuarios.length === 0) await loadUsuarios();
        if (administradores.length === 0) await loadAdministradores();
        break;
      case "logs":
        if (logs.length === 0) await loadLogs();
        break;
      case "cobrancas":
        // Carregar usuários e configurações para a aba de cobranças
        if (usuarios.length === 0) await loadUsuarios();
        if (configuracoes.length === 0) await loadConfiguracoes();
        // Inicializar valor da cobrança com configuração do sistema
        const valorConfig = configuracoes.find(
          (c) => c.chave === "VALOR_MENSAL_SISTEMA",
        );
        if (valorConfig && !valorCobranca) {
          setValorCobranca(valorConfig.valor || "");
        }
        // Inicializar data de vencimento padrão (próximo mês, dia 5)
        if (!dataVencimento) {
          const hoje = new Date();
          const diaVencimentoConfig = configuracoes.find(
            (c) => c.chave === "DIA_VENCIMENTO",
          );
          const dia = parseInt(diaVencimentoConfig?.valor || "5");
          let dataVenc = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
          if (dataVenc < hoje) {
            dataVenc = new Date(hoje.getFullYear(), hoje.getMonth() + 1, dia);
          }
          setDataVencimento(dataVenc.toISOString().split("T")[0]);
        }
        setResultadoEnvio(null);
        break;
      case "despesas":
        if (despesasSistema.length === 0) await loadDespesasSistema();
        break;
      case "banners":
        await loadBanners();
        break;
      case "whatsapp":
        await loadWaStatus();
        break;
    }
  };

  const loadWaStatus = async () => {
    setWaLoadingStatus(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/whatsapp-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data.status);
        setWaInstanceName(data.instanceName);
      }
    } catch {
      setWaStatus("error");
    } finally {
      setWaLoadingStatus(false);
    }
  };

  const handleWaConnect = async () => {
    setWaLoading(true);
    setWaMsg(null);
    setWaQrCode(null);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/whatsapp-connect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWaQrCode(data.qrCode);
        setWaStatus("connecting");
        setWaInstanceName(data.instanceName);
        setWaMsg("Escaneie o QR Code com o WhatsApp institucional.");
        startWaPoll(token, backendUrl);
      } else {
        const err = await res.json();
        setWaMsg(`❌ ${err.message}`);
      }
    } catch {
      setWaMsg("❌ Erro ao conectar.");
    } finally {
      setWaLoading(false);
    }
  };

  const handleWaReconnect = async () => {
    setWaLoading(true);
    setWaMsg(null);
    setWaQrCode(null);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/whatsapp-reconnect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWaQrCode(data.qrCode);
        setWaStatus("connecting");
        setWaMsg("Escaneie o novo QR Code para reconectar.");
        startWaPoll(token, backendUrl);
      } else {
        const err = await res.json();
        setWaMsg(`❌ ${err.message}`);
      }
    } catch {
      setWaMsg("❌ Erro ao reconectar.");
    } finally {
      setWaLoading(false);
    }
  };

  const handleWaDisconnect = async () => {
    if (!confirm("Deseja desconectar a instância institucional?")) return;
    setWaLoading(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/whatsapp-disconnect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWaStatus("close");
        setWaQrCode(null);
        setWaMsg("Instância desconectada.");
        stopWaPoll();
      } else {
        const err = await res.json();
        setWaMsg(`❌ ${err.message}`);
      }
    } catch {
      setWaMsg("❌ Erro ao desconectar.");
    } finally {
      setWaLoading(false);
    }
  };

  const startWaPoll = (token: string, backendUrl: string) => {
    stopWaPoll();
    waPollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/whatsapp-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setWaStatus(data.status);
        if (data.status === "open") {
          setWaQrCode(null);
          setWaMsg("✅ WhatsApp institucional conectado!");
          stopWaPoll();
        }
      } catch { /* ignora */ }
    }, 3000);
  };

  const stopWaPoll = () => {
    if (waPollRef.current) {
      clearInterval(waPollRef.current);
      waPollRef.current = null;
    }
  };

  const handleWaReset = async () => {
    if (!confirm("Isso vai apagar o registro local da instância. Você precisará escanear o QR Code novamente. Continuar?")) return;
    setWaResetting(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/whatsapp-instance`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWaStatus("not_configured");
        setWaQrCode(null);
        setWaInstanceName(null);
        setWaMsg("Registro apagado. Clique em Conectar para iniciar nova sessão.");
        stopWaPoll();
      } else {
        const err = await res.json();
        setWaMsg(`❌ ${err.message}`);
      }
    } catch {
      setWaMsg("❌ Erro ao resetar.");
    } finally {
      setWaResetting(false);
    }
  };

  const loadBanners = async () => {
    setLoadingBanners(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/banner/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBanners(await res.json());
      } else {
        setBannerMsg("Erro ao carregar banners");
      }
    } catch {
      setBannerMsg("Erro ao carregar banners");
    } finally {
      setLoadingBanners(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    setBannerMsg("");
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const formData = new FormData();
      formData.append("arquivo", file);
      const res = await fetch(`${backendUrl}/api/banner`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setBannerMsg("Banner adicionado com sucesso!");
        await loadBanners();
      } else {
        const err = await res.json().catch(() => ({}));
        setBannerMsg((err as any).message || "Erro ao fazer upload");
      }
    } catch {
      setBannerMsg("Erro ao fazer upload");
    } finally {
      setUploadingBanner(false);
      e.target.value = "";
    }
  };

  const handleBannerDelete = async (id: string) => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/banner/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        setBannerMsg("Banner removido.");
      } else {
        setBannerMsg("Erro ao remover banner");
      }
    } catch {
      setBannerMsg("Erro ao remover banner");
    }
  };

  // Funções de despesas do sistema
  const loadDespesasSistema = async () => {
    setLoadingDespesas(true);
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/despesas-sistema`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDespesasSistema(data);
      }
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    } finally {
      setLoadingDespesas(false);
    }
  };

  const criarDespesaSistema = async () => {
    if (!novaDespesa.descricao || !novaDespesa.valor) {
      alert("⚠️ Preencha descrição e valor");
      return;
    }

    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/admin/despesas-sistema`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao: novaDespesa.descricao,
          valor: parseFloat(novaDespesa.valor.replace(",", ".")),
          categoria: novaDespesa.categoria,
          dataLancamento: novaDespesa.dataLancamento,
          observacao: novaDespesa.observacao || null,
        }),
      });

      if (res.ok) {
        alert("✅ Despesa cadastrada com sucesso!");
        setShowNovaDespesaForm(false);
        setNovaDespesa({
          descricao: "",
          valor: "",
          categoria: "infraestrutura",
          dataLancamento: new Date().toISOString().split("T")[0],
          observacao: "",
        });
        await loadDespesasSistema();
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error || "Erro ao cadastrar despesa"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão");
    }
  };

  const marcarDespesaPaga = async (id: string) => {
    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/despesas-sistema/${id}/pagar`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        await loadDespesasSistema();
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const excluirDespesa = async (id: string) => {
    if (!confirm("⚠️ Deseja excluir esta despesa?")) return;

    const token = getToken();
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/despesas-sistema/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        await loadDespesasSistema();
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // Categorias de despesas
  const categoriasDespesa = [
    { id: "infraestrutura", label: "Infraestrutura", color: "blue" },
    { id: "marketing", label: "Marketing", color: "purple" },
    { id: "pessoal", label: "Pessoal", color: "green" },
    { id: "software", label: "Software/Licenças", color: "indigo" },
    { id: "impostos", label: "Impostos", color: "red" },
    { id: "outros", label: "Outros", color: "gray" },
  ];

  // Filtrar despesas
  const despesasFiltradas = despesasSistema.filter((d) => {
    const matchesStatus =
      !despesaFiltroStatus || d.status === despesaFiltroStatus;
    const matchesCategoria =
      !despesaFiltroCategoria || d.categoria === despesaFiltroCategoria;
    return matchesStatus && matchesCategoria;
  });

  // Totais de despesas
  const totalDespesasPendentes = despesasSistema
    .filter((d) => d.status === "pendente")
    .reduce((acc, d) => acc + d.valor, 0);
  const totalDespesasPagas = despesasSistema
    .filter((d) => d.status === "pago")
    .reduce((acc, d) => acc + d.valor, 0);

  // Mescla clientes + admins em lista unificada
  const todosUsuarios = [
    ...usuarios.map((u) => ({ ...u, tipo: "cliente" as const })),
    ...administradores.map((a) => ({
      id: a.id,
      nome: a.nome,
      email: a.email,
      status: a.ativo ? "ativo" : "inativo",
      createdAt: a.createdAt,
      nomeCondominio: null,
      whatsapp: null,
      quantidadeApartamentos: null,
      tipo: "admin" as const,
    })),
  ];

  // Filtrar usuários localmente
  const filteredUsuarios = todosUsuarios.filter((user) => {
    const matchesSearch =
      !usuarioSearch ||
      user.nome?.toLowerCase().includes(usuarioSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(usuarioSearch.toLowerCase()) ||
      user.nomeCondominio?.toLowerCase().includes(usuarioSearch.toLowerCase());
    const matchesStatus =
      !usuarioStatusFilter || user.status === usuarioStatusFilter;
    const matchesTipo =
      usuarioTipoFilter === "todos" || user.tipo === usuarioTipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-xl text-white mt-6 font-medium">
            Carregando painel...
          </p>
          <p className="text-purple-300 text-sm mt-2">
            Validando permissões administrativas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Premium Redesenhado */}
      <header className="bg-linear-to-r from-slate-900 via-purple-900/95 to-slate-900 text-white sticky top-0 z-50 shadow-2xl border-b border-purple-500/20">
        {/* Barra Superior - Status do Sistema */}
        <div className="bg-black/20 border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex items-center justify-between h-8 text-[11px]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-green-400 font-medium">
                    Sistema Online
                  </span>
                </div>
                <span className="text-purple-300/60">|</span>
                <span className="text-purple-300/80">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {lastUpdate && (
                  <div className="flex items-center gap-1.5 text-purple-300/80">
                    <FaSync className="text-[9px]" />
                    <span>
                      Última sync: {lastUpdate.toLocaleTimeString("pt-BR")}
                    </span>
                  </div>
                )}
                <span className="text-purple-300/60">|</span>
                <span className="text-purple-300/80">v2.0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Principal */}
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Título */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-linear-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <FaUserShield className="text-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Painel Administrativo
                </h1>
                <p className="text-xs text-purple-300/80 font-medium">
                  Sistema Seu Gerente
                </p>
              </div>
            </div>

            {/* Ações Rápidas e Usuário */}
            <div className="flex items-center gap-3">
              {/* Botões de Ação Rápida */}
              <div className="hidden lg:flex items-center gap-2 mr-4">
                <button
                  onClick={refreshAllData}
                  disabled={loadingStats}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50"
                  title="Atualizar dados"
                >
                  <FaSync
                    className={`text-[10px] ${loadingStats ? "animate-spin" : ""}`}
                  />
                  <span>Atualizar</span>
                </button>
              </div>

              {/* Separador */}
              <div className="hidden lg:block w-px h-8 bg-white/10"></div>

              {/* Info do Admin */}
              <div className="flex items-center gap-3 pl-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">
                    {adminName}
                  </p>
                  <p className="text-[10px] text-purple-300/80 font-medium uppercase tracking-wider">
                    Administrador
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                  <div className="relative w-11 h-11 bg-linear-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-white/20">
                    {adminName?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    localStorage.clear();
                    // Limpar cookies de autenticação
                    document.cookie = "access_token=; path=/; max-age=0";
                    document.cookie = "isAdmin=; path=/; max-age=0";
                    document.cookie = "auth_token=; path=/; max-age=0";
                    document.cookie = "refresh_token=; path=/; max-age=0";
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 hover:text-red-300 px-3 py-2.5 rounded-lg transition-all duration-200 border border-white/10 hover:border-red-500/30"
                  title="Sair do sistema"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden sm:inline text-xs font-medium">
                    Sair
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Tabs - Design Melhorado */}
        <div className="bg-black/10 border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-6">
            <nav className="flex py-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: FaChartBar },
                {
                  id: "usuarios",
                  label: "Usuários",
                  icon: FaUsers,
                  badge: totalUsuarios || stats?.usuarios?.total,
                },
                { id: "logs", label: "Logs", icon: FaServer },
                { id: "cobrancas", label: "Cobranças", icon: FaPaperPlane },
                { id: "despesas", label: "Despesas", icon: FaReceipt },
                { id: "banners", label: "Banners", icon: FaChartBar },
                { id: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-purple-500/30 to-indigo-500/30 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/30"
                      : "text-purple-300/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon
                    className={`text-sm ${activeTab === tab.id ? "text-purple-300" : ""}`}
                  />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-purple-500/30 text-purple-200"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* Header com Stats Compactos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaTachometerAlt className="text-indigo-500" /> Visão Geral
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaClock className="text-gray-400" />
                  {lastUpdate
                    ? `Atualizado: ${lastUpdate.toLocaleTimeString("pt-BR")}`
                    : ""}
                  <button
                    onClick={async () => {
                      setLoadingStats(true);
                      await loadDashboardData();
                      setLoadingStats(false);
                    }}
                    className="ml-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <FaSync className={loadingStats ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <MiniStatCard
                  icon={FaUsers}
                  title="Usuários"
                  value={stats?.usuarios?.total || 0}
                  color="indigo"
                  loading={loadingStats}
                />
                <MiniStatCard
                  icon={FaCheckCircle}
                  title="Ativos"
                  value={stats?.usuarios?.ativos || 0}
                  color="green"
                  loading={loadingStats}
                />
                <MiniStatCard
                  icon={FaClock}
                  title="Pendentes"
                  value={assinaturasStats?.pendentes || 0}
                  color="yellow"
                  loading={loadingStats}
                />
                <MiniStatCard
                  icon={FaTimes}
                  title="Cancelados"
                  value={assinaturasStats?.canceladas || 0}
                  color="red"
                  loading={loadingStats}
                />
                <MiniStatCard
                  icon={FaUserFriends}
                  title="Moradores"
                  value={stats?.moradores || 0}
                  color="indigo"
                  loading={loadingStats}
                />
                <MiniStatCard
                  icon={FaUserShield}
                  title="Admins"
                  value={stats?.administradores || 0}
                  color="indigo"
                  loading={loadingStats}
                />
              </div>
            </div>

            {/* Cards Financeiros Compactos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaArrowUp className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Receitas</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(stats?.financeiro?.receitas?.valor || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FaArrowDown className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Despesas</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(stats?.financeiro?.despesas?.valor || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`${(stats?.financeiro?.saldo || 0) >= 0 ? "bg-blue-100" : "bg-orange-100"} p-2 rounded-lg`}
                  >
                    <FaWallet
                      className={`${(stats?.financeiro?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Saldo</p>
                    <p
                      className={`text-lg font-bold ${(stats?.financeiro?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"}`}
                    >
                      {formatCurrency(stats?.financeiro?.saldo || 0)}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Grid de Tabelas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Últimos Cadastros */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <FaUsers className="text-blue-500" /> Últimos Cadastros
                  </h3>
                  <button
                    onClick={() => handleTabChange("usuarios")}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Ver todos →
                  </button>
                </div>
                {usuariosRecentes.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    Nenhum cadastro recente
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                          <th className="px-3 py-2 text-left">Usuário</th>
                          <th className="px-3 py-2 text-center">Status</th>
                          <th className="px-3 py-2 text-right">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {usuariosRecentes.slice(0, 5).map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xs">
                                  {user.nome?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 text-xs">
                                    {user.nome || "Sem nome"}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <StatusBadge status={user.status} />
                            </td>
                            <td className="px-3 py-2 text-right text-xs text-gray-500">
                              {formatDateShort(user.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Resumo do Mês Atual */}
            {financeiro && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" /> Resumo do Mês
                  Atual
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(financeiro.mesAtual?.receitas || 0)}
                    </p>
                    <p className="text-xs text-gray-600">Receitas</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(financeiro.mesAtual?.despesas || 0)}
                    </p>
                    <p className="text-xs text-gray-600">Despesas</p>
                  </div>
                  <div
                    className={`${(financeiro.mesAtual?.saldo || 0) >= 0 ? "bg-blue-50" : "bg-orange-50"} rounded-lg p-3 text-center`}
                  >
                    <p
                      className={`text-lg font-bold ${(financeiro.mesAtual?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"}`}
                    >
                      {formatCurrency(financeiro.mesAtual?.saldo || 0)}
                    </p>
                    <p className="text-xs text-gray-600">Saldo</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-purple-600">
                      {financeiro.mesAtual?.cobrancas?.pagas || 0}/
                      {financeiro.mesAtual?.cobrancas?.total || 0}
                    </p>
                    <p className="text-xs text-gray-600">Cobranças Pagas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Atalhos Rápidos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <FaCog className="text-gray-500" /> Ações Rápidas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleTabChange("usuarios")}
                  className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                  <FaUsers className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Ver Usuários
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange("cobrancas")}
                  className="flex items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left"
                >
                  <FaPaperPlane className="text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Cobranças
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange("logs")}
                  className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                >
                  <FaFileAlt className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Ver Logs
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USUÁRIOS */}
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            {/* Stats de Usuários - Cards Compactos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniStatCard
                icon={FaUsers}
                title="Clientes"
                value={usuarios.length}
                color="indigo"
                loading={loadingUsuarios}
              />
              <MiniStatCard
                icon={FaUserShield}
                title="Admins"
                value={administradores.length}
                color="purple"
                loading={loadingUsuarios}
              />
              <MiniStatCard
                icon={FaCheckCircle}
                title="Ativos"
                value={usuarios.filter((u) => u.status === "ativo").length}
                color="green"
                loading={loadingUsuarios}
              />
              <MiniStatCard
                icon={FaClock}
                title="Pendentes"
                value={usuarios.filter((u) => u.status === "pendente").length}
                color="yellow"
                loading={loadingUsuarios}
              />
            </div>

            {/* Lista de Usuários */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header com Filtros */}
              <div className="px-4 py-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-blue-500" />
                  <h2 className="text-base font-semibold text-gray-800">
                    Usuários Cadastrados
                  </h2>
                  <span className="text-xs text-gray-400">
                    ({filteredUsuarios.length}/{totalUsuarios})
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Busca */}
                  <div className="relative">
                    <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={usuarioSearch}
                      onChange={(e) => setUsuarioSearch(e.target.value)}
                      className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                    />
                  </div>
                  {/* Filtro de Status */}
                  <select
                    value={usuarioStatusFilter}
                    onChange={(e) => setUsuarioStatusFilter(e.target.value)}
                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos status</option>
                    <option value="ativo">Ativos</option>
                    <option value="pendente">Pendentes</option>
                    <option value="inativo">Inativos</option>
                  </select>
                  {/* Filtro de Tipo */}
                  <select
                    value={usuarioTipoFilter}
                    onChange={(e) => setUsuarioTipoFilter(e.target.value as "todos" | "cliente" | "admin")}
                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos tipos</option>
                    <option value="cliente">Clientes</option>
                    <option value="admin">Admins</option>
                  </select>
                  {/* Botão Novo Usuário */}
                  <button
                    onClick={() => setShowNovoUsuarioModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                  >
                    <FaPlus className="text-xs" />
                    Novo
                  </button>
                  {/* Botão Atualizar */}
                  <button
                    onClick={() => { loadUsuarios(); loadAdministradores(); }}
                    disabled={loadingUsuarios}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-xs font-medium"
                  >
                    {loadingUsuarios ? (
                      <FaSpinner className="animate-spin text-xs" />
                    ) : (
                      <FaSync className="text-xs" />
                    )}
                    Atualizar
                  </button>
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                {loadingUsuarios ? (
                  <div className="p-4">
                    <TableSkeleton rows={8} cols={6} />
                  </div>
                ) : filteredUsuarios.length === 0 ? (
                  <div className="p-8 text-center">
                    <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium text-sm">
                      Nenhum usuário encontrado
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tente ajustar os filtros
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">
                          Usuário
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">
                          Condomínio
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">
                          Contato
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">
                          Aptos
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">
                          Tipo
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase">
                          Cadastro
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUsuarios.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                                {user.nome?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                                  {user.nome || "Sem nome"}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate max-w-[150px]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-xs text-gray-600 truncate max-w-[120px] block">
                              {user.nomeCondominio || "-"}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {user.whatsapp ? (
                              <span className="text-xs text-gray-600 font-mono">
                                {user.whatsapp}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-700 rounded-full font-semibold text-xs">
                              {user.quantidadeApartamentos || 0}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              user.tipo === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {user.tipo === "admin" ? "Admin" : "Cliente"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {user.tipo === "cliente" ? (
                              <select
                                value={user.status}
                                onChange={(e) => alterarStatusUsuario(user.id, e.target.value)}
                                className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                                  user.status === "ativo"
                                    ? "bg-green-100 text-green-700 focus:ring-green-400"
                                    : user.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-700 focus:ring-yellow-400"
                                    : "bg-red-100 text-red-700 focus:ring-red-400"
                                }`}
                              >
                                <option value="ativo">Ativo</option>
                                <option value="pendente">Pendente</option>
                                <option value="inativo">Inativo</option>
                              </select>
                            ) : (
                              <button
                                onClick={() => toggleAdminStatus(user.id, user.status !== "ativo")}
                                className={`text-[10px] font-semibold rounded-full px-2 py-0.5 cursor-pointer transition-colors ${
                                  user.status === "ativo"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                }`}
                              >
                                {user.status === "ativo" ? "Ativo" : "Inativo"}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <p className="text-xs text-gray-600">
                              {formatDateShort(user.createdAt)}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOGS */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaServer className="text-green-500" /> Logs do Sistema
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalLogs} registros
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={logFilters.nivel}
                    onChange={(e) =>
                      setLogFilters({ ...logFilters, nivel: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Todos os níveis</option>
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ERROR">ERROR</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                  <select
                    value={logFilters.categoria}
                    onChange={(e) =>
                      setLogFilters({
                        ...logFilters,
                        categoria: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Todas as categorias</option>
                    <option value="SISTEMA">SISTEMA</option>
                    <option value="CONFIGURACAO">CONFIGURAÇÃO</option>
                    <option value="COBRANCA">COBRANÇA</option>
                  </select>
                  <button
                    onClick={loadLogs}
                    disabled={loadingLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {loadingLogs ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaFilter />
                    )}
                    Filtrar
                  </button>
                  <button
                    onClick={limparLogsAntigos}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <FaTrash /> Limpar Antigos
                  </button>
                </div>
              </div>

              {/* Stats de Logs */}
              {logStats.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {logStats.map((stat) => (
                    <span
                      key={stat.nivel}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        stat.nivel === "ERROR" || stat.nivel === "CRITICAL"
                          ? "bg-red-100 text-red-700"
                          : stat.nivel === "WARNING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {stat.nivel}: {stat.count}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {loadingLogs ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="p-12 text-center">
                  <FaServer className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    Nenhum log encontrado
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Os logs aparecerão aqui quando ações forem realizadas
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`px-6 py-4 border-l-4 ${
                        log.nivel === "ERROR" || log.nivel === "CRITICAL"
                          ? "border-l-red-500 bg-red-50/50"
                          : log.nivel === "WARNING"
                            ? "border-l-yellow-500 bg-yellow-50/50"
                            : "border-l-blue-500 bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                log.nivel === "ERROR" ||
                                log.nivel === "CRITICAL"
                                  ? "bg-red-200 text-red-800"
                                  : log.nivel === "WARNING"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-blue-200 text-blue-800"
                              }`}
                            >
                              {log.nivel}
                            </span>
                            {log.categoria && (
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                                {log.categoria}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-800">
                            {log.mensagem}
                          </p>
                          {log.detalhes && (
                            <p className="text-sm text-gray-600 mt-1">
                              {log.detalhes}
                            </p>
                          )}
                          {log.email && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FaEnvelope className="text-[10px]" /> {log.email}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 text-right whitespace-nowrap">
                          {formatDate(log.data)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* COBRANÇAS - Notificações para Pendentes */}
        {activeTab === "cobrancas" && (
          <div className="space-y-4">
            {/* Header com Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaBell className="text-orange-500" /> Notificações para
                  Pendentes
                </h2>
                <button
                  onClick={async () => {
                    await loadUsuarios();
                    await loadConfiguracoes();
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <FaSync className={loadingUsuarios ? "animate-spin" : ""} />
                  Atualizar
                </button>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniStatCard
                  icon={FaClock}
                  title="Pendentes"
                  value={usuarios.filter((u) => u.status === "pendente").length}
                  color="yellow"
                  loading={loadingUsuarios}
                />
                <MiniStatCard
                  icon={FaEnvelope}
                  title="Com Email"
                  value={
                    usuarios.filter((u) => u.status === "pendente" && u.email)
                      .length
                  }
                  color="indigo"
                  loading={loadingUsuarios}
                />
                <MiniStatCard
                  icon={FaWhatsapp}
                  title="Com WhatsApp"
                  value={
                    usuarios.filter(
                      (u) => u.status === "pendente" && u.whatsapp,
                    ).length
                  }
                  color="green"
                  loading={loadingUsuarios}
                />
                <MiniStatCard
                  icon={FaMoneyBillWave}
                  title="Valor Atual"
                  value={
                    valorCobranca
                      ? `R$ ${valorCobranca}`
                      : formatCurrency(
                          parseFloat(
                            configuracoes.find(
                              (c) => c.chave === "VALOR_MENSAL_SISTEMA",
                            )?.valor || "0",
                          ),
                        )
                  }
                  color="indigo"
                  loading={loadingConfigs}
                />
              </div>
            </div>

            {/* Configurações de Cobrança */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm flex items-center gap-2">
                <FaCog className="text-gray-500" /> Dados da Cobrança
              </h3>

              {/* Linha 1: Valor e Data de Vencimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Valor da Cobrança */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Valor da Cobrança (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      R$
                    </span>
                    <input
                      type="text"
                      value={valorCobranca}
                      onChange={(e) => setValorCobranca(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Data de Vencimento */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Linha 2: Agendamento Automático */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setAgendamentoAtivo(!agendamentoAtivo)}
                      className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                        agendamentoAtivo ? "bg-purple-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                          agendamentoAtivo ? "left-5" : "left-0.5"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      <FaClock className="inline mr-1 text-purple-500" />
                      Agendar Envio Automático
                    </span>
                  </label>
                </div>

                {agendamentoAtivo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 rounded-lg p-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Data do Envio
                      </label>
                      <input
                        type="date"
                        value={dataAgendamento}
                        onChange={(e) => setDataAgendamento(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Hora do Envio
                      </label>
                      <input
                        type="time"
                        value={horaAgendamento}
                        onChange={(e) => setHoraAgendamento(e.target.value)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-purple-700">
                        ⏰ O envio será programado para{" "}
                        <strong>
                          {dataAgendamento
                            ? new Date(
                                dataAgendamento +
                                  "T" +
                                  (horaAgendamento || "08:00"),
                              ).toLocaleString("pt-BR")
                            : "data não definida"}
                        </strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opções de Envio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <FaPaperPlane className="text-gray-500" /> Canais de Envio
              </h3>
              <div className="flex flex-wrap gap-4">
                {/* Toggle Email */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() =>
                      setNotificacaoTipo((prev) => ({
                        ...prev,
                        email: !prev.email,
                      }))
                    }
                    className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                      notificacaoTipo.email ? "bg-indigo-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                        notificacaoTipo.email ? "left-5" : "left-0.5"
                      }`}
                    />
                  </div>
                  <span className="flex items-center gap-1.5 text-sm">
                    <FaEnvelope
                      className={
                        notificacaoTipo.email
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                    />
                    Email
                  </span>
                </label>

                {/* Toggle WhatsApp */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() =>
                      setNotificacaoTipo((prev) => ({
                        ...prev,
                        whatsapp: !prev.whatsapp,
                      }))
                    }
                    className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                      notificacaoTipo.whatsapp ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                        notificacaoTipo.whatsapp ? "left-5" : "left-0.5"
                      }`}
                    />
                  </div>
                  <span className="flex items-center gap-1.5 text-sm">
                    <FaWhatsapp
                      className={
                        notificacaoTipo.whatsapp
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    />
                    WhatsApp
                  </span>
                </label>

                <div className="flex-1" />

                {/* Botão Enviar */}
                <button
                  onClick={enviarNotificacoesPendentes}
                  disabled={
                    enviandoNotificacoes ||
                    usuarios.filter((u) => u.status === "pendente").length === 0
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    enviandoNotificacoes
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : agendamentoAtivo
                        ? "bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg"
                        : "bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  {enviandoNotificacoes ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Enviando...
                    </>
                  ) : agendamentoAtivo ? (
                    <>
                      <FaClock />
                      Agendar Envio
                      {usuariosSelecionados.length > 0 &&
                        ` (${usuariosSelecionados.length})`}
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Enviar Agora
                      {usuariosSelecionados.length > 0 &&
                        ` (${usuariosSelecionados.length})`}
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                <span>
                  {usuariosSelecionados.length > 0
                    ? `${usuariosSelecionados.length} selecionado(s)`
                    : "Todos os pendentes"}
                </span>
                <span>•</span>
                <span>
                  Valor: <strong>R$ {valorCobranca || "0,00"}</strong>
                </span>
                <span>•</span>
                <span>
                  Vencimento:{" "}
                  <strong>
                    {dataVencimento
                      ? new Date(
                          dataVencimento + "T12:00:00",
                        ).toLocaleDateString("pt-BR")
                      : "-"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Resultado do Envio */}
            {resultadoEnvio && (
              <div
                className={`rounded-xl p-4 ${
                  resultadoEnvio.erros.length > 0
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaCheckCircle
                    className={
                      resultadoEnvio.erros.length > 0
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  />
                  Resultado do Envio
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-indigo-500" />
                    <span>
                      <strong>{resultadoEnvio.emailsEnviados}</strong> emails
                      enviados
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaWhatsapp className="text-green-500" />
                    <span>
                      <strong>{resultadoEnvio.whatsappEnviados}</strong>{" "}
                      WhatsApp enviados
                    </span>
                  </div>
                  {resultadoEnvio.erros.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <FaExclamationTriangle />
                      <span>
                        <strong>{resultadoEnvio.erros.length}</strong> falha(s)
                      </span>
                    </div>
                  )}
                </div>
                {resultadoEnvio.erros.length > 0 && (
                  <div className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg p-2 max-h-32 overflow-auto">
                    {resultadoEnvio.erros.map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Lista de Usuários Pendentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <FaUsers className="text-gray-500" /> Usuários Pendentes
                </h3>
                <button
                  onClick={selecionarTodosPendentes}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  {usuariosSelecionados.length ===
                    usuarios.filter((u) => u.status === "pendente").length &&
                  usuariosSelecionados.length > 0 ? (
                    <>
                      <FaCheckSquare /> Desmarcar Todos
                    </>
                  ) : (
                    <>
                      <FaRegSquare /> Selecionar Todos
                    </>
                  )}
                </button>
              </div>

              {loadingUsuarios ? (
                <div className="p-8 text-center text-gray-500">
                  <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                  Carregando...
                </div>
              ) : usuarios.filter((u) => u.status === "pendente").length ===
                0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaCheckCircle className="text-4xl mx-auto mb-2 text-green-400" />
                  <p>Nenhum usuário pendente!</p>
                  <p className="text-xs mt-1">
                    Todos os usuários estão em dia.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left w-10">#</th>
                        <th className="px-3 py-2 text-left">Usuário</th>
                        <th className="px-3 py-2 text-left">Condomínio</th>
                        <th className="px-3 py-2 text-center">Email</th>
                        <th className="px-3 py-2 text-center">WhatsApp</th>
                        <th className="px-3 py-2 text-left">Cadastro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usuarios
                        .filter((u) => u.status === "pendente")
                        .map((user) => (
                          <tr
                            key={user.id}
                            onClick={() => toggleUsuarioSelecionado(user.id)}
                            className={`cursor-pointer transition-colors ${
                              usuariosSelecionados.includes(user.id)
                                ? "bg-indigo-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-3 py-2">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  usuariosSelecionados.includes(user.id)
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {usuariosSelecionados.includes(user.id) && (
                                  <FaCheck className="text-xs" />
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-gray-800">
                                {user.nome || "Sem nome"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-gray-600 text-xs">
                              {user.nomeCondominio || "-"}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {user.email ? (
                                <FaEnvelope
                                  className="text-indigo-500 mx-auto"
                                  title={user.email}
                                />
                              ) : (
                                <FaTimes className="text-gray-300 mx-auto" />
                              )}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {user.whatsapp ? (
                                <FaWhatsapp
                                  className="text-green-500 mx-auto"
                                  title={user.whatsapp}
                                />
                              ) : (
                                <FaTimes className="text-gray-300 mx-auto" />
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-500">
                              {formatDateShort(user.createdAt)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Histórico */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                <FaHistory className="text-gray-500" /> Histórico de
                Notificações
              </h3>
              <p className="text-xs text-gray-600">
                Acesse a aba <strong>Logs</strong> para ver o histórico completo
                de envios.
              </p>
              <button
                onClick={() => {
                  setLogFilters({ nivel: "", categoria: "COBRANCA" });
                  handleTabChange("logs");
                }}
                className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium text-xs flex items-center gap-1"
              >
                Ver histórico de cobranças →
              </button>
            </div>
          </div>
        )}

        {/* DESPESAS DO SISTEMA */}
        {activeTab === "despesas" && (
          <div className="space-y-4">
            {/* Header com Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaReceipt className="text-red-500" /> Despesas do Sistema
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDespesasSistema}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <FaSync className={loadingDespesas ? "animate-spin" : ""} />
                  </button>
                  <button
                    onClick={() => setShowNovaDespesaForm(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                  >
                    <FaReceipt /> Nova Despesa
                  </button>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniStatCard
                  icon={FaReceipt}
                  title="Total Despesas"
                  value={despesasSistema.length}
                  color="indigo"
                  loading={loadingDespesas}
                />
                <MiniStatCard
                  icon={FaClock}
                  title="Pendentes"
                  value={formatCurrency(totalDespesasPendentes)}
                  color="yellow"
                  loading={loadingDespesas}
                />
                <MiniStatCard
                  icon={FaCheckCircle}
                  title="Pagas"
                  value={formatCurrency(totalDespesasPagas)}
                  color="green"
                  loading={loadingDespesas}
                />
                <MiniStatCard
                  icon={FaMoneyBillWave}
                  title="Total Geral"
                  value={formatCurrency(
                    totalDespesasPendentes + totalDespesasPagas,
                  )}
                  color="red"
                  loading={loadingDespesas}
                />
              </div>
            </div>

            {/* Formulário Nova Despesa */}
            {showNovaDespesaForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <FaReceipt className="text-red-500" /> Nova Despesa
                  </h3>
                  <button
                    onClick={() => setShowNovaDespesaForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descrição *
                    </label>
                    <input
                      type="text"
                      value={novaDespesa.descricao}
                      onChange={(e) =>
                        setNovaDespesa({
                          ...novaDespesa,
                          descricao: e.target.value,
                        })
                      }
                      placeholder="Ex: Servidor AWS"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Valor (R$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        R$
                      </span>
                      <input
                        type="text"
                        value={novaDespesa.valor}
                        onChange={(e) =>
                          setNovaDespesa({
                            ...novaDespesa,
                            valor: e.target.value,
                          })
                        }
                        placeholder="0,00"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Categoria
                    </label>
                    <select
                      value={novaDespesa.categoria}
                      onChange={(e) =>
                        setNovaDespesa({
                          ...novaDespesa,
                          categoria: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {categoriasDespesa.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Data Lançamento
                    </label>
                    <input
                      type="date"
                      value={novaDespesa.dataLancamento}
                      onChange={(e) =>
                        setNovaDespesa({
                          ...novaDespesa,
                          dataLancamento: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Observação (opcional)
                  </label>
                  <input
                    type="text"
                    value={novaDespesa.observacao}
                    onChange={(e) =>
                      setNovaDespesa({
                        ...novaDespesa,
                        observacao: e.target.value,
                      })
                    }
                    placeholder="Detalhes adicionais..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowNovaDespesaForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={criarDespesaSistema}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Salvar Despesa
                  </button>
                </div>
              </div>
            )}

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <span className="text-sm text-gray-600">Filtros:</span>
                </div>

                <select
                  value={despesaFiltroStatus}
                  onChange={(e) => setDespesaFiltroStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Todos os Status</option>
                  <option value="pendente">Pendentes</option>
                  <option value="pago">Pagas</option>
                </select>

                <select
                  value={despesaFiltroCategoria}
                  onChange={(e) => setDespesaFiltroCategoria(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Todas as Categorias</option>
                  {categoriasDespesa.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <span className="text-xs text-gray-500">
                  {despesasFiltradas.length} despesa(s)
                </span>
              </div>
            </div>

            {/* Lista de Despesas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {loadingDespesas ? (
                <div className="p-8 text-center text-gray-500">
                  <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                  Carregando...
                </div>
              ) : despesasFiltradas.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaReceipt className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma despesa cadastrada</p>
                  <button
                    onClick={() => setShowNovaDespesaForm(true)}
                    className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    + Adicionar primeira despesa
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">Descrição</th>
                        <th className="px-3 py-2 text-left">Categoria</th>
                        <th className="px-3 py-2 text-right">Valor</th>
                        <th className="px-3 py-2 text-center">Status</th>
                        <th className="px-3 py-2 text-left">Data</th>
                        <th className="px-3 py-2 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {despesasFiltradas.map((despesa) => {
                        const categoria = categoriasDespesa.find(
                          (c) => c.id === despesa.categoria,
                        );
                        return (
                          <tr key={despesa.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div className="font-medium text-gray-800">
                                {despesa.descricao}
                              </div>
                              {despesa.observacao && (
                                <div className="text-xs text-gray-500">
                                  {despesa.observacao}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${categoria?.color || "gray"}-100 text-${categoria?.color || "gray"}-700`}
                              >
                                {categoria?.label || despesa.categoria}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800">
                              {formatCurrency(despesa.valor)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {despesa.status === "pago" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <FaCheckCircle /> Pago
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                  <FaClock /> Pendente
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-500">
                              {formatDateShort(despesa.dataLancamento)}
                              {despesa.dataPagamento && (
                                <div className="text-green-600">
                                  Pago: {formatDateShort(despesa.dataPagamento)}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {despesa.status === "pendente" && (
                                  <button
                                    onClick={() =>
                                      marcarDespesaPaga(despesa.id)
                                    }
                                    className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg"
                                    title="Marcar como Pago"
                                  >
                                    <FaCheck />
                                  </button>
                                )}
                                <button
                                  onClick={() => excluirDespesa(despesa.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                                  title="Excluir"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BANNERS DA LANDING PAGE */}
        {activeTab === "banners" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Banners da Landing Page</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Imagens exibidas em carrossel no topo da página inicial
                  </p>
                </div>
                <label className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer transition-colors ${uploadingBanner ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}>
                  {uploadingBanner ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPlus />
                  )}
                  {uploadingBanner ? "Enviando…" : "Adicionar Banner"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploadingBanner}
                    onChange={handleBannerUpload}
                  />
                </label>
              </div>

              {bannerMsg && (
                <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${bannerMsg.includes("Erro") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  {bannerMsg}
                </div>
              )}

              {loadingBanners ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <FaSpinner className="animate-spin text-2xl" />
                </div>
              ) : banners.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <div className="text-5xl mb-3">🖼️</div>
                  <p className="font-medium text-gray-600">Nenhum banner cadastrado</p>
                  <p className="text-sm mt-1">Clique em "Adicionar Banner" para fazer upload da primeira imagem</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {banners.map((banner, idx) => (
                    <div key={banner.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.imagemUrl}
                        alt={`Banner ${idx + 1}`}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleBannerDelete(banner.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <FaTrash className="text-xs" /> Remover
                        </button>
                      </div>
                      <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WHATSAPP INSTITUCIONAL */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-r from-green-600 to-emerald-700 px-6 py-5">
                <div className="flex items-center gap-3">
                  <FaWhatsapp className="text-white text-2xl" />
                  <div>
                    <h2 className="text-lg font-bold text-white">WhatsApp Institucional</h2>
                    <p className="text-green-100 text-sm">Instância utilizada para envio de mensagens aos usuários da plataforma</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${
                      waStatus === "open" ? "bg-green-500" :
                      waStatus === "connecting" ? "bg-yellow-500 animate-pulse" :
                      waStatus === "error" ? "bg-red-600" : "bg-gray-400"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Status</p>
                      <p className={`text-sm font-medium ${
                        waStatus === "open" ? "text-green-600" :
                        waStatus === "connecting" ? "text-yellow-600" :
                        waStatus === "error" ? "text-red-600" : "text-gray-500"
                      }`}>
                        {waLoadingStatus ? "Verificando..." :
                          waStatus === "open" ? "Conectado" :
                          waStatus === "connecting" ? "Aguardando leitura do QR Code..." :
                          waStatus === "close" ? "Desconectado" :
                          waStatus === "error" ? "Erro de conexão" : "Não configurado"}
                      </p>
                    </div>
                  </div>
                  {waInstanceName && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Instância</p>
                      <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{waInstanceName}</p>
                    </div>
                  )}
                </div>

                {/* QR Code — mostra enquanto houver QR (polling não deve apagar) */}
                {waQrCode && waStatus !== "open" && (
                  <div className="flex flex-col items-center gap-4 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <p className="text-sm font-semibold text-yellow-800">📱 Escaneie o QR Code com o WhatsApp institucional</p>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-yellow-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={waQrCode} alt="QR Code" className="w-52 h-52 object-contain" />
                    </div>
                    <p className="text-xs text-yellow-700 text-center">WhatsApp → Menu → Aparelhos conectados → Conectar dispositivo</p>
                    <div className="flex items-center gap-2 text-yellow-600 text-xs">
                      <FaSpinner className="animate-spin" /> Aguardando leitura...
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3 flex-wrap">
                  {(waStatus === "not_configured" || waStatus === "close") && (
                    <button
                      onClick={handleWaConnect}
                      disabled={waLoading || waLoadingStatus}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm"
                    >
                      {waLoading ? <FaSpinner className="animate-spin" /> : <FaWhatsapp />}
                      Conectar via QR Code
                    </button>
                  )}

                  {(waStatus === "open" || waStatus === "connecting") && (
                    <>
                      <button
                        onClick={handleWaReconnect}
                        disabled={waLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
                      >
                        <FaSync /> Reconectar
                      </button>
                      <button
                        onClick={handleWaDisconnect}
                        disabled={waLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
                      >
                        Desconectar
                      </button>
                    </>
                  )}

                  {waStatus === "error" && (
                    <button
                      onClick={handleWaReconnect}
                      disabled={waLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
                    >
                      <FaSync /> Reconectar
                    </button>
                  )}

                  {(waStatus === "close" || waStatus === "error") && (
                    <button
                      onClick={handleWaReset}
                      disabled={waResetting || waLoading}
                      className="px-3 py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 text-xs rounded-xl transition-all disabled:opacity-60 border border-gray-200"
                      title="Apagar registro e reconectar do zero"
                    >
                      {waResetting ? "..." : "🗑 Resetar"}
                    </button>
                  )}

                  <button
                    onClick={loadWaStatus}
                    disabled={waLoading || waLoadingStatus}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-all disabled:opacity-60"
                    title="Atualizar status"
                  >
                    🔃
                  </button>
                </div>

                {/* Feedback */}
                {waMsg && (
                  <div className={`p-3 rounded-xl text-sm font-medium border-l-4 ${
                    waMsg.includes("✅") || waMsg.includes("Escaneie")
                      ? "bg-green-50 text-green-800 border-green-400"
                      : waMsg.includes("❌")
                      ? "bg-red-50 text-red-800 border-red-400"
                      : "bg-blue-50 text-blue-800 border-blue-400"
                  }`}>
                    {waMsg}
                  </div>
                )}

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700 font-semibold mb-1">ℹ️ Instância institucional</p>
                  <ul className="text-xs text-blue-600 space-y-0.5 ml-3">
                    <li>• Esta instância é usada para enviar mensagens aos clientes da plataforma</li>
                    <li>• As credenciais (URL/ApiKey) são configuradas via variáveis de ambiente</li>
                    <li>• Reconecte se a instância desconectar automaticamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Novo Usuário */}
      {showNovoUsuarioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800">Novo Usuário</h3>
              <button
                onClick={() => { setShowNovoUsuarioModal(false); setNovoUsuario({ email: "", nome: "", senha: "" }); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Seletor de tipo */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setNovoUsuarioTipo("cliente")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    novoUsuarioTipo === "cliente"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Cliente
                </button>
                <button
                  onClick={() => setNovoUsuarioTipo("admin")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    novoUsuarioTipo === "admin"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Admin
                </button>
              </div>
              {/* Campos */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario((p) => ({ ...p, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Senha *</label>
                <input
                  type="password"
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario((p) => ({ ...p, senha: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => { setShowNovoUsuarioModal(false); setNovoUsuario({ email: "", nome: "", senha: "" }); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={criarUsuario}
                disabled={criandoUsuario}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                  novoUsuarioTipo === "admin"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {criandoUsuario ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                Criar {novoUsuarioTipo === "admin" ? "Admin" : "Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

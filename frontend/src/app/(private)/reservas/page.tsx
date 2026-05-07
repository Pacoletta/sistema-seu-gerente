"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface Reserva {
  id: string;
  espaco: string;
  morador: string;
  dataReserva: string;
  horaInicio: string;
  horaFim: string;
  status: string;
  observacoes?: string;
  createdAt?: string;
}

const ESPACOS = [
  "Salão de Festas",
  "Churrasqueira",
  "Piscina",
  "Quadra Esportiva",
  "Sala de Jogos",
  "Espaço Gourmet",
  "Academia",
  "Playground",
];

const STATUS_OPTIONS = [
  {
    value: "pendente",
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmada",
    label: "Confirmada",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelada", label: "Cancelada", color: "bg-red-100 text-red-800" },
];

const statusStyle = (status: string) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.color ??
  "bg-gray-100 text-gray-700";

const statusLabel = (status: string) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;

const emptyForm = (): Partial<Reserva> => ({
  espaco: ESPACOS[0],
  morador: "",
  dataReserva: new Date().toISOString().slice(0, 10),
  horaInicio: "08:00",
  horaFim: "10:00",
  status: "pendente",
  observacoes: "",
});

export default function ReservasPage() {
  const { userId } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Reserva | null>(null);
  const [form, setForm] = useState<Partial<Reserva>>(emptyForm());
  const [salvando, setSalvando] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroEspaco, setFiltroEspaco] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [moradores, setMoradores] = useState<{ id: string; nome: string; numero: string }[]>([]);

  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const getToken = useCallback(() => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }, []);

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    }),
    [getToken],
  );

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/reservas`, {
        headers: headers(),
      });
      if (res.ok) setReservas(await res.json());
    } catch {
      setErro("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, headers]);

  const carregarMoradores = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/moradores`, {
        headers: headers(),
      });
      if (res.ok) {
        const data = await res.json();
        setMoradores(data.map((m: { id: string; nome: string; numero: string }) => ({ id: m.id, nome: m.nome, numero: m.numero })));
      }
    } catch {
      // silently ignore — moradores list is non-critical
    }
  }, [backendUrl, headers]);

  useEffect(() => {
    if (userId) {
      carregar();
      carregarMoradores();
    }
  }, [userId, carregar, carregarMoradores]);

  const abrirNova = () => {
    setEditando(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const abrirEditar = (r: Reserva) => {
    setEditando(r);
    setForm({ ...r });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditando(null);
    setErro("");
  };

  const salvar = async () => {
    if (
      !form.espaco ||
      !form.morador ||
      !form.dataReserva ||
      !form.horaInicio ||
      !form.horaFim
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const url = editando
        ? `${backendUrl}/api/reservas/${editando.id}`
        : `${backendUrl}/api/reservas`;
      const method = editando ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await carregar();
        fecharModal();
      } else {
        const data = await res.json();
        setErro(data.message || "Erro ao salvar reserva");
      }
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSalvando(false);
    }
  };

  const alterarStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/reservas/${id}/status`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r)),
        );
      }
    } catch {
      setErro("Erro ao atualizar status");
    }
  };

  const excluir = async (id: string) => {
    if (!confirm("Excluir esta reserva?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/reservas/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.ok) setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setErro("Erro ao excluir reserva");
    }
  };

  const reservasDoMes = reservas.filter((r) => {
    if (!r.dataReserva) return false;
    const [y, m] = r.dataReserva.split("-");
    return parseInt(m) === mesSelecionado && parseInt(y) === anoSelecionado;
  });

  const filtradas = reservasDoMes.filter((r) => {
    const matchStatus = !filtroStatus || r.status === filtroStatus;
    const matchEspaco = !filtroEspaco || r.espaco === filtroEspaco;
    const matchBusca =
      !busca ||
      r.morador.toLowerCase().includes(busca.toLowerCase()) ||
      r.espaco.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchEspaco && matchBusca;
  });

  const counts = {
    pendente: reservasDoMes.filter((r) => r.status === "pendente").length,
    confirmada: reservasDoMes.filter((r) => r.status === "confirmada").length,
    cancelada: reservasDoMes.filter((r) => r.status === "cancelada").length,
  };

  const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const mesAnterior = () => {
    if (mesSelecionado === 1) { setMesSelecionado(12); setAnoSelecionado((a) => a - 1); }
    else setMesSelecionado((m) => m - 1);
  };

  const proximoMes = () => {
    if (mesSelecionado === 12) { setMesSelecionado(1); setAnoSelecionado((a) => a + 1); }
    else setMesSelecionado((m) => m + 1);
  };

  const formatDate = (d: string) => {
    if (!d) return "-";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reservas de Áreas Comuns
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gerencie as reservas dos espaços do condomínio
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Navegação de mês */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm px-1 py-1">
              <button
                onClick={mesAnterior}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="px-3 py-1 text-sm font-semibold text-gray-800 min-w-[130px] text-center">
                {MESES[mesSelecionado - 1]} {anoSelecionado}
              </span>
              <button
                onClick={proximoMes}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <button
              onClick={abrirNova}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nova Reserva
            </button>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total no mês",
              value: reservasDoMes.length,
              color: "bg-blue-50 text-blue-700 border-blue-200",
            },
            {
              label: "Pendentes",
              value: counts.pendente,
              color: "bg-yellow-50 text-yellow-700 border-yellow-200",
            },
            {
              label: "Confirmadas",
              value: counts.confirmada,
              color: "bg-green-50 text-green-700 border-green-200",
            },
            {
              label: "Canceladas",
              value: counts.cancelada,
              color: "bg-red-50 text-red-700 border-red-200",
            },
          ].map((c) => (
            <div key={c.label} className={`rounded-xl border p-4 ${c.color}`}>
              <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                {c.label}
              </p>
              <p className="text-3xl font-bold mt-1">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por morador ou espaço..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={filtroEspaco}
              onChange={(e) => setFiltroEspaco(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos os espaços</option>
              {ESPACOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Carregando reservas...</p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 font-medium">
                Nenhuma reserva encontrada
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Crie uma nova reserva para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
                  <tr>
                    {[
                      "Espaço",
                      "Morador",
                      "Data",
                      "Horário",
                      "Status",
                      "Observações",
                      "Ações",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtradas.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                          {r.espaco}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {r.morador}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(r.dataReserva)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {r.horaInicio} – {r.horaFim}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          onChange={(e) => alterarStatus(r.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${statusStyle(r.status)}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">
                        {r.observacoes || (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => abrirEditar(r)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => excluir(r.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {editando ? "Editar Reserva" : "Nova Reserva"}
              </h2>
              <button
                onClick={fecharModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                  {erro}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Espaço *
                  </label>
                  <select
                    value={form.espaco}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, espaco: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {ESPACOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Morador *
                  </label>
                  <select
                    value={form.morador}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, morador: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Selecione um morador</option>
                    {moradores.map((m) => (
                      <option key={m.id} value={m.nome}>
                        {m.nome} - Apto {m.numero}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={form.dataReserva}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, dataReserva: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hora início *
                  </label>
                  <input
                    type="time"
                    value={form.horaInicio}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, horaInicio: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hora fim *
                  </label>
                  <input
                    type="time"
                    value={form.horaFim}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, horaFim: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={form.observacoes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, observacoes: e.target.value }))
                    }
                    placeholder="Informações adicionais..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={fecharModal}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {salvando ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {editando ? "Salvar alterações" : "Criar reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

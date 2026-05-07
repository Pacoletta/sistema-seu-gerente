"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { API } from "@/services/api";

export default function Dashboard1() {
  // Filtros: mês/ano
  const now = new Date();
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");

  // Helper para montar filtro de despesas
  function filtrarDespesas(despesas: any[]) {
    return despesas.filter((d) => {
      if (!d.data) return false;
      const dataStr = d.data.split("T")[0]; // Remove horário se existir
      const [ano, mes, dia] = dataStr.split("-");
      // Filtro por mês/ano
      if (mesSelecionado && anoSelecionado) {
        if (ano !== anoSelecionado || mes !== mesSelecionado) return false;
      }
      return true;
    });
  }

  // Buscar usuário atual
  const [userId, setUserId] = useState<string | undefined>(undefined);
  useEffect(() => {
    API.auth
      .me()
      .then((data) => setUserId(data?.user?.id))
      .catch(() => setUserId(undefined));
  }, []);

  const { data: moradores = [] } = useSWR(
    userId ? ["moradores", userId] : null,
    async () => {
      if (!userId) return [];
      return API.moradores.list(userId);
    },
  );

  // Buscar pagamentos via backend
  const { data: pagamentos = [] } = useSWR(
    userId ? ["pagamentos", userId] : null,
    async () => {
      if (!userId) return [];
      return API.pagamentos.list(userId);
    },
  );

  // Buscar despesas via backend
  const { data: despesas = [] } = useSWR(
    userId ? ["despesas", userId] : null,
    async () => {
      if (!userId) return [];
      return API.despesas.list(userId);
    },
  );

  // Despesas filtradas
  const despesasFiltradas = filtrarDespesas(despesas);

  // Agrupa despesas filtradas por mês/ano
  const despesasPorMesAno: Record<string, any[]> = {};
  despesasFiltradas.forEach((d: any) => {
    if (!d.data) return;
    const dataStr = d.data.split("T")[0]; // Remove horário se existir
    const [ano, mes] = dataStr.split("-");
    const key = `${ano}-${mes}`;
    if (!despesasPorMesAno[key]) despesasPorMesAno[key] = [];
    despesasPorMesAno[key].push(d);
  });

  // Calcula valores devidos por apartamento para cada mês/ano
  const valoresDevidosPorMesAno: Record<string, number[]> = {};
  Object.entries(despesasPorMesAno).forEach(([key, despesasDoMes]) => {
    valoresDevidosPorMesAno[key] = moradores.map(
      (morador: any, idx: number) => {
        return (despesasDoMes as any[]).reduce((acc: number, d: any) => {
          if (d.valoresporap && Array.isArray(d.valoresporap)) {
            return acc + Number(d.valoresporap[idx] || 0);
          }
          return acc;
        }, 0);
      },
    );
  });

  // Receita total filtrada (apenas pagamentos do período selecionado)
  let receitaTotal = 0;
  let receitaTemPagamento = false;

  console.log("🔍 DEBUG PAGAMENTOS:", {
    totalPagamentos: pagamentos.length,
    exemplosPagamentos: pagamentos.slice(0, 3).map((p: any) => ({
      id: p.id,
      mesAno: p.mesAno,
      status: p.status,
      statusType: typeof p.status,
      statusLower:
        typeof p.status === "string" ? p.status.toLowerCase() : p.status,
      valor: p.valor,
      caixinha: p.caixinha,
    })),
    mesSelecionado,
    anoSelecionado,
    temFiltro: !!(mesSelecionado && anoSelecionado),
  });

  pagamentos.forEach((p: any) => {
    // Filtrar por mês/ano se selecionado
    if (mesSelecionado && anoSelecionado) {
      const mesAnoFiltro = `${anoSelecionado}-${mesSelecionado}`;
      if (p.mesAno !== mesAnoFiltro) return;
    }

    // Compara status ignorando case (aceita "pago", "Pago", "PAGO")
    const statusNormalizado =
      typeof p.status === "string"
        ? p.status.toLowerCase()
        : String(p.status).toLowerCase();
    if (statusNormalizado === "pago") {
      const valorPago = Number(p.valor || 0);
      const valorCaixinha = Number(p.caixinha || 0);
      receitaTotal += valorPago + valorCaixinha;
      receitaTemPagamento = true;
      console.log("💰 Pagamento PAGO contabilizado:", {
        mesAno: p.mesAno,
        status: p.status,
        statusNormalizado,
        valor: valorPago,
        caixinha: valorCaixinha,
        total: valorPago + valorCaixinha,
      });
    }
  });
  // Se não há receita paga, receitaTotal = 0
  if (!receitaTemPagamento) receitaTotal = 0;

  console.log("📊 RESUMO RECEITA DASHBOARD:", {
    mesSelecionado,
    anoSelecionado,
    totalPagamentos: pagamentos.length,
    pagamentosPagos: pagamentos.filter((p: any) => {
      const statusNormalizado =
        typeof p.status === "string"
          ? p.status.toLowerCase()
          : String(p.status).toLowerCase();
      return statusNormalizado === "pago";
    }).length,
    receitaTotal,
    receitaTemPagamento,
    TODOS_PAGAMENTOS_DETALHADO: pagamentos.map((p: any) => ({
      id: p.id,
      mesAno: p.mesAno,
      status: p.status,
      valor: p.valor,
      valorTipo: typeof p.valor,
      caixinha: p.caixinha,
      caixinhaTipo: typeof p.caixinha,
      valorNumero: Number(p.valor || 0),
      caixinhaNumero: Number(p.caixinha || 0),
      soma: Number(p.valor || 0) + Number(p.caixinha || 0),
    })),
  });

  // Despesas total filtrada
  const despesasTotal = despesasFiltradas.reduce(
    (acc: number, d: any) => acc + Number(d.valor || 0),
    0,
  );

  // Total em caixa = receita - despesas
  const totalEmCaixa = receitaTotal - despesasTotal;

  // Cards mostram valores totais do ano selecionado
  // Novo card: Total em Caixa Acumulado (todos os anos)
  // Buscar todas as despesas via backend
  const { data: todasDespesas = [] } = useSWR(
    userId ? ["todasDespesas", userId] : null,
    async () => {
      if (!userId) return [];
      return API.despesas.list(userId);
    },
  );
  // Buscar todos os pagamentos via backend
  const { data: todosPagamentos = [] } = useSWR(
    userId ? ["todosPagamentos", userId] : null,
    async () => {
      if (!userId) return [];
      return API.pagamentos.list(userId);
    },
  );
  // Buscar todos os moradores via backend
  const { data: todosMoradores = [] } = useSWR(
    userId ? ["todosMoradores", userId] : null,
    async () => {
      if (!userId) return [];
      return API.moradores.list(userId);
    },
  );
  // Agrupa despesas por mês/ano
  const todasDespesasPorMesAno: Record<string, any[]> = {};
  todasDespesas.forEach((d: any) => {
    if (!d.data) return;
    const dataStr = d.data.split("T")[0]; // Remove horário se existir
    const [ano, mes] = dataStr.split("-");
    const key = `${ano}-${mes}`;
    if (!todasDespesasPorMesAno[key]) todasDespesasPorMesAno[key] = [];
    todasDespesasPorMesAno[key].push(d);
  });
  // Calcula valores devidos por apartamento para cada mês/ano
  const todasValoresDevidosPorMesAno: Record<string, number[]> = {};
  Object.entries(todasDespesasPorMesAno).forEach(([key, despesasDoMes]) => {
    todasValoresDevidosPorMesAno[key] = todosMoradores.map(
      (morador: any, idx: number) => {
        return (despesasDoMes as any[]).reduce((acc: number, d: any) => {
          if (d.valoresporap && Array.isArray(d.valoresporap)) {
            return acc + Number(d.valoresporap[idx] || 0);
          }
          return acc;
        }, 0);
      },
    );
  });
  // Receita total acumulada
  let receitaTotalAcumulada = 0;
  todosPagamentos.forEach((p: any) => {
    // Compara status ignorando case (aceita "pago", "Pago", "PAGO")
    const statusNormalizado =
      typeof p.status === "string"
        ? p.status.toLowerCase()
        : String(p.status).toLowerCase();
    if (statusNormalizado === "pago") {
      const valorPago = Number(p.valor || 0);
      const valorCaixinha = Number(p.caixinha || 0);
      receitaTotalAcumulada += valorPago + valorCaixinha;
    }
  });

  console.log("📊 RESUMO ACUMULADO:", {
    totalPagamentosAcumulados: todosPagamentos.length,
    pagamentosPagosAcumulados: todosPagamentos.filter((p: any) => {
      const statusNormalizado =
        typeof p.status === "string"
          ? p.status.toLowerCase()
          : String(p.status).toLowerCase();
      return statusNormalizado === "pago";
    }).length,
    receitaTotalAcumulada,
    despesasTotalAcumulada: todasDespesas.reduce(
      (acc: number, d: any) => acc + Number(d.valor || 0),
      0,
    ),
  });
  // Despesas total acumulada
  const despesasTotalAcumulada = todasDespesas.reduce(
    (acc: number, d: any) => acc + Number(d.valor || 0),
    0,
  );
  // Total em caixa acumulado = receita acumulada - despesas acumulada
  const totalEmCaixaAcumulado = receitaTotalAcumulada - despesasTotalAcumulada;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      {/* Grid de Cards Minimalistas - Receita, Despesas e Total */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {/* Card Receita Total */}
        <div className="bg-linear-to-br from-blue-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-blue-100">
          <div className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Receita
              </h3>
              <span className="text-xl">💰</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              R${" "}
              {Number(receitaTotal).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* Card Despesas Total */}
        <div className="bg-linear-to-br from-red-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-red-100">
          <div className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Despesas
              </h3>
              <span className="text-xl">📉</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              R${" "}
              {despesasTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* Card Total em Caixa */}
        <div
          className={`bg-linear-to-br ${totalEmCaixa >= 0 ? "from-green-50 to-white border-green-100" : "from-orange-50 to-white border-orange-100"} rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border`}
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Saldo
              </h3>
              <span className="text-xl">{totalEmCaixa >= 0 ? "🏦" : "⚠️"}</span>
            </div>
            <div
              className={`text-2xl font-bold ${
                totalEmCaixa >= 0 ? "text-green-600" : "text-orange-600"
              }`}
            >
              R${" "}
              {totalEmCaixa.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros modernos - menor e embaixo dos cards */}
      <div className="bg-linear-to-r from-gray-50 to-white rounded-lg shadow-sm p-2 border border-gray-200">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="mes">
              📅 Mês
            </label>
            <select
              id="mes"
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:border-blue-400 min-w-[120px]"
            >
              <option value="">Todos</option>
              {[
                { value: "01", label: "Jan" },
                { value: "02", label: "Fev" },
                { value: "03", label: "Mar" },
                { value: "04", label: "Abr" },
                { value: "05", label: "Mai" },
                { value: "06", label: "Jun" },
                { value: "07", label: "Jul" },
                { value: "08", label: "Ago" },
                { value: "09", label: "Set" },
                { value: "10", label: "Out" },
                { value: "11", label: "Nov" },
                { value: "12", label: "Dez" },
              ].map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="ano">
              📊 Ano
            </label>
            <select
              id="ano"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:border-blue-400 min-w-[100px]"
            >
              <option value="">Todos</option>
              {Array.from({ length: 26 }, (_, i) => 2025 + i).map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

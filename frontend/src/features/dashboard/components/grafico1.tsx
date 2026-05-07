"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { API } from "@/services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function Grafico1() {
  const anoAtual = new Date().getFullYear();
  const [anoSelecionado, setAnoSelecionado] = useState(String(anoAtual));
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Buscar userId via backend Express
  useEffect(() => {
    API.auth
      .me()
      .then((data) => setUserId(data?.user?.id))
      .catch(() => setUserId(undefined));
  }, []);

  // Buscar moradores via backend
  const { data: moradores = [] } = useSWR(
    userId ? ["moradores", userId] : null,
    async () => {
      if (!userId) return [];
      return API.moradores.list(userId);
    },
  );

  // Buscar despesas via backend
  const { data: despesas = [] } = useSWR(
    userId ? ["despesas", anoSelecionado, userId] : null,
    async () => {
      if (!userId) return [];
      return API.despesas.list(userId);
    },
  );

  // Buscar pagamentos para calcular receita real
  const { data: pagamentosGerais = [] } = useSWR(
    userId ? ["pagamentos-grafico", anoSelecionado, userId] : null,
    async () => {
      if (!userId) return [];
      return API.pagamentos.list(userId);
    },
  );

  // Filtra despesas apenas do ano selecionado
  const despesasDoAno = despesas.filter((d: any) => {
    if (!d.data) return false;
    const dataStr = d.data.split("T")[0]; // Remove horário se existir
    const [ano] = dataStr.split("-");
    return ano === anoSelecionado;
  });

  // Agrupa despesas por mês (do ano selecionado)
  const despesasPorMes: Record<string, any[]> = {};
  despesasDoAno.forEach((d: any) => {
    if (!d.data) return;
    const dataStr = d.data.split("T")[0]; // Remove horário se existir
    const [ano, mes] = dataStr.split("-");
    if (!despesasPorMes[mes]) despesasPorMes[mes] = [];
    despesasPorMes[mes].push(d);
  });

  // Calcula valores devidos por apartamento para cada mês
  const valoresDevidosPorMes: Record<string, number[]> = {};
  Object.entries(despesasPorMes).forEach(([mes, despesasDoMes]) => {
    valoresDevidosPorMes[mes] = moradores.map((morador: any, idx: number) => {
      return (despesasDoMes as any[]).reduce((acc: number, d: any) => {
        if (d.valoresporap && Array.isArray(d.valoresporap)) {
          return acc + Number(d.valoresporap[idx] || 0);
        }
        return acc;
      }, 0);
    });
  });

  // Monta dados do gráfico reais
  const dadosGrafico = meses.map((nomeMes, i) => {
    const mes = String(i + 1).padStart(2, "0");
    const mesAno = `${anoSelecionado}-${mes}`;

    // Receita REAL: soma dos pagamentos com status "pago" do mês/ano
    const pagamentosFiltrados = pagamentosGerais.filter((p: any) => {
      // Compara status ignorando case
      const statusNormalizado =
        typeof p.status === "string"
          ? p.status.toLowerCase()
          : String(p.status).toLowerCase();
      return p.mesAno === mesAno && statusNormalizado === "pago";
    });

    console.log(`📊 GRAFICO - ${nomeMes}/${anoSelecionado}:`, {
      mesAno,
      totalPagamentos: pagamentosGerais.length,
      pagamentosMesAno: pagamentosGerais.filter((p: any) => p.mesAno === mesAno)
        .length,
      pagamentosFiltrados: pagamentosFiltrados.length,
      pagamentosExemplo: pagamentosGerais.slice(0, 2).map((p: any) => ({
        mesAno: p.mesAno,
        status: p.status,
        valor: p.valor,
        caixinha: p.caixinha,
      })),
    });

    const receitaPaga = pagamentosFiltrados.reduce((acc: number, p: any) => {
      const valorPago = Number(p.valor || 0);
      const valorCaixinha = Number(p.caixinha || 0);
      return acc + valorPago + valorCaixinha;
    }, 0);

    // Despesas: soma dos valores das despesas do mês
    const despesasTotal = (despesasPorMes[mes] || []).reduce(
      (acc: number, d: any) => acc + Number(d.valor || 0),
      0,
    );

    // Caixa: receita paga - despesas
    const caixa = receitaPaga - despesasTotal;

    return {
      mes: nomeMes,
      receita: receitaPaga,
      despesas: despesasTotal,
      caixa,
    };
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              📈 Evolução Financeira
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <label
              className="text-xs font-semibold text-gray-600"
              htmlFor="ano-grafico"
            >
              Ano:
            </label>
            <select
              id="ano-grafico"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 min-w-[100px]"
            >
              {Array.from({ length: 26 }, (_, i) => 2025 + i).map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto bg-linear-to-br from-gray-50 to-white rounded-lg p-2">
          <div style={{ minWidth: 600, width: "100%" }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={dadosGrafico}
                margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    padding: "8px",
                  }}
                  formatter={(value, name) => [
                    `R$ ${Number(value).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`,
                    name,
                  ]}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#374151",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                  iconSize={12}
                />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#2563eb"
                  name="💰 Receita"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6, fill: "#2563eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="despesas"
                  stroke="#dc2626"
                  name="📉 Despesas"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#dc2626" }}
                  activeDot={{ r: 6, fill: "#dc2626" }}
                />
                <Line
                  type="monotone"
                  dataKey="caixa"
                  stroke="#16a34a"
                  name="🏦 Saldo"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#16a34a" }}
                  activeDot={{ r: 6, fill: "#16a34a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

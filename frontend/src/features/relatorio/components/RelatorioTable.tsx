"use client";

import React from "react";
import { Despesa, Morador } from "@/features/relatorio/types";

interface RelatorioTableProps {
  despesasDoMes: Despesa[];
  moradores: Morador[];
  valoresFinais: number[];
  mesSelecionado: string;
  anoSelecionado: string;
  onMoradorClick: (morador: Morador, valor: number) => void;
}

export function RelatorioTable({
  despesasDoMes,
  moradores,
  valoresFinais,
  mesSelecionado,
  anoSelecionado,
  onMoradorClick,
}: RelatorioTableProps) {
  return (
    <div className="flex flex-col gap-8" id="relatorio-pdf">
      {/* Despesas detalhadas */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Data
                </th>
                <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Descrição
                </th>
                <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Categoria
                </th>
                <th className="py-2 px-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {despesasDoMes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">📋</span>
                      <p className="text-gray-500 font-medium">
                        Nenhuma despesa cadastrada para este mês
                      </p>
                      <p className="text-xs text-gray-400">
                        Mês/Ano: {mesSelecionado}/{anoSelecionado}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                despesasDoMes.map((d, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-2 px-4">
                      <span className="text-xs text-gray-900">
                        {(() => {
                          try {
                            // Remove o horário se existir (formato: 2026-02-21T00:00:00)
                            const dataStr = d.data.split("T")[0];
                            const [ano, mes, dia] = dataStr
                              .split("-")
                              .map(Number);
                            if (ano && mes && dia) {
                              const dataLocal = new Date(ano, mes - 1, dia);
                              return dataLocal.toLocaleDateString("pt-BR");
                            }
                            return dataStr;
                          } catch {
                            return d.data;
                          }
                        })()}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs text-gray-900 font-medium block truncate max-w-48">
                        {d.descricao}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {d.categoria}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <span className="text-xs font-bold text-green-600">
                        R${" "}
                        {Number(d.valor).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Valor por apartamento */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Apartamento
                </th>
                <th className="py-2 px-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Valor Devido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {moradores.map((morador, idx) => (
                <tr
                  key={morador.id}
                  className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => onMoradorClick(morador, valoresFinais[idx])}
                >
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                        <span className="text-purple-600 font-bold text-xs">
                          {morador.numero}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-900">
                        {morador.nome}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <span className="text-xs font-bold text-purple-600">
                      R${" "}
                      {valoresFinais[idx].toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

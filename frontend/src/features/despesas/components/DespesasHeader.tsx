import React from "react";

interface DespesasHeaderProps {
  totalMes: number;
  totalPagas: number;
  totalPendentes: number;
  totalItens: number;
}

export function DespesasHeader({
  totalMes,
  totalPagas,
  totalPendentes,
  totalItens,
}: DespesasHeaderProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-50 rounded-lg p-2">
            <span className="text-xl">💸</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Mês
            </div>
            <div className="text-xl font-bold text-gray-900">
              R${" "}
              {totalMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-green-50 rounded-lg p-2">
            <span className="text-xl">✅</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pagas
            </div>
            <div className="text-xl font-bold text-gray-900">{totalPagas}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-yellow-50 rounded-lg p-2">
            <span className="text-xl">⏳</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pendentes
            </div>
            <div className="text-xl font-bold text-gray-900">
              {totalPendentes}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-50 rounded-lg p-2">
            <span className="text-xl">📊</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Itens
            </div>
            <div className="text-xl font-bold text-gray-900">{totalItens}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

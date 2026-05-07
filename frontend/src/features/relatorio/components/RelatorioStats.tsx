"use client";

import React from "react";

interface RelatorioStatsProps {
  totalDespesas: number;
  quantidadeMoradores: number;
}

export function RelatorioStats({
  totalDespesas,
  quantidadeMoradores,
}: RelatorioStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <div className="bg-white rounded-xl shadow-lg p-5 border-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-2xl">📊</span>
          </div>
          <div>
            <div className="text-base text-gray-600">Total Despesas</div>
            <div className="text-2xl font-bold text-gray-900">
              R${" "}
              {totalDespesas.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 border-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-2xl">🏠</span>
          </div>
          <div>
            <div className="text-base text-gray-600">Apartamentos</div>
            <div className="text-2xl font-bold text-gray-900">
              {quantidadeMoradores}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

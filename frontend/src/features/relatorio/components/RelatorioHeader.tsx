"use client";

import React from "react";

interface RelatorioHeaderProps {
  mesSelecionado: string;
  anoSelecionado: string;
  onMesChange: (mes: string) => void;
  onAnoChange: (ano: string) => void;
}

const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export function RelatorioHeader({
  mesSelecionado,
  anoSelecionado,
  onMesChange,
  onAnoChange,
}: RelatorioHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-3">
          <select
            value={mesSelecionado}
            onChange={(e) => onMesChange(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={anoSelecionado}
            onChange={(e) => onAnoChange(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            {Array.from({ length: 2050 - 2020 + 1 }, (_, i) => 2020 + i).map(
              (ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ),
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

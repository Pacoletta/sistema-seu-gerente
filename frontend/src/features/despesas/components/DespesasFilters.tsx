import React from "react";
import { MonthNavigator } from "@/components/ui/MonthNavigator";

interface DespesasFiltersProps {
  buscaCategoria: string;
  setBuscaCategoria: (value: string) => void;
  mesSelecionado: string;
  setMesSelecionado: (value: string) => void;
  anoSelecionado: string;
  setAnoSelecionado: (value: string) => void;
  onNovaDesp: () => void;
  mostrarFormulario: boolean;
}

export function DespesasFilters({
  buscaCategoria,
  setBuscaCategoria,
  mesSelecionado,
  setMesSelecionado,
  anoSelecionado,
  setAnoSelecionado,
  onNovaDesp,
  mostrarFormulario,
}: DespesasFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-3 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Campo de busca */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por categoria..."
            value={buscaCategoria}
            onChange={(e) => setBuscaCategoria(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Navegador de mês */}
        <MonthNavigator
          mes={parseInt(mesSelecionado)}
          ano={parseInt(anoSelecionado)}
          onMesChange={(m) => setMesSelecionado(String(m).padStart(2, "0"))}
          onAnoChange={(a) => setAnoSelecionado(String(a))}
        />

        {/* Botão de ação */}
        <button
          type="button"
          onClick={onNovaDesp}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold text-base rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 whitespace-nowrap"
        >
          <span>{mostrarFormulario ? "➖" : "➕"}</span>
          {mostrarFormulario ? "Ocultar" : "Nova Despesa"}
        </button>
      </div>
    </div>
  );
}

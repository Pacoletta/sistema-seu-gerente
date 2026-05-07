import type { ReceitasFilters } from "@/features/receitas/types";
import { MonthNavigator } from "@/components/ui/MonthNavigator";

interface ReceitasFiltersBarProps {
  filters: ReceitasFilters;
  onFiltersChange: (filters: ReceitasFilters) => void;
  moradoresFiltrados: any[];
  onAporteClick: () => void;
}

export function ReceitasFiltersBar({
  filters,
  onFiltersChange,
  moradoresFiltrados,
  onAporteClick,
}: ReceitasFiltersBarProps) {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl p-3 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Campo de busca */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.searchTerm}
              onChange={(e) =>
                onFiltersChange({ ...filters, searchTerm: e.target.value })
              }
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            {filters.searchTerm && (
              <button
                onClick={() => onFiltersChange({ ...filters, searchTerm: "" })}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
            )}
          </div>

          {/* Navegador de mês */}
          <MonthNavigator
            mes={parseInt(filters.mesSelecionado)}
            ano={parseInt(filters.anoSelecionado)}
            onMesChange={(m) =>
              onFiltersChange({ ...filters, mesSelecionado: String(m).padStart(2, "0") })
            }
            onAnoChange={(a) =>
              onFiltersChange({ ...filters, anoSelecionado: String(a) })
            }
          />

          {/* Botão de adicionar aporte */}
          <button
            onClick={onAporteClick}
            className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm whitespace-nowrap"
          >
            <span>💰</span>
            <span>Adicionar Aporte Adicional</span>
          </button>
        </div>
        {filters.searchTerm && (
          <p className="mt-2 text-xs text-gray-600">
            {moradoresFiltrados.length} resultado(s) encontrado(s)
          </p>
        )}
      </div>
    </div>
  );
}

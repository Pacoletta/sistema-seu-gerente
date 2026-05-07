interface MelhoriasFiltersProps {
  activeTab: "melhorias" | "sugestoes";
  setActiveTab: (tab: "melhorias" | "sugestoes") => void;
  filtroStatus: string;
  setFiltroStatus: (status: string) => void;
  filtroPrioridade: string;
  setFiltroPrioridade: (prioridade: string) => void;
  totalMelhorias: number;
  totalSugestoes: number;
  onNovaMelhoria: () => void;
  onNovaSugestao: () => void;
}

export function MelhoriasFilters({
  activeTab,
  setActiveTab,
  filtroStatus,
  setFiltroStatus,
  filtroPrioridade,
  setFiltroPrioridade,
  totalMelhorias,
  totalSugestoes,
  onNovaMelhoria,
  onNovaSugestao,
}: MelhoriasFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("melhorias")}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
              activeTab === "melhorias"
                ? "bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            🏗️ Melhorias ({totalMelhorias})
          </button>
          <button
            onClick={() => setActiveTab("sugestoes")}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
              activeTab === "sugestoes"
                ? "bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            💡 Sugestões ({totalSugestoes})
          </button>
        </div>

        {activeTab === "melhorias" && (
          <div className="flex gap-2 flex-1">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:border-blue-400 min-w-[120px]"
            >
              <option value="todos">Todos Status</option>
              <option value="planejada">Planejada</option>
              <option value="aprovada">Aprovada</option>
              <option value="em_execucao">Em Execução</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>

            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:border-blue-400 min-w-[120px]"
            >
              <option value="todos">Todas Prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
        )}

        {activeTab === "melhorias" ? (
          <button
            onClick={onNovaMelhoria}
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg hover:from-gray-900 hover:via-slate-800 hover:to-blue-900 transition-all duration-200"
          >
            <span>➕</span>
            Nova Melhoria
          </button>
        ) : (
          <button
            onClick={onNovaSugestao}
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg hover:from-gray-900 hover:via-slate-800 hover:to-blue-900 transition-all duration-200"
          >
            <span>💡</span>
            Nova Sugestão
          </button>
        )}
      </div>
    </div>
  );
}

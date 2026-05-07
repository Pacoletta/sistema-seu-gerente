import type { MelhoriasStats } from "@/features/melhorias/types";

interface MelhoriasStatsProps {
  stats: MelhoriasStats;
}

export function MelhoriasStats({ stats }: MelhoriasStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
      <div className="bg-blue-50 rounded-lg shadow-sm p-3 border border-blue-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-100 rounded-lg p-2">
            <span className="text-xl">🏗️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Total
            </div>
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg shadow-sm p-3 border border-green-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-green-100 rounded-lg p-2">
            <span className="text-xl">💡</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Sugestões
            </div>
            <div className="text-xl font-bold text-green-600">
              {stats.sugestoes}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg shadow-sm p-3 border border-yellow-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-yellow-100 rounded-lg p-2">
            <span className="text-xl">🔨</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Execução
            </div>
            <div className="text-xl font-bold text-yellow-600">
              {stats.em_execucao}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg shadow-sm p-3 border border-emerald-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-100 rounded-lg p-2">
            <span className="text-xl">🏆</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Concluídas
            </div>
            <div className="text-xl font-bold text-emerald-600">
              {stats.concluidas}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg shadow-sm p-3 border border-blue-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-100 rounded-lg p-2">
            <span className="text-xl">✅</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Aprovadas
            </div>
            <div className="text-xl font-bold text-blue-600">
              {stats.aprovadas}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg shadow-sm p-3 border border-purple-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-100 rounded-lg p-2">
            <span className="text-xl">💰</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Custo Total
            </div>
            <div className="text-xl font-bold text-purple-600">
              R${" "}
              {stats.custo_total.toLocaleString("pt-BR", {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

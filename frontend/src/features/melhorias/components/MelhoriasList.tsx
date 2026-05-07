import type { Melhoria } from "@/features/melhorias/types";

interface MelhoriasListProps {
  melhorias: Melhoria[];
  onEdit: (melhoria: Melhoria) => void;
  onDelete: (id: string) => void;
  onStatusChange: (melhoria: Melhoria, novoStatus: string) => void;
  onPrioridadeChange: (melhoria: Melhoria, novaPrioridade: string) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "planejada":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "aprovada":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "em_execucao":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "concluida":
      return "bg-green-100 text-green-700 border-green-300";
    case "cancelada":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

function getPrioridadeColor(prioridade: string) {
  switch (prioridade) {
    case "baixa":
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    case "media":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "alta":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "urgente":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export function MelhoriasList({
  melhorias,
  onEdit,
  onDelete,
  onStatusChange,
  onPrioridadeChange,
}: MelhoriasListProps) {
  if (melhorias.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
        <span className="text-6xl mb-6 block">🏗️</span>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Nenhuma melhoria encontrada
        </h3>
        <p className="text-gray-600 mb-6">
          Tente ajustar os filtros para encontrar outras melhorias
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {melhorias.map((melhoria) => (
        <div
          key={melhoria.id}
          className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 flex-wrap flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {melhoria.titulo}
                </h3>

                <select
                  value={melhoria.status}
                  onChange={(e) => onStatusChange(melhoria, e.target.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border cursor-pointer bg-transparent ${getStatusColor(
                    melhoria.status,
                  )} hover:shadow-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage: "none",
                  }}
                  title="Clique para alterar o status"
                >
                  <option value="planejada">📋 Planejada</option>
                  <option value="aprovada">✅ Aprovada</option>
                  <option value="em_execucao">🔨 Em Execução</option>
                  <option value="concluida">🏆 Concluída</option>
                  <option value="cancelada">❌ Cancelada</option>
                </select>

                <select
                  value={melhoria.prioridade}
                  onChange={(e) => onPrioridadeChange(melhoria, e.target.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border cursor-pointer bg-transparent ${getPrioridadeColor(
                    melhoria.prioridade,
                  )} hover:shadow-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage: "none",
                  }}
                  title="Clique para alterar a prioridade"
                >
                  <option value="baixa">🟢 Baixa</option>
                  <option value="media">🟡 Média</option>
                  <option value="alta">🟠 Alta</option>
                  <option value="urgente">🔴 Urgente</option>
                </select>

                {melhoria.categoria && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">
                    📂 {melhoria.categoria}
                  </span>
                )}

                {melhoria.custoEstimado && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                    <span>💰</span>
                    <span>
                      R$ {melhoria.custoEstimado.toLocaleString("pt-BR")}
                    </span>
                  </div>
                )}

                {melhoria.responsavel && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>👤</span>
                    <span>{melhoria.responsavel}</span>
                  </div>
                )}

                {melhoria.dataInicio && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>📅</span>
                    <span>
                      {new Date(melhoria.dataInicio).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                )}

                {melhoria.dataFimPrevista && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>⏰</span>
                    <span>
                      {new Date(melhoria.dataFimPrevista).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(melhoria)}
                  className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(melhoria.id)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="mb-3 pl-2">
              <p className="text-gray-600 leading-relaxed">
                {melhoria.descricao}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
              <div className="flex-1">
                {melhoria.observacoes && (
                  <div className="flex items-start gap-1">
                    <span>📝</span>
                    <span>{melhoria.observacoes}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-4">
                <span>📋</span>
                <span>
                  Criado em:{" "}
                  {new Date(melhoria.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

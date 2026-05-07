import type { Sugestao } from "@/features/melhorias/types";

interface SugestoesListProps {
  sugestoes: Sugestao[];
  onEdit: (sugestao: Sugestao) => void;
  onDelete: (id: string) => void;
  onTransformar: (sugestao: Sugestao) => void;
}

export function SugestoesList({
  sugestoes,
  onEdit,
  onDelete,
  onTransformar,
}: SugestoesListProps) {
  if (sugestoes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
        <span className="text-6xl mb-6 block">💡</span>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Nenhuma sugestão cadastrada
        </h3>
        <p className="text-gray-600 mb-6">
          Comece adicionando as primeiras ideias e sugestões dos moradores
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sugestoes.map((sugestao) => (
        <div
          key={sugestao.id}
          className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 flex-wrap flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {sugestao.titulo}
                  </h3>
                </div>

                {sugestao.categoria && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                    📂 {sugestao.categoria}
                  </span>
                )}

                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium">
                  🎯 Ideia
                </span>

                <button
                  onClick={() => onTransformar(sugestao)}
                  className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 hover:from-gray-900 hover:via-slate-800 hover:to-blue-900 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg ml-auto"
                >
                  🔄 Virar Melhoria
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(sugestao)}
                  className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(sugestao.id)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="mb-3 pl-2">
              <p className="text-gray-600 leading-relaxed">
                {sugestao.descricao}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
              <div className="flex-1">
                {sugestao.observacoes && (
                  <div className="flex items-start gap-1">
                    <span>📝</span>
                    <span>{sugestao.observacoes}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-4">
                <span>📋</span>
                <span>
                  Criado em:{" "}
                  {new Date(sugestao.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

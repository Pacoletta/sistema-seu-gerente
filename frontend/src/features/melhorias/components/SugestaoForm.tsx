import type { Sugestao, SugestaoFormData } from "@/features/melhorias/types";

interface SugestaoFormProps {
  isOpen: boolean;
  editingSugestao: Sugestao | null;
  formData: SugestaoFormData;
  setFormData: (data: SugestaoFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function SugestaoForm({
  isOpen,
  editingSugestao,
  formData,
  setFormData,
  onSubmit,
  onClose,
}: SugestaoFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingSugestao ? "✏️ Editar Sugestão" : "💡 Nova Sugestão"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl hover:bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">💡</span>
              <div>
                <h4 className="font-semibold text-green-800 mb-1">
                  Sobre as Sugestões
                </h4>
                <p className="text-sm text-green-700">
                  Use esta seção para anotar ideias e sugestões simples dos
                  moradores. Não precisa de custos ou prazos - apenas capture as
                  ideias para análise futura!
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Sugestão *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Área de Coworking no Térreo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição da Ideia *
              </label>
              <textarea
                required
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={4}
                placeholder="Descreva a ideia ou sugestão dos moradores..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Lazer, Bem-estar, Sustentabilidade, Comodidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Adicionais
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Comentários adicionais, quem sugeriu, quando foi mencionado, etc..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 hover:from-gray-900 hover:via-slate-800 hover:to-blue-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
              >
                {editingSugestao ? "Atualizar" : "Salvar"} Sugestão
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

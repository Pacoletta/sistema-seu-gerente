import type { Morador } from "@/features/moradores/types";

type MoradoresListProps = {
  moradores: Morador[];
  searchTerm: string;
  onEdit: (index: number) => void;
};

export function MoradoresList({
  moradores,
  searchTerm,
  onEdit,
}: MoradoresListProps) {
  if (moradores.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="text-center py-20">
          <div className="text-7xl mb-5">🏠</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {searchTerm
              ? "Nenhum resultado encontrado"
              : "Nenhum morador cadastrado"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Tente buscar por outro termo"
              : 'Clique em "Adicionar Morador" para começar'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      {/* Versão mobile - Cards */}
      <div className="block md:hidden">
        <div className="p-4 space-y-4">
          {moradores.map((morador, i) => (
            <div
              key={morador.id}
              className="rounded-lg p-2 border bg-white border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                    <span className="font-bold text-xs">{morador.numero}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs leading-tight">
                      {morador.nome}
                    </h3>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                        morador.tipo === "morador"
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {morador.tipo === "morador" ? "● Morador" : "○ Inquilino"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-0.5 text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">☎</span>
                  <span>{morador.telefone || "-"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">✉</span>
                  <span className="text-gray-700 break-all">
                    {morador.email || "-"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  className="w-full px-2 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs"
                  onClick={() => onEdit(i)}
                >
                  ✎ Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Versão desktop - Tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Apartamento
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Morador
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Tipo
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Contato
              </th>
              <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {moradores.map((morador, i) => (
              <tr
                key={morador.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                      <span className="font-bold text-sm">
                        {morador.numero}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {morador.nome}
                    </div>
                    <div className="text-xs text-gray-500">
                      {morador.email || "-"}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      morador.tipo === "morador"
                        ? "bg-green-50 text-green-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {morador.tipo === "morador" ? "● Morador" : "○ Inquilino"}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span>☎</span>
                    <span>{morador.telefone || "-"}</span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center gap-1.5">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs"
                      onClick={() => onEdit(i)}
                    >
                      ✎ Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
import { Despesa } from "@/features/despesas/types";
import { formatarDataExibicao } from "@/lib/dateUtils";

interface DespesasTableProps {
  despesas: Despesa[];
  uploadingDespesas: Set<string>;
  onStatusChange: (idx: number, status: "paga" | "pendente") => void;
  onComprovanteChange: (despesa: Despesa, file: File | null) => void;
  onRemoverComprovante: (despesa: Despesa) => void;
  onDelete: (idx: number) => void;
}

export function DespesasTable({
  despesas,
  uploadingDespesas,
  onStatusChange,
  onComprovanteChange,
  onRemoverComprovante,
  onDelete,
}: DespesasTableProps) {
  if (despesas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          💳
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma despesa encontrada
        </h3>
        <p className="text-gray-500">
          Adicione uma nova despesa usando o formulário acima.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      {/* Versão mobile - Cards */}
      <div className="block md:hidden">
        <div className="p-2 space-y-3">
          {despesas.map((d, idx) => (
            <div
              key={idx}
              className="rounded-lg p-3 border bg-white border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {d.categoria}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      (d.status || "pendente") === "paga"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {(d.status || "pendente") === "paga"
                      ? "✓ Paga"
                      : "⏳ Pendente"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatarDataExibicao(d.data)}
                </span>
              </div>

              <h3
                className="font-semibold text-gray-900 text-sm mb-2 truncate"
                title={d.descricao}
              >
                {d.descricao}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-red-600">
                  R${" "}
                  {Number(d.valor).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    d.tipoDivisao === "igual"
                      ? "bg-green-50 text-green-700"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {d.tipoDivisao === "igual"
                    ? "Divisão igual"
                    : "Divisão personalizada"}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={d.status || "pendente"}
                  onChange={(e) =>
                    onStatusChange(idx, e.target.value as "paga" | "pendente")
                  }
                  className={`flex-1 border rounded-lg px-2 py-2 text-xs font-medium focus:outline-none ${
                    (d.status || "pendente") === "paga"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }`}
                >
                  <option value="pendente">Pendente</option>
                  <option value="paga">Paga</option>
                </select>

                <input
                  id={`file-upload-mobile-${idx}`}
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    onComprovanteChange(d, e.target.files?.[0] || null)
                  }
                  disabled={uploadingDespesas.has(d.id || "")}
                />
                <label
                  htmlFor={`file-upload-mobile-${idx}`}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    uploadingDespesas.has(d.id || "")
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {uploadingDespesas.has(d.id || "") ? "⏳" : "📎"}
                </label>

                {d.comprovanteUrl && (
                  <a
                    href={d.comprovanteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-green-100 text-green-600 text-xs font-medium"
                  >
                    👁️
                  </a>
                )}

                <button
                  onClick={() => onDelete(idx)}
                  className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-medium"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Versão desktop - Tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Data
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Descrição
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Categoria
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Valor
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Divisão
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider">
                Comprovante
              </th>
              <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {despesas.map((d, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-2 px-4 text-xs text-gray-900 font-medium">
                  {formatarDataExibicao(d.data)}
                </td>
                <td className="py-2 px-4">
                  <div className="max-w-24">
                    <span
                      title={d.descricao}
                      className="text-xs text-gray-900 font-medium cursor-help hover:text-blue-600 transition-colors block truncate"
                    >
                      {d.descricao.length > 20
                        ? `${d.descricao.slice(0, 20)}...`
                        : d.descricao}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {d.categoria}
                  </span>
                </td>
                <td className="py-2 px-4 text-xs font-bold text-red-600">
                  R${" "}
                  {Number(d.valor).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      d.tipoDivisao === "igual"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {d.tipoDivisao === "igual" ? "Igual" : "Personalizada"}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <select
                    value={d.status || "pendente"}
                    onChange={(e) =>
                      onStatusChange(idx, e.target.value as "paga" | "pendente")
                    }
                    className={`border rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 ${
                      (d.status || "pendente") === "paga"
                        ? "bg-green-100 text-green-800 border-green-300 focus:ring-green-500"
                        : "bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-500"
                    }`}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="paga">Paga</option>
                  </select>
                </td>
                <td className="py-2 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      id={`file-upload-${idx}`}
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        onComprovanteChange(d, e.target.files?.[0] || null)
                      }
                      disabled={uploadingDespesas.has(d.id || "")}
                    />
                    <label
                      htmlFor={`file-upload-${idx}`}
                      title={
                        uploadingDespesas.has(d.id || "")
                          ? "⏳ Enviando..."
                          : "📎 Anexar comprovante"
                      }
                      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                        uploadingDespesas.has(d.id || "")
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 cursor-pointer"
                      }`}
                    >
                      {uploadingDespesas.has(d.id || "") ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                          />
                        </svg>
                      )}
                    </label>

                    {d.comprovanteUrl && (
                      <a
                        href={d.comprovanteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="👁️ Ver comprovante"
                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9s-9-4-9-9 4.03-9 9-9 9 4 9 9z"
                          />
                        </svg>
                      </a>
                    )}

                    {d.comprovanteUrl && (
                      <button
                        type="button"
                        onClick={() => onRemoverComprovante(d)}
                        title="🗑️ Remover comprovante"
                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => onDelete(idx)}
                    title="Deletar despesa"
                    className="inline-flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

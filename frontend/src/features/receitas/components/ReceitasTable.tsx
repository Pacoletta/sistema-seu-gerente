import type { Morador, Pagamento } from "@/features/receitas/types";

interface ReceitasTableProps {
  moradoresFiltrados: Morador[];
  valoresDevidos: number[];
  findPagamentoByMorador: (moradorId: string) => Pagamento | undefined;
  uploadingFiles: Set<string>;
  onStatusChange: (moradorId: string, status: string) => void;
  onDataPagamentoChange: (moradorId: string, data: string | null) => void;
  onFileUpload: (moradorId: string, file: File) => void;
  onComprovanteRemove: (moradorId: string) => void;
  formatarDataBrasil: (data: string | null) => string;
  converterDataParaUTC: (data: string) => string;
}

export function ReceitasTable({
  moradoresFiltrados,
  valoresDevidos,
  findPagamentoByMorador,
  uploadingFiles,
  onStatusChange,
  onDataPagamentoChange,
  onFileUpload,
  onComprovanteRemove,
  formatarDataBrasil,
  converterDataParaUTC,
}: ReceitasTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Versão mobile - Cards */}
      <div className="block md:hidden">
        <div className="p-4 space-y-4">
          {moradoresFiltrados.map((morador, idx) => {
            const pagamento = findPagamentoByMorador(morador.id);
            const valorDevido = Number(valoresDevidos[idx] || 0);

            return (
              <div
                key={`${morador.numero}-${morador.nome}-${idx}`}
                className="bg-white rounded-xl p-3 border border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {morador.numero}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {morador.nome}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                          pagamento?.status === "pago"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-orange-100 text-orange-700 border border-orange-200"
                        }`}
                      >
                        {pagamento?.status === "pago"
                          ? "✅ Pago"
                          : "⏳ Pendente"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-700">
                      R${" "}
                      {valorDevido.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💰 Valor Total
                    </label>
                    <div className="text-blue-600 font-bold text-lg">
                      R${" "}
                      {valorDevido.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💸 Aporte Adicional
                    </label>
                    <div className="text-green-600 font-bold text-lg">
                      R${" "}
                      {Number(pagamento?.caixinha || 0).toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Status
                    </label>
                    <select
                      value={pagamento?.status || "pendente"}
                      onChange={(e) =>
                        onStatusChange(morador.id, e.target.value)
                      }
                      className={`w-full rounded-lg px-3 py-2 text-sm font-medium border shadow-sm transition-all ${
                        pagamento?.status === "pago"
                          ? "border-green-200 bg-green-50 text-green-700 focus:ring-1 focus:ring-green-400"
                          : "border-orange-200 bg-orange-50 text-orange-700 focus:ring-1 focus:ring-orange-400"
                      }`}
                    >
                      <option value="pendente">⏳ Pendente</option>
                      <option value="pago">✅ Pago</option>
                    </select>
                  </div>

                  {pagamento?.status === "pago" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Data do Pagamento
                      </label>
                      <input
                        type="date"
                        value={formatarDataBrasil(pagamento?.dataPagamento)}
                        onChange={(e) =>
                          onDataPagamentoChange(
                            morador.id,
                            e.target.value
                              ? converterDataParaUTC(e.target.value)
                              : null,
                          )
                        }
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      className={`cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-lg transition-all text-xs font-medium shadow-sm ${
                        uploadingFiles.has(`${morador.id}_upload`)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        capture="environment"
                        style={{ display: "none" }}
                        disabled={uploadingFiles.has(`${morador.id}_upload`)}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onFileUpload(morador.id, file);
                        }}
                      />
                      {uploadingFiles.has(`${morador.id}_upload`) ? (
                        <>⏳</>
                      ) : (
                        <>📎</>
                      )}
                    </label>

                    {pagamento?.urlComprovante && (
                      <>
                        <a
                          href={pagamento?.urlComprovante}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ver comprovante"
                          className="inline-flex items-center p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          👁️
                        </a>
                        <button
                          type="button"
                          onClick={() => onComprovanteRemove(morador.id)}
                          title="Remover comprovante"
                          className="inline-flex items-center p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Versão desktop - Tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
            <tr>
              <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider">
                Apartamento
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Valor
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Aporte
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Data Pagamento
              </th>
              <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider">
                Comprovante
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {moradoresFiltrados.map((morador, idx) => {
              const pagamento = findPagamentoByMorador(morador.id);
              const valorDevido = Number(valoresDevidos[idx] || 0);
              return (
                <tr
                  key={morador.numero + "-" + morador.nome + "-" + idx}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-2 px-4 font-bold text-gray-800 text-sm text-center">
                    {morador.numero}
                  </td>
                  <td className="py-2 px-4 text-blue-600 font-semibold text-sm">
                    R${" "}
                    {valorDevido.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-4 text-green-600 font-semibold text-sm">
                    R${" "}
                    {Number(pagamento?.caixinha || 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="py-2 px-4">
                    <select
                      value={pagamento?.status || "pendente"}
                      onChange={(e) =>
                        onStatusChange(morador.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-lg font-semibold text-xs border transition-all duration-200 ${
                        pagamento?.status === "pago"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-orange-300 bg-orange-50 text-orange-700"
                      }`}
                    >
                      <option value="pendente">⏳ Pendente</option>
                      <option value="pago">✅ Pago</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="date"
                      value={formatarDataBrasil(pagamento?.dataPagamento)}
                      onChange={(e) =>
                        onDataPagamentoChange(
                          morador.id,
                          e.target.value
                            ? converterDataParaUTC(e.target.value)
                            : null,
                        )
                      }
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                      disabled={pagamento?.status !== "pago"}
                      title={
                        pagamento?.status !== "pago"
                          ? "Só pode informar a data se estiver pago"
                          : ""
                      }
                    />
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2 justify-center">
                      {/* Anexar comprovante */}
                      <label
                        className={`inline-flex items-center justify-center ${
                          uploadingFiles.has(`${morador.id}_upload`)
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          capture="environment"
                          style={{ display: "none" }}
                          disabled={uploadingFiles.has(`${morador.id}_upload`)}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onFileUpload(morador.id, file);
                          }}
                        />
                        <span
                          title={
                            uploadingFiles.has(`${morador.id}_upload`)
                              ? "⏳ Enviando..."
                              : "📎 Anexar comprovante"
                          }
                          className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                            uploadingFiles.has(`${morador.id}_upload`)
                              ? "bg-gray-200 text-gray-500"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 cursor-pointer"
                          }`}
                        >
                          {uploadingFiles.has(`${morador.id}_upload`) ? (
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
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3A2.25 2.25 0 0 0 8.25 5.25V9m7.5 0v9A2.25 2.25 0 0 1 13.5 20.25h-3A2.25 2.25 0 0 1 8.25 18V9m7.5 0h-7.5"
                              />
                            </svg>
                          )}
                        </span>
                      </label>
                      {/* Visualizar comprovante */}
                      {pagamento?.urlComprovante && (
                        <a
                          href={pagamento?.urlComprovante}
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
                      {/* Remover comprovante */}
                      {pagamento?.urlComprovante && (
                        <button
                          type="button"
                          title="🗑️ Remover comprovante"
                          className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors"
                          onClick={() => onComprovanteRemove(morador.id)}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

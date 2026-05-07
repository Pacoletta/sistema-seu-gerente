import type { Morador } from "@/features/receitas/types";
import * as React from "react";

interface AporteModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (
    valor: string,
    moradorIds: string[],
    paraTodos: boolean,
  ) => Promise<boolean>;
  moradores: Morador[];
  mesSelecionado: string;
  anoSelecionado: string;
}

export function AporteModal({
  show,
  onClose,
  onSave,
  moradores,
  mesSelecionado,
  anoSelecionado,
}: AporteModalProps) {
  const [valorAporte, setValorAporte] = React.useState("");
  const [tipoEnvio, setTipoEnvio] = React.useState<"todos" | "selecionados">(
    "todos",
  );
  const [moradoresSelecionados, setMoradoresSelecionados] = React.useState<
    string[]
  >([]);

  const handleClose = () => {
    setValorAporte("");
    setTipoEnvio("todos");
    setMoradoresSelecionados([]);
    onClose();
  };

  const handleToggleMorador = (moradorId: string) => {
    setMoradoresSelecionados((prev) =>
      prev.includes(moradorId)
        ? prev.filter((id) => id !== moradorId)
        : [...prev, moradorId],
    );
  };

  const handleToggleTodos = () => {
    if (moradoresSelecionados.length === moradores.length) {
      setMoradoresSelecionados([]);
    } else {
      setMoradoresSelecionados(moradores.map((m) => m.id));
    }
  };

  const handleSave = async () => {
    const success = await onSave(
      valorAporte,
      moradoresSelecionados,
      tipoEnvio === "todos",
    );
    if (success) {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#10b981 #f3f4f6",
        }}
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100 -mt-6 -mx-6 px-6 pt-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>💰</span>
            Adicionar Aporte Adicional
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Valor do Aporte */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💵 Valor do Aporte (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={valorAporte}
              onChange={(e) => setValorAporte(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg font-semibold"
            />
          </div>

          {/* Tipo de Envio */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              🏢 Destinatários
            </label>

            <div className="space-y-2">
              {/* Opção: Todos */}
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="tipoEnvio"
                  checked={tipoEnvio === "todos"}
                  onChange={() => setTipoEnvio("todos")}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex-1">
                  <span className="text-base font-bold text-gray-800">
                    Todos os apartamentos
                  </span>
                  <p className="text-xs text-gray-500">
                    Adicionar aporte para todos ({moradores.length} aps)
                  </p>
                </div>
              </label>

              {/* Opção: Selecionados */}
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="tipoEnvio"
                  checked={tipoEnvio === "selecionados"}
                  onChange={() => setTipoEnvio("selecionados")}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex-1">
                  <span className="text-base font-bold text-gray-800">
                    Selecionar apartamentos
                  </span>
                  <p className="text-xs text-gray-500">
                    Escolher um ou vários apartamentos
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Lista de Apartamentos (quando "selecionados") */}
          {tipoEnvio === "selecionados" && (
            <div className="border-2 border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <span className="text-sm font-semibold text-gray-700">
                  Selecione os apartamentos:
                </span>
                <button
                  type="button"
                  onClick={handleToggleTodos}
                  className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  {moradoresSelecionados.length === moradores.length
                    ? "Desmarcar todos"
                    : "Selecionar todos"}
                </button>
              </div>

              <div
                className="space-y-1.5 max-h-48 overflow-y-auto pr-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#10b981 #f3f4f6",
                }}
              >
                {moradores.map((morador) => (
                  <label
                    key={morador.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={moradoresSelecionados.includes(morador.id)}
                      onChange={() => handleToggleMorador(morador.id)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Ap {morador.numero} - {morador.nome}
                    </span>
                  </label>
                ))}
              </div>

              {moradoresSelecionados.length > 0 && (
                <div className="mt-3 pt-2 border-t">
                  <p className="text-xs font-semibold text-green-700">
                    ✓ {moradoresSelecionados.length} apartamento(s)
                    selecionado(s)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Informação */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">ℹ️ Info:</span> O aporte será
              adicionado{" "}
              {tipoEnvio === "todos"
                ? `a TODOS os ${moradores.length} apartamentos`
                : moradoresSelecionados.length > 0
                  ? `a ${moradoresSelecionados.length} apartamento(s) selecionado(s)`
                  : "aos apartamentos que você escolher"}{" "}
              no mês {mesSelecionado}/{anoSelecionado}.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={
                !valorAporte ||
                (tipoEnvio === "selecionados" &&
                  moradoresSelecionados.length === 0)
              }
              className="flex-1 px-4 py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Salvar Aporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

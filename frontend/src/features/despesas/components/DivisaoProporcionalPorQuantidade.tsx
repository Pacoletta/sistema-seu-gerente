import React, { useState } from "react";
import { useEffect } from "react";

interface Morador {
  numero: string | number;
  nome: string;
}

interface Props {
  moradores: Morador[];
  valorTotal: number;
}

export default function DivisaoProporcionalPorQuantidade({
  moradores,
  valorTotal,
  onChange,
}: Props & {
  onChange?: (
    quantidadeTotal: number,
    quantidadesPorAp: number[],
    valoresPorAp: number[]
  ) => void;
}) {
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  const [quantidadesPorAp, setQuantidadesPorAp] = useState<number[]>(
    Array(moradores.length).fill(0)
  );
  const [erroDivisao, setErroDivisao] = useState("");

  // Calcula os valores proporcionais
  const valoresPorAp = quantidadesPorAp.map((qtd) =>
    quantidadeTotal > 0
      ? Number(((qtd / quantidadeTotal) * valorTotal).toFixed(2))
      : 0
  );
  const somaValores = valoresPorAp.reduce((acc, v) => acc + Number(v), 0);

  return (
    <div className="space-y-4">
      {/* Header com título, total e quantidade total - tudo em uma linha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">%</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Divisão Proporcional
            </h4>
            <p className="text-xs text-gray-500">Configure por apartamento</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Quantidade Total
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={quantidadeTotal}
            onChange={(e) => {
              const novoValor = Number(e.target.value);
              setQuantidadeTotal(novoValor);
              onChange?.(novoValor, quantidadesPorAp, valoresPorAp);
            }}
            placeholder="Ex: 100"
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
            required
          />
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">Total</p>
          <div className="border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50">
            <p className="text-sm font-bold text-purple-600">
              R${" "}
              {somaValores.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela moderna com cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-linear-to-r from-purple-600 to-purple-700 px-4 py-2">
          <div className="grid grid-cols-3 gap-4 text-white text-xs font-semibold uppercase tracking-wider">
            <div>Apartamento</div>
            <div>Quantidade</div>
            <div className="text-right">Valor</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {moradores.map((morador, idx) => (
            <div
              key={morador.numero + "-" + morador.nome + "-" + idx}
              className="grid grid-cols-3 gap-4 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
            >
              {/* Apartamento */}
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-bold text-xs">
                    {morador.numero}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-900 truncate">
                  {morador.nome}
                </span>
              </div>

              {/* Quantidade */}
              <div className="flex items-center">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={quantidadesPorAp[idx] || ""}
                  onChange={(e) => {
                    const novas = [...quantidadesPorAp];
                    novas[idx] = Number(e.target.value);
                    setQuantidadesPorAp(novas);
                    onChange?.(
                      quantidadeTotal,
                      novas,
                      novas.map((qtd) =>
                        quantidadeTotal > 0
                          ? Number(
                              ((qtd / quantidadeTotal) * valorTotal).toFixed(2)
                            )
                          : 0
                      )
                    );
                  }}
                  placeholder="0"
                  className="w-full border-2 border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                />
              </div>

              {/* Valor */}
              <div className="flex items-center justify-end">
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-600">
                    R${" "}
                    {valoresPorAp[idx].toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  {quantidadeTotal > 0 && (
                    <div className="text-xs text-gray-500">
                      {(
                        (quantidadesPorAp[idx] / quantidadeTotal) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Área de erro modernizada */}
      {erroDivisao && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-red-800 font-semibold text-sm">
                {erroDivisao}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumo estatístico */}
      {quantidadeTotal > 0 && (
        <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-purple-600 uppercase tracking-wide font-medium mb-1">
                Quantidade Total
              </p>
              <p className="text-lg font-bold text-purple-700">
                {quantidadeTotal.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-xs text-purple-600 uppercase tracking-wide font-medium mb-1">
                Valor Distribuído
              </p>
              <p className="text-lg font-bold text-purple-700">
                R${" "}
                {somaValores.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

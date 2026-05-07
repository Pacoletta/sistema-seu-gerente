import React, { useState } from "react";
import { API } from "@/services/api";
import { Despesa, Melhoria, Morador, CATEGORIAS } from "@/features/despesas/types";
import DivisaoProporcionalPorQuantidade from "./DivisaoProporcionalPorQuantidade";

interface DespesasFormProps {
  form: Despesa;
  setForm: React.Dispatch<React.SetStateAction<Despesa>>;
  editIdx: number | null;
  setEditIdx: (idx: number | null) => void;
  despesas: Despesa[];
  moradores: Morador[];
  melhorias: Melhoria[];
  mutate: () => Promise<any>;
  userId: string | null;
  erroSupabase: string;
  setErroSupabase: (error: string) => void;
}

export function DespesasForm({
  form,
  setForm,
  editIdx,
  setEditIdx,
  despesas,
  moradores,
  melhorias,
  mutate,
  userId,
  erroSupabase,
  setErroSupabase,
}: DespesasFormProps) {
  const [erroDivisao, setErroDivisao] = useState("");
  const [mostrarDivisaoProporcional, setMostrarDivisaoProporcional] =
    useState(false);
  const [valoresProporcionais, setValoresProporcionais] = useState<number[]>(
    Array(moradores.length).fill(0),
  );

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    if (name.startsWith("ap_")) {
      const idx = Number(name.replace("ap_", ""));
      setForm((f) => {
        const novos = f.valoresPorAp
          ? [...f.valoresPorAp]
          : Array(moradores.length).fill(0);
        novos[idx] = Number(value);
        return { ...f, valoresPorAp: novos };
      });
    } else if (name === "tipoDivisao") {
      setForm((f) => ({
        ...f,
        tipoDivisao: value as "igual" | "personalizada",
      }));
    } else if (name === "melhoriaId") {
      if (value) {
        const melhoriaSelecionada = melhorias.find((m) => m.id === value);
        if (melhoriaSelecionada) {
          setForm((f) => ({
            ...f,
            melhoriaId: value,
            origem: "melhoria",
            descricao: `Custo da melhoria: ${melhoriaSelecionada.titulo}`,
            valor: melhoriaSelecionada.custo_estimado || 0,
            categoria: "Manutenção",
          }));
        }
      } else {
        setForm((f) => ({
          ...f,
          melhoriaId: undefined,
          origem: "despesa",
          descricao: "",
          valor: 0,
          categoria: "Outros",
        }));
      }
    } else {
      setForm((f) => ({
        ...f,
        [name]: name === "valor" ? Number(value) : value,
      }));
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroDivisao("");
    if (!form.descricao || !form.valor || !form.data) return;

    let valoresPorAp = form.valoresPorAp || [];
    if (form.tipoDivisao === "igual") {
      const valorIgual = Number((form.valor / moradores.length).toFixed(2));
      valoresPorAp = Array(moradores.length).fill(valorIgual);
    } else {
      valoresPorAp = valoresProporcionais;
      const soma = valoresPorAp.reduce((acc, v) => acc + Number(v), 0);
      if (Number(soma.toFixed(2)) !== Number(form.valor.toFixed(2))) {
        setErroDivisao(
          "A soma dos valores dos apartamentos deve ser igual ao valor total da despesa.",
        );
        return;
      }
    }

    setErroSupabase("");
    if (!userId) {
      setErroSupabase("Usuário não autenticado!");
      return;
    }

    if (editIdx !== null) {
      const id = despesas[editIdx].id;
      const updateData: any = {
        descricao: form.descricao,
        valor: form.valor,
        data: form.data,
        categoria: form.categoria,
        tipoDivisao: form.tipoDivisao || "",
        valoresPorAp: valoresPorAp.length ? valoresPorAp : null,
        comprovanteUrl: form.comprovanteUrl || null,
        status: form.status || "pendente",
      };
      if (form.melhoriaId !== undefined) {
        updateData.melhoriaId = form.melhoriaId;
      }
      if (form.origem !== undefined) {
        updateData.origem = form.origem;
      }
      try {
        await API.despesas.update(id!, updateData);
        await mutate();
        setEditIdx(null);
      } catch (error) {
        setErroSupabase("Erro ao atualizar despesa");
      }
    } else {
      const despesaData: any = {
        descricao: form.descricao,
        valor: form.valor,
        data: form.data,
        categoria: form.categoria,
        tipoDivisao: form.tipoDivisao || "",
        valoresPorAp: valoresPorAp.length ? valoresPorAp : null,
        comprovanteUrl: form.comprovanteUrl || null,
        status: form.status || "pendente",
        usuarioId: userId,
      };
      if (form.melhoriaId) {
        despesaData.melhoriaId = form.melhoriaId;
      }
      if (form.origem && form.origem !== "despesa") {
        despesaData.origem = form.origem;
      }
      try {
        await API.despesas.create(despesaData);
        await mutate();
      } catch (error) {
        setErroSupabase("Erro ao criar despesa");
        return;
      }
    }

    setForm({
      id: undefined,
      descricao: "",
      valor: 0,
      data: "",
      categoria: "Outros",
      tipoDivisao: "igual",
      valoresPorAp: Array(moradores.length).fill(0),
      status: "pendente",
      comprovanteUrl: undefined,
      melhoriaId: undefined,
      origem: "despesa",
    });
  }

  return (
    <div className="bg-linear-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Seção Principal - Dados da Despesa */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-lg">📝</span>
            Informações da Despesa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <span className="text-base">📄</span>
                Descrição
              </label>
              <input
                type="text"
                name="descricao"
                placeholder="Ex: Conta de luz..."
                value={form.descricao}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-400"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <span className="text-base">💰</span>
                Valor (R$)
              </label>
              <input
                type="number"
                name="valor"
                placeholder="0,00"
                value={form.valor ? form.valor : ""}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-400"
                min={0.01}
                step={0.01}
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <span className="text-base">📅</span>
                Data
              </label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-400"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <span className="text-base">🏷️</span>
                Categoria
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-400"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seção de Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Origem da Despesa */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <span className="text-base">🎯</span>
              Origem da Despesa
            </label>
            <select
              name="melhoriaId"
              value={form.melhoriaId || ""}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-400"
            >
              <option value="">Despesa comum</option>
              {melhorias.map((melhoria) => (
                <option key={melhoria.id} value={melhoria.id}>
                  🏗️ {melhoria.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Divisão */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <span className="text-base">📊</span>
              Tipo de Divisão
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <input
                  type="radio"
                  name="tipoDivisao"
                  value="igual"
                  checked={form.tipoDivisao === "igual"}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Dividir igualmente
                </span>
              </label>
              <label className="flex items-center p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <input
                  type="radio"
                  name="tipoDivisao"
                  value="personalizada"
                  checked={form.tipoDivisao === "personalizada"}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Valor personalizado
                </span>
              </label>
            </div>
          </div>

          {/* Divisão Proporcional */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <span className="text-base">⚡</span>
              Divisão Proporcional
            </label>
            <button
              type="button"
              onClick={() => {
                if (form.tipoDivisao === "personalizada") {
                  setMostrarDivisaoProporcional(!mostrarDivisaoProporcional);
                }
              }}
              disabled={form.tipoDivisao !== "personalizada"}
              className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                form.tipoDivisao === "personalizada"
                  ? "bg-linear-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-md cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {mostrarDivisaoProporcional ? "🔽 Ocultar" : "🧮 Abrir"}{" "}
              Calculadora
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {form.tipoDivisao !== "personalizada"
                ? "Selecione 'Valor personalizado'"
                : "Divida baseado nas quantidades"}
            </p>
          </div>
        </div>

        {/* Botão de Lançar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-green-600 to-green-700 text-white font-bold text-base rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
          >
            <span className="text-lg">💾</span>
            Lançar Despesa
          </button>
        </div>

        {mostrarDivisaoProporcional && form.tipoDivisao === "personalizada" && (
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            {form.origem === "melhoria" && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <span>💡</span>
                  <span className="font-semibold">Dica para Melhorias:</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Para custos de melhorias, considere dividir igualmente ou use
                  a divisão proporcional por número de moradores/área.
                </p>
              </div>
            )}
            <DivisaoProporcionalPorQuantidade
              moradores={moradores}
              valorTotal={form.valor}
              onChange={(_, __, valoresPorAp) => {
                setValoresProporcionais(valoresPorAp);
              }}
            />
          </div>
        )}

        {erroDivisao && (
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-800">Atenção:</p>
              <p className="text-sm text-orange-700 mt-1">{erroDivisao}</p>
            </div>
          </div>
        )}

        {erroSupabase && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                Erro ao lançar despesa:
              </p>
              <p className="text-sm text-red-700 mt-1">{erroSupabase}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

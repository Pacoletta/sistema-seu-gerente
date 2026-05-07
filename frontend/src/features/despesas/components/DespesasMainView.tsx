import React from "react";
import { DespesasHeader } from "./DespesasHeader";
import { DespesasFilters } from "./DespesasFilters";
import { DespesasForm } from "./DespesasForm";
import { DespesasTable } from "./DespesasTable";
import { Despesa } from "@/features/despesas/types";

interface DespesasMainViewProps {
  // Header
  totalMes: number;
  totalPagas: number;
  totalPendentes: number;
  totalItens: number;

  // Filters
  buscaCategoria: string;
  setBuscaCategoria: (valor: string) => void;
  mesSelecionado: string;
  setMesSelecionado: (mes: string) => void;
  anoSelecionado: string;
  setAnoSelecionado: (ano: string) => void;
  onNovaDesp: () => void;
  mostrarFormulario: boolean;

  // Form
  form: Despesa;
  setForm: (form: Despesa) => void;
  editIdx: number | null;
  setEditIdx: (idx: number | null) => void;
  despesas: Despesa[];
  moradores: any[];
  melhorias: any[];
  mutate: () => Promise<any>;
  userId: string | null;
  erroSupabase: string | null;
  setErroSupabase: (erro: string | null) => void;

  // Table
  despesasDoMesOrdenadas: Despesa[];
  uploadingDespesas: Set<string>;
  onStatusChange: (idx: number, status: "paga" | "pendente") => void;
  onComprovanteChange: (despesa: Despesa, file: File | null) => void;
  onRemoverComprovante: (despesa: Despesa) => void;
  onDelete: (idx: number) => void;
}

export function DespesasMainView({
  totalMes,
  totalPagas,
  totalPendentes,
  totalItens,
  buscaCategoria,
  setBuscaCategoria,
  mesSelecionado,
  setMesSelecionado,
  anoSelecionado,
  setAnoSelecionado,
  onNovaDesp,
  mostrarFormulario,
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
  despesasDoMesOrdenadas,
  uploadingDespesas,
  onStatusChange,
  onComprovanteChange,
  onRemoverComprovante,
  onDelete,
}: DespesasMainViewProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <DespesasHeader
          totalMes={totalMes}
          totalPagas={totalPagas}
          totalPendentes={totalPendentes}
          totalItens={totalItens}
        />

        <DespesasFilters
          buscaCategoria={buscaCategoria}
          setBuscaCategoria={setBuscaCategoria}
          mesSelecionado={mesSelecionado}
          setMesSelecionado={setMesSelecionado}
          anoSelecionado={anoSelecionado}
          setAnoSelecionado={setAnoSelecionado}
          onNovaDesp={onNovaDesp}
          mostrarFormulario={mostrarFormulario}
        />

        {mostrarFormulario && (
          <DespesasForm
            form={form}
            setForm={setForm}
            editIdx={editIdx}
            setEditIdx={setEditIdx}
            despesas={despesas}
            moradores={moradores}
            melhorias={melhorias}
            mutate={mutate}
            userId={userId}
            erroSupabase={erroSupabase}
            setErroSupabase={setErroSupabase}
          />
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-2 sm:p-4 md:p-6">
            <DespesasTable
              despesas={despesasDoMesOrdenadas}
              uploadingDespesas={uploadingDespesas}
              onStatusChange={onStatusChange}
              onComprovanteChange={onComprovanteChange}
              onRemoverComprovante={onRemoverComprovante}
              onDelete={onDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

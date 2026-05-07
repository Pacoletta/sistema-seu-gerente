"use client";

import React, { useState } from "react";
import { ReceitasStatsCards } from "./ReceitasStats";
import { ReceitasFiltersBar } from "./ReceitasFiltersBar";
import { ReceitasTable } from "./ReceitasTable";
import { AporteModal } from "./AporteModal";
import { useReceitasData } from "@/features/receitas/hooks/useReceitasData";
import { useReceitasActions } from "@/features/receitas/hooks/useReceitasActions";

export function ReceitasMainView() {
  const {
    userId,
    isLoadingAuth,
    moradores,
    moradoresFiltrados,
    despesas,
    despesasDoMes,
    pagamentos,
    filters,
    setFilters,
    valorTotalMes,
    valoresDevidos,
    findPagamentoByMorador,
    valorTotalGeralPago,
    mutateMoradores,
    mutatePagamentos,
    isLoadingMoradores,
  } = useReceitasData();

  const {
    uploadingFiles,
    formatarDataBrasil,
    converterDataParaUTC,
    atualizarPagamento,
    salvarAporte,
    handleFileUpload,
    handleComprovanteRemove,
  } = useReceitasActions({
    userId,
    moradores,
    moradoresFiltrados,
    pagamentos,
    valoresDevidos,
    mesSelecionado: filters.mesSelecionado,
    anoSelecionado: filters.anoSelecionado,
    findPagamentoByMorador,
    mutatePagamentos,
  });

  const [showAporteModal, setShowAporteModal] = useState(false);

  // Handlers
  const handleStatusChange = (moradorId: string, status: string) => {
    atualizarPagamento(moradorId, { status });
  };

  const handleDataPagamentoChange = (
    moradorId: string,
    data: string | null,
  ) => {
    atualizarPagamento(moradorId, { dataPagamento: data });
  };

  const handleSaveAporte = async (
    valor: string,
    moradorIds: string[],
    paraTodos: boolean,
  ) => {
    const success = await salvarAporte(valor, moradorIds, paraTodos);
    if (success) {
      setShowAporteModal(false);
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        {/* Estatísticas rápidas */}
        <ReceitasStatsCards
          moradores={moradores}
          findPagamentoByMorador={findPagamentoByMorador}
          valorTotalGeralPago={valorTotalGeralPago}
        />

        {/* Filtros modernos */}
        <ReceitasFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          moradoresFiltrados={moradoresFiltrados}
          onAporteClick={() => setShowAporteModal(true)}
        />

        {/* Tabela de recebimentos moderna */}
        <ReceitasTable
          moradoresFiltrados={moradoresFiltrados}
          valoresDevidos={valoresDevidos}
          findPagamentoByMorador={findPagamentoByMorador}
          uploadingFiles={uploadingFiles}
          onStatusChange={handleStatusChange}
          onDataPagamentoChange={handleDataPagamentoChange}
          onFileUpload={handleFileUpload}
          onComprovanteRemove={handleComprovanteRemove}
          formatarDataBrasil={formatarDataBrasil}
          converterDataParaUTC={converterDataParaUTC}
        />

        {/* Modal de Aporte Adicional */}
        <AporteModal
          show={showAporteModal}
          onClose={() => setShowAporteModal(false)}
          onSave={handleSaveAporte}
          moradores={moradores}
          mesSelecionado={filters.mesSelecionado}
          anoSelecionado={filters.anoSelecionado}
        />
      </main>
    </div>
  );
}

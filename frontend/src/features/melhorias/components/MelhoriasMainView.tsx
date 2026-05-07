"use client";
import { MelhoriasStats } from "./MelhoriasStats";
import { MelhoriasFilters } from "./MelhoriasFilters";
import { MelhoriasList } from "./MelhoriasList";
import { SugestoesList } from "./SugestoesList";
import { MelhoriaForm } from "./MelhoriaForm";
import { SugestaoForm } from "./SugestaoForm";
import { useMelhoriasData } from "@/features/melhorias/hooks/useMelhoriasData";
import { useMelhoriasActions } from "@/features/melhorias/hooks/useMelhoriasActions";

interface MelhoriasMainViewProps {
  userId: string | null;
  isLoadingAuth: boolean;
}

export function MelhoriasMainView({
  userId,
  isLoadingAuth,
}: MelhoriasMainViewProps) {
  const {
    melhorias,
    sugestoes,
    melhoriasFiltradas,
    mutateMelhorias,
    mutateSugestoes,
    filtroStatus,
    setFiltroStatus,
    filtroPrioridade,
    setFiltroPrioridade,
    activeTab,
    setActiveTab,
    stats,
  } = useMelhoriasData(userId);

  const {
    showModal,
    showSugestaoModal,
    editingMelhoria,
    editingSugestao,
    formData,
    setFormData,
    sugestaoFormData,
    setSugestaoFormData,
    salvarMelhoria,
    deletarMelhoria,
    salvarSugestao,
    deletarSugestao,
    transformarEmMelhoria,
    abrirModal,
    fecharModal,
    abrirSugestaoModal,
    fecharSugestaoModal,
    atualizarStatus,
    atualizarPrioridade,
  } = useMelhoriasActions(userId, mutateMelhorias, mutateSugestoes);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-8">
      <main className="max-w-7xl mx-auto">
        <MelhoriasStats stats={stats} />

        <MelhoriasFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          filtroPrioridade={filtroPrioridade}
          setFiltroPrioridade={setFiltroPrioridade}
          totalMelhorias={stats.total}
          totalSugestoes={stats.sugestoes}
          onNovaMelhoria={() => abrirModal()}
          onNovaSugestao={() => abrirSugestaoModal()}
        />

        {activeTab === "melhorias" ? (
          melhoriasFiltradas.length === 0 && melhorias.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
              <span className="text-6xl mb-6 block">🏗️</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Nenhuma melhoria cadastrada
              </h3>
              <p className="text-gray-600 mb-6">
                Comece adicionando as primeiras melhorias do seu condomínio
              </p>
              <button
                onClick={() => abrirModal()}
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200"
              >
                ➕ Adicionar Primeira Melhoria
              </button>
            </div>
          ) : (
            <MelhoriasList
              melhorias={melhoriasFiltradas}
              onEdit={abrirModal}
              onDelete={deletarMelhoria}
              onStatusChange={atualizarStatus}
              onPrioridadeChange={atualizarPrioridade}
            />
          )
        ) : (
          <SugestoesList
            sugestoes={sugestoes}
            onEdit={abrirSugestaoModal}
            onDelete={deletarSugestao}
            onTransformar={transformarEmMelhoria}
          />
        )}

        <MelhoriaForm
          isOpen={showModal}
          editingMelhoria={editingMelhoria}
          formData={formData}
          setFormData={setFormData}
          onSubmit={salvarMelhoria}
          onClose={fecharModal}
        />

        <SugestaoForm
          isOpen={showSugestaoModal}
          editingSugestao={editingSugestao}
          formData={sugestaoFormData}
          setFormData={setSugestaoFormData}
          onSubmit={salvarSugestao}
          onClose={fecharSugestaoModal}
        />
      </main>
    </div>
  );
}

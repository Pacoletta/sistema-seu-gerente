"use client";

import React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDespesasData } from "@/features/despesas/hooks/useDespesasData";
import { useDespesasActions } from "@/features/despesas/hooks/useDespesasActions";
import { useDespesasForm } from "@/features/despesas/hooks/useDespesasForm";
import { DespesasMainView } from "@/features/despesas/components/DespesasMainView";

export default function Despesas() {
  const { userId } = useAuth();

  const {
    moradores,
    melhorias,
    despesas,
    despesasDoMesOrdenadas,
    mutate,
    mesSelecionado,
    setMesSelecionado,
    anoSelecionado,
    setAnoSelecionado,
    buscaCategoria,
    setBuscaCategoria,
    totalMes,
  } = useDespesasData(userId);

  const {
    uploadingDespesas,
    erroSupabase,
    setErroSupabase,
    handleDelete,
    handleComprovanteChange,
    handleRemoverComprovante,
    handleStatusChange,
  } = useDespesasActions(despesas, moradores, mutate, userId);

  const {
    form,
    setForm,
    editIdx,
    setEditIdx,
    mostrarFormulario,
    setMostrarFormulario,
    handleNovaDesp,
  } = useDespesasForm({
    moradores,
    anoSelecionado,
    mesSelecionado,
  });

  const totalPagas = despesasDoMesOrdenadas.filter(
    (d) => d.status === "paga",
  ).length;
  const totalPendentes = despesasDoMesOrdenadas.filter(
    (d) => d.status === "pendente",
  ).length;

  return (
    <DespesasMainView
      totalMes={totalMes}
      totalPagas={totalPagas}
      totalPendentes={totalPendentes}
      totalItens={despesasDoMesOrdenadas.length}
      buscaCategoria={buscaCategoria}
      setBuscaCategoria={setBuscaCategoria}
      mesSelecionado={mesSelecionado}
      setMesSelecionado={setMesSelecionado}
      anoSelecionado={anoSelecionado}
      setAnoSelecionado={setAnoSelecionado}
      onNovaDesp={() => {
        if (mostrarFormulario) {
          setMostrarFormulario(false);
        } else {
          handleNovaDesp();
        }
      }}
      mostrarFormulario={mostrarFormulario}
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
      despesasDoMesOrdenadas={despesasDoMesOrdenadas}
      uploadingDespesas={uploadingDespesas}
      onStatusChange={handleStatusChange}
      onComprovanteChange={handleComprovanteChange}
      onRemoverComprovante={handleRemoverComprovante}
      onDelete={handleDelete}
    />
  );
}

import { useState } from "react";
import { Despesa } from "@/features/despesas/types";

interface UseDespesasFormProps {
  moradores: any[];
  anoSelecionado: string;
  mesSelecionado: string;
}

export function useDespesasForm({
  moradores,
  anoSelecionado,
  mesSelecionado,
}: UseDespesasFormProps) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const getDataPadrao = () => {
    return `${anoSelecionado}-${mesSelecionado}-01`;
  };

  const [form, setForm] = useState<Despesa>({
    id: undefined,
    descricao: "",
    valor: 0,
    data: getDataPadrao(),
    categoria: "Outros",
    tipoDivisao: "igual",
    valoresPorAp: Array(moradores.length).fill(0),
    status: "pendente",
    comprovanteUrl: undefined,
    melhoriaId: undefined,
    origem: "despesa",
  });

  function handleNovaDesp() {
    setForm({
      id: undefined,
      descricao: "",
      valor: 0,
      data: getDataPadrao(),
      categoria: "Outros",
      tipoDivisao: "igual",
      valoresPorAp: Array(moradores.length).fill(0),
      status: "pendente",
      comprovanteUrl: undefined,
      melhoriaId: undefined,
      origem: "despesa",
    });
    setEditIdx(null);
    setMostrarFormulario(true);
  }

  return {
    form,
    setForm,
    editIdx,
    setEditIdx,
    mostrarFormulario,
    setMostrarFormulario,
    handleNovaDesp,
    getDataPadrao,
  };
}

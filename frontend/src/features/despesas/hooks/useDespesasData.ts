import { useState } from "react";
import useSWR from "swr";
import { API } from "@/services/api";
import { Despesa, Melhoria, Morador } from "@/features/despesas/types";

export function useDespesasData(userId: string | null) {
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const now = new Date();
    return String(now.getMonth() + 1).padStart(2, "0");
  });
  const [anoSelecionado, setAnoSelecionado] = useState(() => {
    const now = new Date();
    return String(now.getFullYear());
  });
  const [buscaCategoria, setBuscaCategoria] = useState("");

  const {
    data: moradores = [],
    isLoading: isLoadingMoradores,
    mutate: mutateMoradores,
  } = useSWR<Morador[]>(
    userId ? ["moradores", userId] : null,
    () => API.moradores.list(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const {
    data: melhorias = [],
    isLoading: isLoadingMelhorias,
    mutate: mutateMelhorias,
  } = useSWR<Melhoria[]>(
    userId ? ["melhorias", userId] : null,
    () => API.melhorias.list(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const {
    data: despesas = [],
    isLoading,
    mutate,
  } = useSWR<Despesa[]>(
    userId ? ["despesas", userId] : null,
    () => API.despesas.list(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const despesasDoMes = despesas.filter((d) => {
    if (!d.data) return false;
    const dataObj = new Date(d.data);
    const ano = String(dataObj.getFullYear());
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    return anoSelecionado === ano && mesSelecionado === mes;
  });

  const despesasFiltradas = despesasDoMes.filter((d) => {
    if (!buscaCategoria) return true;
    return d.categoria.toLowerCase().includes(buscaCategoria.toLowerCase());
  });

  const despesasDoMesOrdenadas = [...despesasFiltradas].sort((a, b) => {
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  const totaisPorAp = moradores.map((_, idx) => {
    return despesasDoMesOrdenadas.reduce((acc, d) => {
      if (
        d.valoresPorAp &&
        Array.isArray(d.valoresPorAp) &&
        d.valoresPorAp[idx]
      ) {
        return acc + Number(d.valoresPorAp[idx]);
      }
      return acc;
    }, 0);
  });

  const totalMes = despesasDoMesOrdenadas.reduce(
    (acc, d) => acc + Number(d.valor),
    0,
  );

  return {
    moradores,
    melhorias,
    despesas,
    despesasDoMesOrdenadas,
    isLoading,
    isLoadingMoradores,
    isLoadingMelhorias,
    mutate,
    mutateMoradores,
    mutateMelhorias,
    mesSelecionado,
    setMesSelecionado,
    anoSelecionado,
    setAnoSelecionado,
    buscaCategoria,
    setBuscaCategoria,
    totaisPorAp,
    totalMes,
  };
}

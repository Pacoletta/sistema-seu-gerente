import { useState } from "react";
import useSWR from "swr";
import { API } from "@/services/api";
import type {
  Melhoria,
  Sugestao,
  MelhoriasStats,
} from "@/features/melhorias/types";

export function useMelhoriasData(userId: string | null) {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("todos");
  const [activeTab, setActiveTab] = useState<"melhorias" | "sugestoes">(
    "melhorias",
  );

  const { data: melhorias = [], mutate: mutateMelhorias } = useSWR<Melhoria[]>(
    userId ? ["melhorias", userId] : null,
    () => API.melhorias.list(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const { data: sugestoes = [], mutate: mutateSugestoes } = useSWR<Sugestao[]>(
    userId ? ["sugestoes", userId] : null,
    () => API.sugestoes.list(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const melhoriasFiltradas = melhorias.filter((melhoria) => {
    const matchStatus =
      filtroStatus === "todos" || melhoria.status === filtroStatus;
    const matchPrioridade =
      filtroPrioridade === "todos" || melhoria.prioridade === filtroPrioridade;
    return matchStatus && matchPrioridade;
  });

  const stats: MelhoriasStats = {
    total: melhorias.length,
    sugestoes: sugestoes.length,
    planejadas: melhorias.filter((m) => m.status === "planejada").length,
    aprovadas: melhorias.filter((m) => m.status === "aprovada").length,
    em_execucao: melhorias.filter((m) => m.status === "em_execucao").length,
    concluidas: melhorias.filter((m) => m.status === "concluida").length,
    custo_total: melhorias.reduce((sum, m) => sum + (m.custoEstimado || 0), 0),
  };

  return {
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
  };
}

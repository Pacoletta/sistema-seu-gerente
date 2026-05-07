import { useState, useEffect } from "react";
import useSWR from "swr";
import { API } from "@/services/api";
import { backendFetch } from "@/services/httpClient";
import { Despesa, Morador, Pagamento } from "@/features/relatorio/types";

export function useRelatorioData(
  userId: string | null,
  mesSelecionado: string,
  anoSelecionado: string,
) {
  const {
    data: despesas = [],
    isLoading: isLoadingDespesas,
    mutate: mutateDespesas,
  } = useSWR<Despesa[]>(
    userId ? ["despesas", mesSelecionado, anoSelecionado, userId] : null,
    async () => {
      if (!userId) return [];
      return API.despesas.list(userId);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const { data: moradores = [], isLoading: isLoadingMoradores } = useSWR<
    Morador[]
  >(
    userId ? ["moradores", userId] : null,
    async () => {
      if (!userId) return [];
      return API.moradores.list(userId);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const { data: pagamentos = [], isLoading: isLoadingPagamentos } = useSWR<
    Pagamento[]
  >(
    ["pagamentos-relatorio", mesSelecionado, anoSelecionado, userId],
    async () => {
      if (!userId) return [];
      try {
        const mesAno = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}`;
        const res = await backendFetch(
          `/api/pagamentos?usuario_id=${userId}&mes_ano=${mesAno}`,
        );
        if (!res.ok) return [];
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return [];
        }
        const data = await res.json();
        return data || [];
      } catch (error) {
        return [];
      }
    },
  );

  const findPagamentoByMorador = (moradorId: string) => {
    return pagamentos.find((p: any) => p.moradorId === moradorId);
  };

  return {
    despesas,
    moradores,
    pagamentos,
    isLoading: isLoadingDespesas || isLoadingMoradores || isLoadingPagamentos,
    mutateDespesas,
    findPagamentoByMorador,
  };
}

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { API } from "@/services/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { backendFetch } from "@/services/httpClient";
import type {
  Morador,
  Despesa,
  Pagamento,
  ReceitasFilters,
} from "@/features/receitas/types";

export function useReceitasData() {
  const { userId, isLoading: isLoadingAuth } = useAuth();

  // Estado para seleção de mês/ano e busca
  const now = new Date();
  const [filters, setFilters] = useState<ReceitasFilters>({
    mesSelecionado: String(now.getMonth() + 1).padStart(2, "0"),
    anoSelecionado: String(now.getFullYear()),
    searchTerm: "",
  });

  // Fetch de moradores
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

  // Fetch de despesas
  const { data: despesas = [] } = useSWR<Despesa[]>(
    userId ? ["despesas", userId] : null,
    () => API.despesas.list(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  // Fetch de pagamentos
  const { data: pagamentos = [], mutate: mutatePagamentos } = useSWR<
    Pagamento[]
  >(
    ["pagamentos", filters.mesSelecionado, filters.anoSelecionado, userId],
    async () => {
      if (!userId) return [];
      try {
        const mesAno = `${filters.anoSelecionado}-${filters.mesSelecionado.padStart(2, "0")}`;
        const res = await backendFetch(
          `/api/pagamentos?usuario_id=${userId}&mes_ano=${mesAno}`,
        );
        if (!res.ok) return [];
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return [];
        }
        const data = await res.json();
        console.log("📥 Pagamentos recebidos do backend:", {
          total: data?.length,
          dados: data?.map((p: any) => ({
            id: p.id,
            moradorId: p.moradorId,
            mesAno: p.mesAno,
            status: p.status,
            urlComprovante: p.urlComprovante,
            url_comprovante: p.url_comprovante,
            statusType: typeof p.status,
          })),
        });
        console.log(
          "📥 DADOS COMPLETOS (JSON):",
          JSON.stringify(data, null, 2),
        );
        return data || [];
      } catch (error) {
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      dedupingInterval: 0, // Desabilita deduplicação para forçar refetch
    },
  );

  // Filtra despesas pelo mês/ano selecionados
  const despesasDoMes = useMemo(() => {
    return despesas.filter((d) => {
      if (!d.data) return false;
      const [ano, mes] = d.data.split("-");
      return filters.anoSelecionado === ano && filters.mesSelecionado === mes;
    });
  }, [despesas, filters.anoSelecionado, filters.mesSelecionado]);

  // Calcula o valor total do mês
  const valorTotalMes = useMemo(() => {
    return despesasDoMes.reduce((acc, d) => acc + Number(d.valor || 0), 0);
  }, [despesasDoMes]);

  // Aplicar filtro de busca nos moradores
  const moradoresFiltrados = useMemo(() => {
    return moradores.filter((m) => {
      if (!filters.searchTerm) return true;
      const termo = filters.searchTerm.toLowerCase();
      return m.numero?.toString().toLowerCase().includes(termo);
    });
  }, [moradores, filters.searchTerm]);

  // Calcula o valor devido por apartamento para o mês/ano selecionado
  const valoresDevidos = useMemo(() => {
    return moradoresFiltrados.map((morador) => {
      // Encontra o índice correto no array original de moradores
      const moradorIndex = moradores.findIndex((m) => m.id === morador.id);

      return despesasDoMes.reduce((acc, d) => {
        if (d.valoresPorAp && Array.isArray(d.valoresPorAp)) {
          // Usa o índice do morador no array original
          return acc + Number(d.valoresPorAp[moradorIndex] || 0);
        }
        return acc;
      }, 0);
    });
  }, [moradoresFiltrados, moradores, despesasDoMes]);

  // Função auxiliar para encontrar pagamento por morador no mês/ano selecionado
  const findPagamentoByMorador = useCallback(
    (moradorId: string): Pagamento | undefined => {
      const mesAno = `${filters.anoSelecionado}-${filters.mesSelecionado.padStart(2, "0")}`;
      const resultado = pagamentos.find(
        (p) => p.moradorId === moradorId && p.mesAno === mesAno,
      );

      // Log para debug
      console.log("🔎 findPagamentoByMorador:", {
        buscando_moradorId: moradorId,
        buscando_mesAno: mesAno,
        totalPagamentos: pagamentos.length,
        pagamentosDisponiveis: pagamentos.map((p) => ({
          moradorId: p.moradorId,
          mesAno: p.mesAno,
          status: p.status,
          match: p.moradorId === moradorId && p.mesAno === mesAno,
        })),
        encontrado: !!resultado,
        statusEncontrado: resultado?.status,
      });

      return resultado;
    },
    [pagamentos, filters.anoSelecionado, filters.mesSelecionado],
  );

  // Soma total dos pagamentos pagos
  const valorTotalGeralPago = useMemo(() => {
    return moradoresFiltrados.reduce((acc, morador, idx) => {
      const pagamento = findPagamentoByMorador(morador.id);
      if (pagamento && pagamento.status === "pago") {
        const valorDevido = Number(valoresDevidos[idx] || 0);
        return acc + valorDevido;
      }
      return acc;
    }, 0);
  }, [moradoresFiltrados, pagamentos, valoresDevidos, findPagamentoByMorador]);

  return {
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
  };
}

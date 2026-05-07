"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { API } from "@/services/api";
import type { Morador } from "@/features/moradores/types";

export function useMoradoresData(
  userId: string | null,
  userEmail: string | undefined,
) {
  const [isClient, setIsClient] = useState(false);
  const [quantidadeApartamentos, setQuantidadeApartamentos] =
    useState<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Buscar quantidade de apartamentos da tabela cadastro via API
  useEffect(() => {
    async function buscarQuantidadeApartamentos() {
      if (!userEmail) return;

      try {
        console.log("🔍 Buscando cadastro para email:", userEmail);

        const res = await fetch(
          `/api/cadastro?email=${encodeURIComponent(userEmail)}`,
        );

        if (!res.ok) {
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return;
        }

        const data = await res.json();

        if (data?.quantidade_apartamentos) {
          setQuantidadeApartamentos(Number(data.quantidade_apartamentos));
        }
      } catch (err) {}
    }

    buscarQuantidadeApartamentos();
  }, [userEmail]);

  // SWR para buscar moradores via backend Express
  console.log("🔍 useMoradoresData - Estado:", {
    isClient,
    userId,
    hasKey: !!(isClient && userId),
  });

  const {
    data: moradores = [],
    isLoading,
    mutate,
    error,
  } = useSWR<Morador[]>(
    isClient && userId ? ["moradores", userId] : null,
    async () => {
      if (!userId) {
        console.warn("⚠️ userId não definido, não é possível buscar moradores");
        return [];
      }
      console.log("🔍 Buscando moradores para userId:", userId);
      try {
        const result = await API.moradores.list(userId);
        console.log(
          "✅ Moradores recebidos:",
          result?.length || 0,
          "itens",
          result,
        );
        return result;
      } catch (err) {
        console.error("❌ Erro ao buscar moradores:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      onError: (err) => {
        console.error("🐞 Erro no SWR de moradores:", err);
      },
    },
  );

  useEffect(() => {
    if (error) {
      console.error("🚨 Erro detectado ao carregar moradores:", error);
    }
    if (isLoading) {
      console.log("⏳ Carregando moradores...");
    }
    if (!isLoading && moradores) {
      console.log("🏢 Total de moradores carregados:", moradores.length);
    }
  }, [error, isLoading, moradores]);

  return {
    moradores,
    isLoading,
    mutate,
    quantidadeApartamentos,
  };
}

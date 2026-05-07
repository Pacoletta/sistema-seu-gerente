import { useMemo } from "react";
import { Despesa, Morador } from "@/features/relatorio/types";

export function useRelatorioCalculations(
  despesas: Despesa[],
  moradores: Morador[],
  mesSelecionado: string,
  anoSelecionado: string,
) {
  const despesasDoMes = useMemo(() => {
    return despesas.filter((d) => {
      if (!d.data) return false;
      const [ano, mes] = d.data.split("-");
      const mesPadded = mesSelecionado.padStart(2, "0");
      return anoSelecionado === ano && mesPadded === mes;
    });
  }, [despesas, mesSelecionado, anoSelecionado]);

  const totalDespesas = useMemo(() => {
    return despesasDoMes.reduce((acc, d) => acc + Number(d.valor), 0);
  }, [despesasDoMes]);

  const valoresFinais = useMemo(() => {
    return moradores.map((morador, idx) => {
      let valorCalculado = 0;

      despesasDoMes.forEach((d) => {
        const valorDespesa = Number(d.valor) || 0;

        if (valorDespesa > 0) {
          if (d.valoresPorAp) {
            let valoresArray = d.valoresPorAp;

            if (typeof valoresArray === "string") {
              try {
                const cleanString = valoresArray.replace(/[{}]/g, "");
                valoresArray = cleanString
                  .split(",")
                  .map((v) => Number(v.trim()));
              } catch (e) {
                valoresArray = null;
              }
            }

            if (
              Array.isArray(valoresArray) &&
              valoresArray[idx] !== undefined
            ) {
              valorCalculado += Number(valoresArray[idx]) || 0;
            } else {
              valorCalculado += valorDespesa / moradores.length;
            }
          } else if (d.tipoDivisao === "igual" || !d.tipoDivisao) {
            valorCalculado += valorDespesa / moradores.length;
          }
        }
      });

      return valorCalculado;
    });
  }, [despesasDoMes, moradores]);

  return {
    despesasDoMes,
    totalDespesas,
    valoresFinais,
  };
}

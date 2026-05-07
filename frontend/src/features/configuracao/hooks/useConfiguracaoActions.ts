import { useState } from "react";
import { API } from "@/services/api";
import { backendFetch } from "@/services/httpClient";
import {
  UseConfiguracaoActionsReturn,
  ConfiguracaoFormData,
} from "@/features/configuracao/types";

interface UseConfiguracaoActionsProps {
  userId: string | null;
  setMsg: (msg: string) => void;
  mensagemRelatorio: string;
  mensagemCobranca: string;
  envioAutomaticoAtivo: boolean;
  diaEnvioRelatorio: string;
  diaEnvioCobranca: string;
  horaEnvioRelatorio: string;
  horaEnvioCobranca: string;
  mesReferenciaCobranca: string;
  diaVencimento: string;
  pixCobranca: string;
  pixNomeBeneficiario: string;
}

export function useConfiguracaoActions(
  props: UseConfiguracaoActionsProps,
): UseConfiguracaoActionsReturn {
  const [loading, setLoading] = useState(false);

  async function salvarConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!props.userId) {
      props.setMsg("Erro: Usuário não identificado");
      return;
    }

    setLoading(true);
    props.setMsg("");

    try {
      const configResult = await API.configuracao.update(props.userId, {
        mensagemRelatorio: props.mensagemRelatorio,
        mensagemCobranca: props.mensagemCobranca,
        envioAutomaticoAtivo: props.envioAutomaticoAtivo,
        diaEnvioRelatorio: parseInt(props.diaEnvioRelatorio),
        diaEnvioCobranca: parseInt(props.diaEnvioCobranca),
        horaEnvioRelatorio: props.horaEnvioRelatorio,
        horaEnvioCobranca: props.horaEnvioCobranca,
        mesReferenciaCobranca: props.mesReferenciaCobranca,
        diaVencimento: parseInt(props.diaVencimento),
        pixCobranca: props.pixCobranca,
        pixNomeBeneficiario: props.pixNomeBeneficiario,
      });

      console.log("✅ Configuração salva com sucesso:", configResult);
      props.setMsg("✅ Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      props.setMsg("❌ Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  }

  return {
    salvarConfig,
  };
}

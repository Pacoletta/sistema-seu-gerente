"use client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConfiguracaoData } from "@/features/configuracao/hooks/useConfiguracaoData";
import { useConfiguracaoActions } from "@/features/configuracao/hooks/useConfiguracaoActions";
import { ConfiguracaoMainView } from "@/features/configuracao/components/ConfiguracaoMainView";

export default function Configuracao() {
  const { userId } = useAuth();
  const data = useConfiguracaoData(userId);

  const { salvarConfig } = useConfiguracaoActions({
    userId,
    setMsg: data.setMsg,
    mensagemRelatorio: data.mensagemRelatorio,
    mensagemCobranca: data.mensagemCobranca,
    envioAutomaticoAtivo: data.envioAutomaticoAtivo,
    diaEnvioRelatorio: data.diaEnvioRelatorio,
    diaEnvioCobranca: data.diaEnvioCobranca,
    horaEnvioRelatorio: data.horaEnvioRelatorio,
    horaEnvioCobranca: data.horaEnvioCobranca,
    mesReferenciaCobranca: data.mesReferenciaCobranca,
    diaVencimento: data.diaVencimento,
    pixCobranca: data.pixCobranca,
    pixNomeBeneficiario: data.pixNomeBeneficiario,
  });

  return (
    <ConfiguracaoMainView
      userId={userId}
      data={data}
      onSalvarConfig={salvarConfig}
    />
  );
}

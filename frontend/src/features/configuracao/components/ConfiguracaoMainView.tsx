import React from "react";
import { UseConfiguracaoDataReturn } from "@/features/configuracao/types";
import { ConfiguracaoEnvioAutomaticoCard } from "./ConfiguracaoEnvioAutomaticoCard";
import { WhatsAppConfig } from "./WhatsAppConfig";

interface ConfiguracaoMainViewProps {
  userId: string | null;
  data: UseConfiguracaoDataReturn;
  onSalvarConfig: (e: React.FormEvent) => Promise<void>;
}

export function ConfiguracaoMainView({
  userId,
  data,
  onSalvarConfig,
}: ConfiguracaoMainViewProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-8">
      <main className="max-w-7xl mx-auto">
        <form onSubmit={onSalvarConfig} className="space-y-6">
          {/* Card de Envio Automático */}
          <ConfiguracaoEnvioAutomaticoCard
            envioAutomaticoAtivo={data.envioAutomaticoAtivo}
            setEnvioAutomaticoAtivo={data.setEnvioAutomaticoAtivo}
            diaEnvioRelatorio={data.diaEnvioRelatorio}
            setDiaEnvioRelatorio={data.setDiaEnvioRelatorio}
            horaEnvioRelatorio={data.horaEnvioRelatorio}
            setHoraEnvioRelatorio={data.setHoraEnvioRelatorio}
            diaEnvioCobranca={data.diaEnvioCobranca}
            setDiaEnvioCobranca={data.setDiaEnvioCobranca}
            horaEnvioCobranca={data.horaEnvioCobranca}
            setHoraEnvioCobranca={data.setHoraEnvioCobranca}
            mesReferenciaCobranca={data.mesReferenciaCobranca}
            setMesReferenciaCobranca={data.setMesReferenciaCobranca}
            diaVencimento={data.diaVencimento}
            setDiaVencimento={data.setDiaVencimento}
            pixCobranca={data.pixCobranca}
            setPixCobranca={data.setPixCobranca}
            pixNomeBeneficiario={data.pixNomeBeneficiario}
            setPixNomeBeneficiario={data.setPixNomeBeneficiario}
          />

          {/* Mensagem de Feedback */}
          {data.msg && (
            <div
              className={`p-4 rounded-lg border-l-4 ${
                data.msg.includes("✅") || data.msg.includes("sucesso")
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-red-50 border-red-400 text-red-700"
              }`}
            >
              <p className="text-sm font-medium">{data.msg}</p>
            </div>
          )}
        </form>

        {/* WhatsApp Integration */}
        <div className="mt-6">
          <WhatsAppConfig userId={userId} />
        </div>
      </main>
    </div>
  );
}

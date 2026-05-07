import { useState, useEffect } from "react";
import { API } from "@/services/api";
import { UseConfiguracaoDataReturn } from "@/features/configuracao/types";

export function useConfiguracaoData(
  userId: string | null,
): UseConfiguracaoDataReturn {
  const [whatsapp, setWhatsapp] = useState("");
  const [msg, setMsg] = useState("");

  // Estados para personalização de mensagens
  const [mensagemRelatorio, setMensagemRelatorio] = useState(
    "📊 Olá, {nome}! Segue o relatório de condomínio referente ao período de {mes_ano}. Qualquer dúvida, entre em contato com a administração.",
  );
  const [mensagemCobranca, setMensagemCobranca] = useState(
    "💰 Olá {nome}! Aqui está o valor do condomínio de R$ {valor}, com vencimento em {vencimento}. Por favor, efetue o pagamento até a data informada.",
  );

  // Estados para envio automático
  const [envioAutomaticoAtivo, setEnvioAutomaticoAtivo] = useState(false);
  const [diaEnvioRelatorio, setDiaEnvioRelatorio] = useState("5");
  const [diaEnvioCobranca, setDiaEnvioCobranca] = useState("10");
  const [horaEnvioRelatorio, setHoraEnvioRelatorio] = useState("09:00");
  const [horaEnvioCobranca, setHoraEnvioCobranca] = useState("09:00");
  const [mesReferenciaCobranca, setMesReferenciaCobranca] = useState("atual");
  const [diaVencimento, setDiaVencimento] = useState("5");
  const [pixCobranca, setPixCobranca] = useState("");
  const [pixNomeBeneficiario, setPixNomeBeneficiario] = useState("");

  const [loading, setLoading] = useState(false);

  // Auto-hide das mensagens após 5 segundos
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  // Carrega dados existentes do usuário logado
  useEffect(() => {
    if (!userId) return;

    async function fetchConfig() {
      try {
        const data = (await API.configuracao.get(userId)) as any;
        setWhatsapp(data?.whatsApp || "");
        setMensagemRelatorio(
          data?.mensagemRelatorio ||
            "📊 Olá, {nome}! Segue o relatório de condomínio referente ao período de {mes_ano}. Qualquer dúvida, entre em contato com a administração.",
        );
        setMensagemCobranca(
          data?.mensagemCobranca ||
            "💰 Olá {nome}! Aqui está o valor do condomínio de R$ {valor}, com vencimento em {vencimento}. Por favor, efetue o pagamento até a data informada.",
        );
        setEnvioAutomaticoAtivo(data?.envioAutomaticoAtivo || false);
        setDiaEnvioRelatorio(data?.diaEnvioRelatorio?.toString() || "5");
        setDiaEnvioCobranca(data?.diaEnvioCobranca?.toString() || "10");
        setHoraEnvioRelatorio(data?.horaEnvioRelatorio || "09:00");
        setHoraEnvioCobranca(data?.horaEnvioCobranca || "09:00");
        setMesReferenciaCobranca(data?.mesReferenciaCobranca || "atual");
        setDiaVencimento(data?.diaVencimento?.toString() || "5");
        setPixCobranca(data?.pixCobranca || "");
        setPixNomeBeneficiario(data?.pixNomeBeneficiario || "");
      } catch {
        // Sem configuração salva ainda — usa valores padrão
      }
    }

    fetchConfig();
  }, [userId]);

  return {
    whatsapp,
    setWhatsapp,
    mensagemRelatorio,
    setMensagemRelatorio,
    mensagemCobranca,
    setMensagemCobranca,
    envioAutomaticoAtivo,
    setEnvioAutomaticoAtivo,
    diaEnvioRelatorio,
    setDiaEnvioRelatorio,
    diaEnvioCobranca,
    setDiaEnvioCobranca,
    horaEnvioRelatorio,
    setHoraEnvioRelatorio,
    horaEnvioCobranca,
    setHoraEnvioCobranca,
    mesReferenciaCobranca,
    setMesReferenciaCobranca,
    diaVencimento,
    setDiaVencimento,
    pixCobranca,
    setPixCobranca,
    pixNomeBeneficiario,
    setPixNomeBeneficiario,
    loading,
    msg,
    setMsg,
  };
}

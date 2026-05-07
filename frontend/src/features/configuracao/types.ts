export interface ConfiguracaoData {
  whatsapp?: string;
  mensagem_relatorio: string;
  mensagem_cobranca: string;
  envio_automatico_ativo: boolean;
  dia_envio_relatorio: string;
  dia_envio_cobranca: string;
  hora_envio_relatorio: string;
  hora_envio_cobranca: string;
}

export interface EmailConfig {
  email_remetente: string;
  senha_app: string;
  ativo: boolean;
}

export interface ConfiguracaoFormData {
  usuario_id: string;
  mensagem_relatorio: string;
  mensagem_cobranca: string;
  envio_automatico_ativo: boolean;
  dia_envio_relatorio: string;
  dia_envio_cobranca: string;
  hora_envio_relatorio: string;
  hora_envio_cobranca: string;
}

export interface UseConfiguracaoDataReturn {
  // Estados de configuração
  whatsapp: string;
  setWhatsapp: (value: string) => void;
  mensagemRelatorio: string;
  setMensagemRelatorio: (value: string) => void;
  mensagemCobranca: string;
  setMensagemCobranca: (value: string) => void;
  envioAutomaticoAtivo: boolean;
  setEnvioAutomaticoAtivo: (value: boolean) => void;
  diaEnvioRelatorio: string;
  setDiaEnvioRelatorio: (value: string) => void;
  diaEnvioCobranca: string;
  setDiaEnvioCobranca: (value: string) => void;
  horaEnvioRelatorio: string;
  setHoraEnvioRelatorio: (value: string) => void;
  horaEnvioCobranca: string;
  setHoraEnvioCobranca: (value: string) => void;
  mesReferenciaCobranca: string;
  setMesReferenciaCobranca: (value: string) => void;
  diaVencimento: string;
  setDiaVencimento: (value: string) => void;
  pixCobranca: string;
  setPixCobranca: (value: string) => void;
  pixNomeBeneficiario: string;
  setPixNomeBeneficiario: (value: string) => void;

  // Estados de controle
  loading: boolean;
  msg: string;
  setMsg: (value: string) => void;
}

export interface UseConfiguracaoActionsReturn {
  salvarConfig: (e: React.FormEvent) => Promise<void>;
}

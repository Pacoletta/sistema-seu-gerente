export interface Melhoria {
  id: string;
  titulo: string;
  descricao: string;
  status: "planejada" | "aprovada" | "em_execucao" | "concluida" | "cancelada";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  categoria: string;
  custoEstimado?: number;
  custoReal?: number;
  dataInicio?: string;
  dataFimPrevista?: string;
  dataFimReal?: string;
  responsavel?: string;
  usuarioId: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sugestao {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  usuarioId: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MelhoriaFormData {
  titulo: string;
  descricao: string;
  status: "planejada" | "aprovada" | "em_execucao" | "concluida" | "cancelada";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  categoria: string;
  custo_estimado: string;
  responsavel: string;
  data_inicio: string;
  data_fim_prevista: string;
  observacoes: string;
}

export interface SugestaoFormData {
  titulo: string;
  descricao: string;
  categoria: string;
  observacoes: string;
}

export interface MelhoriasStats {
  total: number;
  sugestoes: number;
  planejadas: number;
  aprovadas: number;
  em_execucao: number;
  concluidas: number;
  custo_total: number;
}

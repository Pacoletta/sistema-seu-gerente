export interface Despesa {
  id?: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  tipoDivisao?: "igual" | "personalizada";
  valoresPorAp?: number[];
  status?: "paga" | "pendente";
  comprovanteUrl?: string;
  melhoriaId?: string;
  origem?: "despesa" | "melhoria";
}

export interface Melhoria {
  id: string;
  titulo: string;
  descricao: string;
  custo_estimado?: number;
  categoria: string;
  status: "planejada" | "aprovada" | "em_execucao" | "concluida" | "cancelada";
}

export interface Morador {
  id: string;
  numero: string;
  nome: string;
}

export const CATEGORIAS = [
  "Água",
  "Luz",
  "Limpeza",
  "Elevador",
  "Manutenção",
  "Funcionários",
  "Internet",
  "Telefone",
  "Outros",
] as const;

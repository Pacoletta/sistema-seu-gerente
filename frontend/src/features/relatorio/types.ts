export interface Despesa {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  valoresPorAp?: number[] | string | null;
  tipoDivisao?: string;
  comprovanteUrl?: string | null;
}

export interface Morador {
  id: string;
  numero: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface Pagamento {
  id: string;
  morador_id: string;
  caixinha: number;
  mes_ano: string;
}

export interface ApartamentoData {
  id: string;
  numero: string;
  nome: string;
  nomeMorador: string;
  email: string;
  telefone: string;
  valor: number;
  temValor: boolean;
  apto: string;
  condominio: string;
  competencia: string;
}

export interface Mensagem {
  tipo: "sucesso" | "erro" | "aviso";
  texto: string;
}

export interface RelatorioData {
  despesas: Despesa[];
  moradores: Morador[];
  pagamentos: Pagamento[];
  valoresFinais: number[];
  totalDespesas: number;
}

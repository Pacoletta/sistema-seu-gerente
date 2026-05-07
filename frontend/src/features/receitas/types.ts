export interface Morador {
  id: string;
  numero: number;
  nome: string;
  [key: string]: any;
}

export interface Despesa {
  id: string;
  data: string;
  valor: number;
  valoresPorAp?: number[];
  [key: string]: any;
}

export interface Pagamento {
  id: string;
  moradorId: string;
  usuarioId: string;
  mesAno: string;
  descricao: string;
  valor: number;
  status: "pendente" | "pago";
  urlComprovante: string | null;
  dataPagamento: string | null;
  dataVencimento: string;
  caixinha?: number;
}

export interface ReceitasFilters {
  mesSelecionado: string;
  anoSelecionado: string;
  searchTerm: string;
}

export interface AporteModalState {
  showModal: boolean;
  valorAporte: string;
  descricaoAporte: string;
  moradorSelecionado: string;
  aporteParaTodos: boolean;
}

export interface ReceitasStats {
  totalPagos: number;
  totalPendentes: number;
  totalApartamentos: number;
  taxaPagamento: number;
  totalAportes: number;
  valorTotalGeralPago: number;
}

export type Morador = {
  id: string;
  numero: string;
  nome: string;
  telefone: string;
  email: string;
  tipo: "morador" | "inquilino";
};

export const initialMorador: Morador = {
  id: "",
  numero: "",
  nome: "",
  telefone: "",
  email: "",
  tipo: "morador",
};

export type MoradoresStats = {
  total: number;
  moradores: number;
  inquilinos: number;
};

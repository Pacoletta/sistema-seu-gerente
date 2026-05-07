"use client";
import React, { createContext, useContext, useState } from "react";

export type Morador = {
  numero: string;
  nome: string;
  telefone: string;
  email: string;
  tipo: "morador" | "inquilino";
};

interface MoradoresContextProps {
  moradores: Morador[];
  setMoradores: React.Dispatch<React.SetStateAction<Morador[]>>;
}

const MoradoresContext = createContext<MoradoresContextProps | undefined>(
  undefined
);

export function MoradoresProvider({ children }: { children: React.ReactNode }) {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  return (
    <MoradoresContext.Provider value={{ moradores, setMoradores }}>
      {children}
    </MoradoresContext.Provider>
  );
}

export function useMoradores() {
  const context = useContext(MoradoresContext);
  if (!context) {
    throw new Error("useMoradores deve ser usado dentro de MoradoresProvider");
  }
  return context;
}

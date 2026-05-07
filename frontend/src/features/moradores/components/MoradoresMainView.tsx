"use client";

import React, { useState, useMemo } from "react";
import { MoradoresStats } from "./MoradoresStats";
import { MoradoresSearch } from "./MoradoresSearch";
import { MoradoresList } from "./MoradoresList";
import { MoradoresModal } from "./MoradoresModal";
import type { Morador } from "@/features/moradores/types";
import { initialMorador } from "@/features/moradores/types";

type MoradoresMainViewProps = {
  moradores: Morador[];
  aviso: string;
  setAviso: (aviso: string) => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onCreate: (morador: Morador) => Promise<boolean>;
  onUpdate: (
    id: string,
    morador: Morador,
    editIndex: number,
  ) => Promise<boolean>;
};

export function MoradoresMainView({
  moradores,
  aviso,
  setAviso,
  onEdit,
  onRemove,
  onCreate,
  onUpdate,
}: MoradoresMainViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [morador, setMorador] = useState<Morador>(initialMorador);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar moradores com base no termo de busca
  const moradoresFiltrados = useMemo(() => {
    if (!searchTerm) return moradores;
    const termo = searchTerm.toLowerCase();
    return moradores.filter((m) => {
      return (
        m.nome?.toLowerCase().includes(termo) ||
        m.email?.toLowerCase().includes(termo) ||
        m.telefone?.toLowerCase().includes(termo) ||
        m.numero?.toString().includes(termo)
      );
    });
  }, [moradores, searchTerm]);

  function openModal(index?: number) {
    if (typeof index === "number") {
      setEditIndex(index);
      setMorador(moradores[index] || initialMorador);
    } else {
      setEditIndex(null);
      setMorador(initialMorador);
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setMorador(initialMorador);
    setEditIndex(null);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setMorador((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let success = false;

    if (editIndex !== null) {
      success = await onUpdate(moradores[editIndex].id, morador, editIndex);
    } else {
      success = await onCreate(morador);
    }

    if (success) {
      closeModal();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <MoradoresStats moradores={moradores} />
          <MoradoresSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            resultCount={searchTerm ? moradoresFiltrados.length : undefined}
          />
        </div>

        {aviso && (
          <div className="mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-green-600 text-2xl">✅</span>
              <span className="text-green-800 font-medium text-lg">
                {aviso}
              </span>
              <button
                onClick={() => setAviso("")}
                className="ml-auto text-green-600 hover:text-green-800 font-bold text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <MoradoresList
          moradores={moradoresFiltrados}
          searchTerm={searchTerm}
          onEdit={(i) => {
            const originalIndex = moradores.findIndex(
              (m) => m.id === moradoresFiltrados[i].id,
            );
            openModal(originalIndex);
          }}
        />

        <MoradoresModal
          isOpen={modalOpen}
          morador={morador}
          editIndex={editIndex}
          aviso={aviso}
          onClose={closeModal}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}

import React from "react";
import type { Morador } from "@/features/moradores/types";

type MoradoresModalProps = {
  isOpen: boolean;
  morador: Morador;
  editIndex: number | null;
  aviso: string;
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function MoradoresModal({
  isOpen,
  morador,
  editIndex,
  aviso,
  onClose,
  onChange,
  onSubmit,
}: MoradoresModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Header do modal */}
        <div className="bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-xl">●</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {editIndex !== null ? "Editar Morador" : "Novo Morador"}
                </h2>
                <p className="text-blue-100 text-xs">
                  {editIndex !== null
                    ? "Atualize as informações"
                    : "Cadastre um novo morador"}
                </p>
              </div>
            </div>
            <button
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={onClose}
              aria-label="Fechar"
            >
              <span className="text-gray-700 text-xl font-bold leading-none">
                ×
              </span>
            </button>
          </div>
        </div>

        {/* Conteúdo do modal */}
        <div className="p-5">
          {aviso && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-sm">⚠️</span>
                <span className="text-red-800 font-medium text-xs">
                  {aviso}
                </span>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Número do Apartamento
                </label>
                <input
                  type="number"
                  name="numero"
                  value={morador.numero ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Ex: 101, 202..."
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={morador.nome ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Nome completo do morador"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={morador.telefone ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={morador.tipo}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                >
                  <option value="morador">● Morador</option>
                  <option value="inquilino">○ Inquilino</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={morador.email ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
              >
                {editIndex !== null ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

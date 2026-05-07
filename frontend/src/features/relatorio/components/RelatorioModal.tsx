"use client";

import React from "react";
import { Morador } from "@/features/relatorio/types";

interface RelatorioModalProps {
  show: boolean;
  morador: Morador | null;
  valor: number;
  onClose: () => void;
  onEnviarCobrancaEmail: () => void;
  onEnviarCobrancaWhatsApp: () => void;
  onEnviarRelatorioEmail: () => void;
  onEnviarWhatsApp: () => void;
  onGerarPDF: () => void;
}

export function RelatorioModal({
  show,
  morador,
  valor,
  onClose,
  onEnviarCobrancaEmail,
  onEnviarCobrancaWhatsApp,
  onEnviarRelatorioEmail,
  onEnviarWhatsApp,
  onGerarPDF,
}: RelatorioModalProps) {
  if (!show || !morador) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do modal */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white font-bold">
              {morador.numero}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {morador.nome}
          </h3>
          <p className="text-sm text-gray-600">Apartamento {morador.numero}</p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="text-xs text-gray-600 mb-1">Valor do Condomínio</p>
            <p className="text-2xl font-bold text-green-600">
              R${" "}
              {valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3 mb-4">
          <button
            onClick={onEnviarCobrancaEmail}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">📧</span>
            <span>Cobrar por Email</span>
          </button>

          <button
            onClick={onEnviarCobrancaWhatsApp}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">💬</span>
            <span>Cobrar por WhatsApp</span>
          </button>

          <button
            onClick={onEnviarRelatorioEmail}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">📧</span>
            <span>Enviar Email</span>
          </button>

          <button
            onClick={onEnviarWhatsApp}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">📱</span>
            <span>Enviar para WhatsApp</span>
          </button>

          <button
            onClick={onGerarPDF}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl">📄</span>
            <span>Gerar PDF</span>
          </button>
        </div>

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

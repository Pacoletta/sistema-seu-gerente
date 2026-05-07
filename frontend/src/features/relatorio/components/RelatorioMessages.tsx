"use client";

import React from "react";
import { Mensagem } from "@/features/relatorio/types";
import {
  useMobileDetection,
  getMobileWarning,
} from "@/hooks/useMobileDetection";

interface RelatorioMessagesProps {
  mensagem: Mensagem | null;
  mensagemPDF: string;
  onDismissMensagem: () => void;
}

export function RelatorioMessages({
  mensagem,
  mensagemPDF,
  onDismissMensagem,
}: RelatorioMessagesProps) {
  const { isMobile, isLoaded } = useMobileDetection();

  return (
    <div className="mb-8">
      {/* Mensagens de feedback */}
      {mensagem && (
        <div
          className={`border-l-4 rounded-r-xl p-6 mb-8 shadow-md ${
            mensagem.tipo === "sucesso"
              ? "bg-green-50 border-green-400"
              : mensagem.tipo === "erro"
                ? "bg-red-50 border-red-400"
                : "bg-yellow-50 border-yellow-400"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex">
              <div className="shrink-0">
                <span
                  className={`text-2xl ${
                    mensagem.tipo === "sucesso"
                      ? "text-green-400"
                      : mensagem.tipo === "erro"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {mensagem.tipo === "sucesso"
                    ? "✅"
                    : mensagem.tipo === "erro"
                      ? "❌"
                      : "⚠️"}
                </span>
              </div>
              <div className="ml-4">
                <p
                  className={`text-base font-medium ${
                    mensagem.tipo === "sucesso"
                      ? "text-green-700"
                      : mensagem.tipo === "erro"
                        ? "text-red-700"
                        : "text-yellow-700"
                  }`}
                >
                  {mensagem.texto}
                </p>
              </div>
            </div>
            <button
              onClick={onDismissMensagem}
              className={`text-sm font-medium ${
                mensagem.tipo === "sucesso"
                  ? "text-green-600 hover:text-green-800"
                  : mensagem.tipo === "erro"
                    ? "text-red-600 hover:text-red-800"
                    : "text-yellow-600 hover:text-yellow-800"
              }`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Aviso para dispositivos móveis */}
      {isLoaded && isMobile && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mb-6 shadow-sm">
          <div className="flex">
            <div className="shrink-0">
              <span className="text-amber-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 font-medium">
                {getMobileWarning()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de feedback para PDF */}
      {mensagemPDF && (
        <div
          className={`p-4 rounded-xl text-center ${
            mensagemPDF.includes("Erro")
              ? "bg-red-50 text-red-700 border-2 border-red-200"
              : mensagemPDF.includes("sucesso")
                ? "bg-green-50 text-green-700 border-2 border-green-200"
                : "bg-blue-50 text-blue-700 border-2 border-blue-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {mensagemPDF.includes("Erro") && <span>❌</span>}
            {mensagemPDF.includes("sucesso") && <span>✅</span>}
            {!mensagemPDF.includes("Erro") &&
              !mensagemPDF.includes("sucesso") && <span>ℹ️</span>}
            <span className="font-medium">{mensagemPDF}</span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";

interface RelatorioActionsProps {
  enviandoEmail: boolean;
  enviandoWhatsApp: boolean;
  enviandoCobranca: boolean;
  gerandoPDF: boolean;
  onEnviarRelatorioEmail: () => void;
  onEnviarWhatsApp: () => void;
  onEnviarCobrancaEmail: () => void;
  onEnviarCobrancaWhatsApp: () => void;
  onGerarPDF: () => void;
}

export function RelatorioActions({
  enviandoEmail,
  enviandoWhatsApp,
  enviandoCobranca,
  gerandoPDF,
  onEnviarRelatorioEmail,
  onEnviarWhatsApp,
  onEnviarCobrancaEmail,
  onEnviarCobrancaWhatsApp,
  onGerarPDF,
}: RelatorioActionsProps) {
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 ml-auto w-full md:w-auto justify-end">
      <button
        className={`flex flex-row items-center gap-2 px-4 md:px-4 py-4 md:py-2 rounded-xl font-medium text-sm transition-all duration-200 touch-manipulation min-h-14 md:min-h-0 w-full md:w-auto justify-center md:justify-start ${
          enviandoEmail
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg active:scale-95 active:bg-blue-100"
        }`}
        onClick={onEnviarRelatorioEmail}
        disabled={enviandoEmail}
      >
        {enviandoEmail ? (
          <>
            <LoadingSpinner />
            <span className="text-xs">Enviando...</span>
          </>
        ) : (
          <>
            <span className="text-xl">📧</span>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xs leading-tight">Email</span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Enviar relatório
              </span>
            </div>
          </>
        )}
      </button>

      <button
        className={`flex flex-row items-center gap-2 px-4 md:px-4 py-4 md:py-2 rounded-xl font-medium text-sm transition-all duration-200 touch-manipulation min-h-14 md:min-h-0 w-full md:w-auto justify-center md:justify-start ${
          enviandoWhatsApp
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-green-600 hover:bg-green-50 border-2 border-green-200 hover:border-green-400 hover:shadow-lg active:scale-95 active:bg-green-100"
        }`}
        onClick={onEnviarWhatsApp}
        disabled={enviandoWhatsApp}
      >
        {enviandoWhatsApp ? (
          <>
            <LoadingSpinner />
            <span className="text-xs">Enviando...</span>
          </>
        ) : (
          <>
            <span className="text-xl">💬</span>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xs leading-tight">WhatsApp</span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Enviar PDF
              </span>
            </div>
          </>
        )}
      </button>

      <button
        className={`flex flex-row items-center gap-2 px-4 md:px-4 py-4 md:py-2 rounded-xl font-medium text-sm transition-all duration-200 touch-manipulation min-h-14 md:min-h-0 w-full md:w-auto justify-center md:justify-start ${
          enviandoCobranca
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-amber-600 hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg active:scale-95 active:bg-amber-100"
        }`}
        onClick={onEnviarCobrancaEmail}
        disabled={enviandoCobranca}
      >
        {enviandoCobranca ? (
          <>
            <LoadingSpinner />
            <span className="text-xs">Enviando...</span>
          </>
        ) : (
          <>
            <span className="text-xl">💰</span>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xs leading-tight">
                Cobrar Email
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Enviar cobrança
              </span>
            </div>
          </>
        )}
      </button>

      <button
        className={`flex flex-row items-center gap-2 px-4 md:px-4 py-4 md:py-2 rounded-xl font-medium text-sm transition-all duration-200 touch-manipulation min-h-14 md:min-h-0 w-full md:w-auto justify-center md:justify-start ${
          enviandoCobranca
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-green-600 hover:bg-green-50 border-2 border-green-200 hover:border-green-400 hover:shadow-lg active:scale-95 active:bg-green-100"
        }`}
        onClick={onEnviarCobrancaWhatsApp}
        disabled={enviandoCobranca}
      >
        {enviandoCobranca ? (
          <>
            <LoadingSpinner />
            <span className="text-xs">Enviando...</span>
          </>
        ) : (
          <>
            <span className="text-xl">💬</span>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xs leading-tight">
                Cobrar WhatsApp
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Enviar cobrança
              </span>
            </div>
          </>
        )}
      </button>

      <button
        className={`flex flex-row items-center gap-2 px-4 md:px-4 py-4 md:py-2 rounded-xl font-medium text-sm transition-all duration-200 touch-manipulation min-h-14 md:min-h-0 w-full md:w-auto justify-center md:justify-start ${
          gerandoPDF
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-purple-600 hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg active:scale-95 active:bg-purple-100"
        }`}
        onClick={onGerarPDF}
        disabled={gerandoPDF}
      >
        {gerandoPDF ? (
          <>
            <LoadingSpinner />
            <span className="text-xs">Gerando...</span>
          </>
        ) : (
          <>
            <span className="text-xl">📄</span>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xs leading-tight">Gerar PDF</span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Baixar arquivo
              </span>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

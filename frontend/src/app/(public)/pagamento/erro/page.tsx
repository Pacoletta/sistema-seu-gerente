"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PagamentoErroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    console.log("❌ Pagamento rejeitado:", { paymentId, status });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Pagamento não aprovado
        </h1>

        <p className="text-gray-600 mb-6">
          Infelizmente seu pagamento foi recusado. Isso pode acontecer por
          diversos motivos como:
        </p>

        <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Saldo insuficiente
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Dados do cartão incorretos
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Limite de crédito excedido
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Cartão bloqueado ou vencido
          </li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/login/cadastro")}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Tentar Novamente
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Voltar ao Início
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Precisa de ajuda? Entre em contato conosco
        </p>
      </div>
    </div>
  );
}

export default function PagamentoErro() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Carregando...
            </h1>
          </div>
        </div>
      }
    >
      <PagamentoErroContent />
    </Suspense>
  );
}

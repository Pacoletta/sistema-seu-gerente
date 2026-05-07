"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/services/api";

function PagamentoPendenteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const { user } = await API.auth.me();

        if (!user) {
          router.push("/login");
          return;
        }

        console.log("Usuário atual:", user);

        // Redireciona para dashboard se está autenticado
        setPolling(false);
        clearInterval(interval);
        router.push("/dashboard");
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    };

    // Verifica imediatamente
    checkStatus();

    // Depois verifica a cada 3 segundos
    interval = setInterval(checkStatus, 3000);

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg
            className="w-10 h-10 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Pagamento Pendente
        </h1>

        <p className="text-gray-600 mb-6">
          Seu pagamento está sendo processado. Isso pode acontecer quando você
          escolhe:
        </p>

        <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <strong>PIX:</strong> Aguardando confirmação do pagamento
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <strong>Boleto:</strong> Precisa ser pago em um caixa eletrônico ou
            lotérica
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <strong>Cartão:</strong> Aguardando aprovação da operadora
          </li>
        </ul>

        {polling && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-blue-600"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verificando status automaticamente...
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Voltar ao Início
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Você será notificado assim que o pagamento for confirmado
        </p>
      </div>
    </div>
  );
}

export default function PagamentoPendente() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
      <PagamentoPendenteContent />
    </Suspense>
  );
}

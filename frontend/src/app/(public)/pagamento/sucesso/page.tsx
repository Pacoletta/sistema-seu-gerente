"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/services/api";

function PagamentoSucessoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"validando" | "aprovado" | "erro">(
    "validando",
  );

  useEffect(() => {
    const validarPagamento = async () => {
      try {
        // Pega o payment_id da URL (enviado pelo MP)
        const paymentId = searchParams.get("payment_id");
        const mpStatus = searchParams.get("status");
        const externalReference = searchParams.get("external_reference");

        console.log("📦 Parâmetros do MP:", {
          paymentId,
          mpStatus,
          externalReference,
        });

        // Busca o usuário atual
        const { user } = await API.auth.me();

        if (!user) {
          console.error("❌ Usuário não encontrado");
          router.push("/login");
          return;
        }

        console.log("✅ Usuário autenticado:", user);

        // Redireciona para dashboard
        setStatus("aprovado");
        setTimeout(() => router.push("/dashboard?payment=approved"), 2000);
      } catch (error) {
        console.error("❌ Erro ao validar pagamento:", error);
        setStatus("erro");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    validarPagamento();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {status === "validando" && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg
                className="w-10 h-10 text-blue-600 animate-spin"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Validando pagamento...
            </h1>
            <p className="text-gray-600">
              Aguarde enquanto confirmamos sua assinatura
            </p>
          </>
        )}

        {status === "aprovado" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Pagamento confirmado!
            </h1>
            <p className="text-gray-600">
              Redirecionando para seu dashboard...
            </p>
          </>
        )}

        {status === "erro" && (
          <>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Erro ao validar pagamento
            </h1>
            <p className="text-gray-600">Redirecionando...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PagamentoSucesso() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg
                className="w-10 h-10 text-blue-600 animate-spin"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Carregando...
            </h1>
          </div>
        </div>
      }
    >
      <PagamentoSucessoContent />
    </Suspense>
  );
}

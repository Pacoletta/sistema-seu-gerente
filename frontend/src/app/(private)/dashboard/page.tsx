"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Dashboard1 from "@/features/dashboard/components/dashboard1";
import Grafico1 from "@/features/dashboard/components/grafico1";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function DashboardContent() {
  const { userId } = useCurrentUser();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Verifica se veio da aprovação de pagamento
    if (searchParams.get("payment") === "approved") {
      setShowPaymentSuccess(true);
      // Remove o parâmetro da URL após 5 segundos
      setTimeout(() => {
        setShowPaymentSuccess(false);
        router.replace("/dashboard");
      }, 5000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Notificação de pagamento aprovado */}
      {showPaymentSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <svg
              className="w-8 h-8 animate-bounce"
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
            <div>
              <p className="font-bold text-lg">
                Pronto! Seu pagamento já foi aprovado
              </p>
              <p className="text-sm text-green-100">
                Bem-vindo ao Sistema Seu Gerente!
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="p-4">
        <div className="space-y-4">
          <Dashboard1 />
          <Grafico1 />
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
          <main className="p-8">
            <div className="space-y-8 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </main>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

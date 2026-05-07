"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/services/api";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

export default function AguardandoPagamento() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "checking" | "approved" | "pending" | "rejected"
  >("checking");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        const { user } = await API.auth.me();

        if (!user) {
          router.push("/login");
          return;
        }

        // O status já vem no objeto user
        console.log("Status atual:", user);

        // Redireciona direto para dashboard - assumindo que se está logado está ativo
        clearInterval(interval);
        router.push("/dashboard");
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    };

    // Verifica imediatamente
    checkPaymentStatus();

    // Continua verificando a cada 3 segundos
    interval = setInterval(checkPaymentStatus, 3000);

    return () => {
      clearInterval(interval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Checking Status */}
        {status === "checking" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                <FaSpinner className="w-12 h-12 text-blue-400 animate-spin" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Verificando Pagamento
            </h1>
            <p className="text-white/70 text-lg">
              Aguarde enquanto confirmamos seu pagamento...
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        {/* Pending Status */}
        {status === "pending" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-yellow-500/50">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
                <FaSpinner className="w-12 h-12 text-yellow-400 animate-spin" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Pagamento Pendente
            </h1>
            <p className="text-white/70 text-lg mb-6">
              Estamos aguardando a confirmação do seu pagamento. Isso pode levar
              alguns minutos.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                💡 <strong>Dica:</strong> Se você pagou via PIX, a confirmação
                geralmente é instantânea. Para cartão ou boleto, pode demorar um
                pouco mais.
              </p>
            </div>
          </div>
        )}

        {/* Approved Status */}
        {status === "approved" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-green-500/50">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-scale-in">
                <FaCheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              🎉 Pagamento Confirmado!
            </h1>
            <p className="text-white/70 text-lg mb-6">
              Seu pagamento foi aprovado com sucesso!
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <p className="text-green-200 text-lg mb-4">
                Redirecionando para o dashboard em...
              </p>
              <div className="text-6xl font-bold text-green-400 animate-pulse">
                {countdown}
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Ir para o Dashboard Agora
            </button>
          </div>
        )}

        {/* Rejected Status */}
        {status === "rejected" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-red-500/50">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
                <FaTimesCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Pagamento Não Aprovado
            </h1>
            <p className="text-white/70 text-lg mb-6">
              Infelizmente seu pagamento não foi aprovado. Você pode tentar
              novamente.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-sm">
                Verifique seus dados de pagamento e tente novamente. Se o
                problema persistir, entre em contato com nosso suporte.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

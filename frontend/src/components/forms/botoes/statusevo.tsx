"use client";
import { useState } from "react";
import { API } from "@/services/api";

interface StatusEvoProps {
  onStatusUpdate?: (status: string, message: string) => void;
  onQRCodeReceived?: (qrCode: string) => void;
  compact?: boolean; // Nova prop para versão compacta
  nome?: string | null;
  email?: string | null;
  whatsapp?: string;
}

interface InstanceData {
  instance: {
    instanceName: string;
    state: string;
  };
}

interface QRCodeData {
  success: boolean;
  data: {
    pairingCode?: string | null;
    code?: string;
    base64?: string;
    count?: number;
  };
}

interface InstanceDetails {
  id: string;
  name: string;
  connectionStatus: string;
  ownerJid: string;
  profileName?: string | null;
  profilePicUrl?: string;
  integration: string;
  number: string;
  businessId?: string | null;
  token: string;
  clientName: string;
  disconnectionReasonCode?: number;
  disconnectionObject?: string;
  disconnectionAt?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Para propriedades adicionais
}

interface StatusDataResponse {
  success: boolean;
  data: InstanceDetails[];
}

type StatusResponse = InstanceData[] | QRCodeData[] | StatusDataResponse[];

export function StatusEvo({
  onStatusUpdate,
  onQRCodeReceived,
  compact = false,
  nome,
  email,
  whatsapp,
}: StatusEvoProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const checkWhatsAppStatus = async () => {
    setLoading(true);
    setStatus("");
    setMessage("");

    try {
      // Envia webhook via proxy (evita CORS)
      try {
        const webhookResponse = await fetch("/api/webhook/verificar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nome,
            telefone: whatsapp,
            email: email,
          }),
        });

        if (webhookResponse.ok) {
          try {
            const responseData = await webhookResponse.json();
            console.log("📦 Resposta do webhook verificar:", responseData);

            let qrData = null;

            // Verificar se é um array
            if (Array.isArray(responseData) && responseData.length > 0) {
              qrData = responseData[0];
            }
            // Verificar se é um objeto direto
            else if (responseData && typeof responseData === "object") {
              qrData = responseData;
            }

            // Verificar se tem QR Code
            if (qrData && qrData.success && qrData.data && qrData.data.base64) {
              console.log("🎯 QR Code detectado no webhook VERIFICAR!");
              console.log("📱 Base64 length:", qrData.data.base64.length);

              // Chamar callback para mostrar o QR Code
              if (onQRCodeReceived) {
                console.log("📤 Enviando QR Code para o callback...");
                onQRCodeReceived(qrData.data.base64);
              }

              setLoading(false);
              return;
            }

            // Verificar se tem mensagem de status
            if (qrData && qrData.mensagem) {
              console.log("📢 Mensagem recebida:", qrData.mensagem);
              setStatus("connected");
              setMessage(qrData.mensagem);

              if (onStatusUpdate) {
                onStatusUpdate("connected", qrData.mensagem);
              }

              setLoading(false);
              return;
            }

            // Se chegou aqui, não há dados relevantes, não mostrar nada
            setLoading(false);
            return;
          } catch (jsonError) {
            console.log("⚠️ Resposta do webhook não é JSON:", jsonError);
          }
        }
      } catch (webhookError) {
        console.error("Erro ao enviar webhook:", webhookError);
      }

      // Não mostrar mensagem de sucesso padrão
      setLoading(false);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setStatus("error");
      setMessage(`❌ Erro ao verificar status do WhatsApp: ${errorMessage}`);

      if (onStatusUpdate) {
        onStatusUpdate(
          "error",
          `❌ Erro ao verificar status do WhatsApp: ${errorMessage}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    // Versão compacta apenas com o botão
    return (
      <button
        onClick={checkWhatsAppStatus}
        disabled={loading}
        className="w-full h-full flex items-center justify-center gap-1"
      >
        {loading ? (
          <>
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="hidden sm:inline text-xs">Verificando</span>
          </>
        ) : (
          <>
            <span className="text-sm">📡</span>
            <span className="hidden sm:inline text-xs">Verificar</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botão para verificar status */}
      <button
        onClick={checkWhatsAppStatus}
        disabled={loading}
        className="w-full bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Verificando status...
          </>
        ) : (
          <>
            <span className="text-xl">📡</span>
            Verificar Status do WhatsApp
          </>
        )}
      </button>

      {/* Display do status atual */}
      {(status || message) && (
        <div
          className={`p-4 rounded-xl border-l-4 ${
            status === "connected"
              ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-400"
              : status === "connecting" || status === "qr"
              ? "bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-400"
              : status === "warning"
              ? "bg-linear-to-r from-orange-50 to-amber-50 border-orange-400"
              : status === "disconnected" || status === "error"
              ? "bg-linear-to-r from-red-50 to-pink-50 border-red-400"
              : "bg-linear-to-r from-gray-50 to-blue-50 border-gray-400"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full mt-1.5 ${
                status === "connected"
                  ? "bg-green-500 animate-pulse"
                  : status === "connecting" || status === "qr"
                  ? "bg-yellow-500 animate-pulse"
                  : status === "warning"
                  ? "bg-orange-500 animate-pulse"
                  : status === "disconnected" || status === "error"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            ></div>
            <div className="flex-1">
              <h4
                className={`font-semibold mb-1 ${
                  status === "connected"
                    ? "text-green-800"
                    : status === "connecting" || status === "qr"
                    ? "text-yellow-800"
                    : status === "warning"
                    ? "text-orange-800"
                    : status === "disconnected" || status === "error"
                    ? "text-red-800"
                    : "text-gray-800"
                }`}
              >
                Status da Conexão
              </h4>
              <p
                className={`leading-relaxed ${
                  status === "connected"
                    ? "text-green-700"
                    : status === "connecting" || status === "qr"
                    ? "text-yellow-700"
                    : status === "warning"
                    ? "text-orange-700"
                    : status === "disconnected" || status === "error"
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

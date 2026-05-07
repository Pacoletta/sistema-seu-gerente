"use client";

import { useState, useEffect, useRef } from "react";
import { backendFetch } from "@/services/httpClient";

type ConnectionStatus =
  | "not_configured"
  | "connecting"
  | "open"
  | "close"
  | "error";

interface StatusData {
  status: ConnectionStatus;
  instanceName: string | null;
  hasInstance: boolean;
}

interface ConnectData {
  status: string;
  qrCode: string | null;
  instanceName: string;
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  not_configured: "Não configurado",
  connecting: "Aguardando leitura do QR Code...",
  open: "Conectado",
  close: "Desconectado",
  error: "Erro de conexão",
};

const STATUS_COLOR: Record<ConnectionStatus, string> = {
  not_configured: "text-gray-500",
  connecting: "text-yellow-600",
  open: "text-green-600",
  close: "text-red-500",
  error: "text-red-600",
};

const STATUS_DOT: Record<ConnectionStatus, string> = {
  not_configured: "bg-gray-400",
  connecting: "bg-yellow-500 animate-pulse",
  open: "bg-green-500",
  close: "bg-red-400",
  error: "bg-red-600",
};

export function WhatsAppConfig({ userId }: { userId: string | null }) {
  const [status, setStatus] = useState<ConnectionStatus>("not_configured");
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [hasInstance, setHasInstance] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await backendFetch("/api/whatsapp-integracao/status");
        if (!res.ok) return;
        const data: StatusData = await res.json();
        setStatus(data.status);
        setInstanceName(data.instanceName);
        setHasInstance(data.hasInstance);

        if (data.status === "open") {
          setQrCode(null);
          stopPolling();
          setMsg("✅ WhatsApp conectado com sucesso!");
        }
      } catch {
        // ignora erros de polling
      }
    }, 3000);
  };

  useEffect(() => {
    fetchStatus();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (status === "connecting") {
      startPolling();
    } else {
      stopPolling();
    }
  }, [status]);

  async function fetchStatus() {
    setLoadingStatus(true);
    try {
      const res = await backendFetch("/api/whatsapp-integracao/status");
      if (res.ok) {
        const data: StatusData = await res.json();
        setStatus(data.status);
        setInstanceName(data.instanceName);
        setHasInstance(data.hasInstance);
      }
    } catch {
      setStatus("error");
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handleConnect() {
    setLoading(true);
    setMsg(null);
    setQrCode(null);
    try {
      const res = await backendFetch("/api/whatsapp-integracao/connect", {
        method: "POST",
      });
      if (res.ok) {
        const data: ConnectData = await res.json();
        setQrCode(data.qrCode);
        setStatus("connecting");
        setInstanceName(data.instanceName);
        setHasInstance(true);
        setMsg("Escaneie o QR Code com seu WhatsApp para conectar.");
      } else {
        const err = await res.json();
        setMsg(`❌ ${err.message}`);
      }
    } catch {
      setMsg("❌ Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReconnect() {
    setLoading(true);
    setMsg(null);
    setQrCode(null);
    try {
      const res = await backendFetch("/api/whatsapp-integracao/reconnect", {
        method: "POST",
      });
      if (res.ok) {
        const data: ConnectData = await res.json();
        setQrCode(data.qrCode);
        setStatus("connecting");
        setMsg("Escaneie o novo QR Code para reconectar.");
      } else {
        const err = await res.json();
        setMsg(`❌ ${err.message}`);
      }
    } catch {
      setMsg("❌ Erro ao reconectar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm("Deseja desconectar o WhatsApp?")) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await backendFetch("/api/whatsapp-integracao/disconnect", {
        method: "POST",
      });
      if (res.ok) {
        setStatus("close");
        setQrCode(null);
        setMsg("WhatsApp desconectado.");
      } else {
        const err = await res.json();
        setMsg(`❌ ${err.message}`);
      }
    } catch {
      setMsg("❌ Erro ao desconectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-green-500 to-emerald-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.858L0 24l6.335-1.524A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.012-1.372l-.36-.213-3.735.899.936-3.628-.235-.373A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Integração WhatsApp</h2>
            <p className="text-green-100 text-sm">
              Conecte sua instância para envio automático de avisos
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            {loadingStatus ? (
              <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
            ) : (
              <span className={`w-3 h-3 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">Status da conexão</p>
              <p className={`text-sm font-medium ${STATUS_COLOR[status]}`}>
                {loadingStatus ? "Verificando..." : STATUS_LABEL[status]}
              </p>
            </div>
          </div>

          {instanceName && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Instância</p>
              <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                {instanceName}
              </p>
            </div>
          )}
        </div>

        {/* QR Code */}
        {qrCode && status === "connecting" && (
          <div className="flex flex-col items-center gap-4 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <p className="text-sm font-semibold text-yellow-800">
              📱 Escaneie o QR Code com seu WhatsApp
            </p>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-yellow-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCode}
                alt="QR Code WhatsApp"
                className="w-52 h-52 object-contain"
              />
            </div>
            <p className="text-xs text-yellow-700 text-center">
              Abra o WhatsApp → Menu → Aparelhos conectados → Conectar dispositivo
            </p>
            <div className="flex items-center gap-2 text-yellow-600 text-xs">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Aguardando leitura...
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3 flex-wrap">
          {(!hasInstance || status === "not_configured" || status === "close") &&
            status !== "connecting" && (
              <button
                onClick={handleConnect}
                disabled={loading || loadingStatus}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span>📱</span>
                )}
                Conectar via QR Code
              </button>
            )}

          {hasInstance && status === "open" && (
            <>
              <button
                onClick={handleReconnect}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md"
              >
                🔄 Reconectar
              </button>
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md"
              >
                Desconectar
              </button>
            </>
          )}

          {hasInstance && (status === "error" || status === "close") && (
            <button
              onClick={handleReconnect}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md"
            >
              🔄 Reconectar
            </button>
          )}

          {status === "connecting" && (
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-400 hover:bg-gray-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
            >
              Cancelar
            </button>
          )}

          <button
            onClick={fetchStatus}
            disabled={loading || loadingStatus}
            title="Atualizar status"
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-all disabled:opacity-60"
          >
            🔃
          </button>
        </div>

        {/* Feedback */}
        {msg && (
          <div
            className={`p-3 rounded-xl text-sm font-medium border-l-4 ${
              msg.includes("✅") || msg.includes("sucesso") || msg.includes("Escaneie")
                ? "bg-green-50 text-green-800 border-green-400"
                : msg.includes("❌")
                ? "bg-red-50 text-red-800 border-red-400"
                : "bg-blue-50 text-blue-800 border-blue-400"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 font-semibold mb-1">ℹ️ Como funciona</p>
          <ul className="text-xs text-blue-600 space-y-0.5 ml-3">
            <li>• Clique em Conectar e escaneie o QR Code pelo WhatsApp</li>
            <li>• Após conectado, os avisos de vencimento serão enviados automaticamente</li>
            <li>• Use Reconectar se a conexão cair ou expirar</li>
            <li>• Cada condomínio possui sua própria instância isolada</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

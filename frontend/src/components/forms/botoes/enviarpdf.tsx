import React, { useState, useEffect } from "react";
import { API } from "@/services/api";

// Hook para buscar o telefone (whatsapp) da tabela configuracao do usuário logado

import {
  gerarRelatorioPDF,
  Despesa,
  Apartamento,
} from "@/features/relatorio/pdf";
import { BsWhatsapp } from "react-icons/bs";

type EnviarPdfProps = {
  moradorId?: string; // Se definido, envia para um morador específico
  despesas: Despesa[];
  apartamentos: Apartamento[];
  total: number;
  mes: string;
  ano: string | number;
  onStatusChange?: (message: string) => void; // Callback para comunicar status
};

export function EnviarPdf({
  moradorId,
  despesas,
  apartamentos,
  total,
  mes,
  ano,
  onStatusChange,
}: EnviarPdfProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [mesAno, setMesAno] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  // Busca o telefone (whatsapp), usuario_id e mes/ano
  useEffect(() => {
    async function fetchInfo() {
      try {
        // Busca usuário logado via backend Express
        const { API } = await import("@/services/api");
        const result = await API.auth.me();
        if (!result?.user?.id) return;
        const userData = result.user;
        const usuarioId = userData.id;
        setUsuarioId(usuarioId);
        // Nome: tenta pegar do nome, senão pega do email antes do @
        let nome =
          userData?.nome ||
          (userData?.email ? userData.email.split("@")[0] : "");
        setNome(nome || "Usuário não identificado");
        setEmail(userData?.email || "");

        // Busca whatsapp na tabela configuracao
        console.log("🔍 Buscando configuração para usuário:", usuarioId);
        const confData = (await API.configuracao.get(usuarioId)) as any;
        console.log("📦 Configuração recebida:", confData);

        const whatsappValue = confData?.whatsapp || "";
        setTelefone(whatsappValue);

        console.log("📞 WhatsApp configurado:", whatsappValue);
      } catch (error) {
        console.warn("⚠️ Erro ao buscar informações do usuário:", error);
      }

      // Busca mês/ano do relatório (do DOM)
      // Espera que exista um elemento com id relatorio-pdf
      const relatorio = document.getElementById("relatorio-pdf");
      if (relatorio) {
        // Procura por span com classe text-base font-semibold text-gray-800 (modoPDF) ou select (normal)
        // Tenta pegar o texto do mês/ano exibido
        let mesAnoStr = "";
        // 1. Tenta pegar do span (modoPDF)
        const span = relatorio.querySelector(
          "span.text-base.font-semibold.text-gray-800",
        );
        if (span && span.textContent) {
          mesAnoStr = span.textContent.trim();
        } else {
          // 2. Tenta pegar dos selects (normal)
          const selects = relatorio.querySelectorAll("select");
          if (selects.length === 2) {
            const mes =
              (selects[0] as HTMLSelectElement).selectedOptions[0]
                ?.textContent || "";
            const ano = (selects[1] as HTMLSelectElement).value || "";
            if (mes && ano) mesAnoStr = `${mes} ${ano}`;
          }
        }
        // Normaliza para formato setembro-2025
        if (mesAnoStr) {
          console.log("mesAnoStr encontrado:", mesAnoStr);
          const partes = mesAnoStr.split(" ");
          if (partes.length === 2) {
            const mes = partes[0].toLowerCase();
            const ano = partes[1];
            const mesAnoFormatado = `${mes}-${ano}`;
            console.log("mes_ano formatado:", mesAnoFormatado);
            setMesAno(mesAnoFormatado);
          }
        } else {
          console.log("mesAnoStr não encontrado no DOM");
        }
      }

      // Fallback: usar as props mes e ano se mesAno não foi capturado
      if (mes && ano) {
        const mesAnoFromProps = `${mes.toLowerCase()}-${ano}`;
        console.log("Usando mes_ano das props:", mesAnoFromProps);
        setMesAno(mesAnoFromProps);
      }
    }
    fetchInfo();
  }, [mes, ano]); // Removido mesAno das dependências

  async function handleEnviar() {
    console.log("🚀 Iniciando envio de PDF...");
    console.log("Dados:", { nome, email, usuarioId, mesAno });

    if (!usuarioId) {
      console.log("❌ Usuário não identificado");
      const errorMsg = "Erro: Usuário não identificado";
      setMsg(errorMsg);
      onStatusChange?.(errorMsg);
      return;
    }

    setLoading(true);
    setMsg("");

    // Detecta dispositivo móvel
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    try {
      if (isMobile) {
        setMsg("Gerando PDF em dispositivo móvel... Isso pode demorar.");
        onStatusChange?.(
          "Gerando PDF em dispositivo móvel... Isso pode demorar.",
        );
      }

      console.log("📄 Gerando PDF...");
      // 1. Gerar PDF
      const arrayBuffer = await gerarRelatorioPDF({
        despesas,
        apartamentos,
        total,
        mes,
        ano,
        nome,
        email,
      });
      console.log("✅ PDF gerado com sucesso");

      const bufferToSend =
        arrayBuffer instanceof ArrayBuffer
          ? arrayBuffer
          : (arrayBuffer.buffer as unknown as ArrayBuffer);
      const fileName = `relatorio-${mes}-${ano}-${Date.now()}.pdf`;

      console.log("📤 Fazendo upload para o servidor...");

      // 2. Upload do PDF via API
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([bufferToSend], { type: "application/pdf" }),
        fileName,
      );
      formData.append("usuarioId", usuarioId);
      formData.append("fileName", fileName);

      const uploadResponse = await fetch("/api/upload/pdf", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("❌ Erro ao fazer upload do PDF:", errorData);
        const errorMsg = `Erro ao salvar PDF: ${errorData.error}`;
        setMsg(errorMsg);
        onStatusChange?.(errorMsg);
        setLoading(false);
        return;
      }

      const uploadData = await uploadResponse.json();
      console.log("✅ Upload concluído:", uploadData);

      // 3. URL pública do PDF
      const pdfPublicUrl = uploadData.publicUrl;
      console.log("🔗 URL do PDF:", pdfPublicUrl);

      // 4. Enviar webhook para n8n
      console.log("📨 Enviando webhook...");
      const webhookUrl = `${process.env.NEXT_PUBLIC_N8N_BASE_URL}${process.env.NEXT_PUBLIC_WEBHOOK_ENVIAR_PDF}`;

      const body = {
        nome: nome || "Usuário",
        email: email || "",
        telefone: telefone || "",
        usuario_id: usuarioId,
        mes_ano: mesAno || `${mes.toLowerCase()}-${ano}`,
        pdf_url: pdfPublicUrl,
        ...(moradorId ? { morador_id: moradorId } : { todos: true }),
      };

      console.log("📦 Dados do webhook:", body);

      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!webhookResponse.ok) {
        const responseText = await webhookResponse.text();
        console.error("❌ Erro ao enviar webhook:", responseText);
        const errorMsg = "PDF salvo, mas erro ao enviar WhatsApp.";
        setMsg(errorMsg);
        onStatusChange?.(errorMsg);
        setLoading(false);
        return;
      }

      const result = await webhookResponse.json();
      console.log("✅ Resposta do webhook:", result);

      const successMsg = "PDF gerado e enviado com sucesso!";
      setMsg(successMsg);
      onStatusChange?.(successMsg);
    } catch (err) {
      const errorMsg = `Erro: ${
        err instanceof Error ? err.message : "Erro desconhecido"
      }`;
      setMsg(errorMsg);
      onStatusChange?.(errorMsg);
      console.error("❌ Erro ao gerar/enviar PDF:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleEnviar}
        disabled={loading || !usuarioId}
        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-xs shadow-md transition-all duration-200 ${
          loading || !usuarioId
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-linear-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transform hover:scale-105"
        } text-white`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
            Enviando...
          </>
        ) : (
          <>
            <BsWhatsapp className="mr-2 h-3 w-3" />
            {moradorId ? "Enviar PDF" : "Enviar PDF"}
          </>
        )}
      </button>
    </>
  );
}

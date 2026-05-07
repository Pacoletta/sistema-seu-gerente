"use client";

import { useState, useRef } from "react";
import { FaCamera, FaMicrophone, FaFileUpload, FaStop } from "react-icons/fa";
import { API } from "@/services/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface DadosDespesa {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  resposta_ia?: string;
}

export function SystemWhatsAppChat() {
  const { userId: currentUserId } = useCurrentUser();
  const userId = currentUserId ?? "";
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [dadosDespesa, setDadosDespesa] = useState<DadosDespesa | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processarComIA = async (
    tipo: "imagem" | "audio" | "arquivo",
    dados: string,
  ) => {
    try {
      setIsProcessing(true);

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

      const mensagem =
        tipo === "imagem"
          ? "Extraia os dados desta despesa da imagem"
          : tipo === "audio"
            ? "Transcreva o áudio e extraia os dados da despesa mencionada"
            : "Analise o documento e extraia os dados da despesa";

      const body: any = {
        mensagem,
        userId: userId,
        plataforma: "web-sistema",
        isPublic: false,
      };

      if (tipo === "imagem" || tipo === "arquivo") {
        body.imagem = dados;
      } else if (tipo === "audio") {
        body.audio = dados;
      }

      const response = await fetch(`${backendUrl}/api/ia/chat/web`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Resposta completa da IA:", data);
      console.log("📄 Texto da resposta:", data.resposta);

      // Extrair dados da resposta
      const respostaIA = data.resposta || "";

      // Regex mais flexíveis para capturar os dados (sem flag 's' para compatibilidade)
      const descricaoMatch = respostaIA.match(
        /(?:Descrição|DESCRIÇÃO|descrição)(?:\*\*)?:?\s*\*?\*?([^\n]+)/i,
      );
      const valorMatch = respostaIA.match(
        /(?:Valor|VALOR|valor)(?:\*\*)?:?\s*\*?\*?R?\$?\s*([\d.,]+)/i,
      );
      const categoriaMatch = respostaIA.match(
        /(?:Categoria|CATEGORIA|categoria)(?:\*\*)?:?\s*\*?\*?([^\n]+)/i,
      );
      const dataMatch = respostaIA.match(
        /(?:Data|DATA|data)(?:\*\*)?:?\s*\*?\*?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      );

      console.log("🔍 Matches encontrados:");
      console.log("  - Descrição:", descricaoMatch?.[1]?.trim());
      console.log("  - Valor:", valorMatch?.[1]);
      console.log("  - Categoria:", categoriaMatch?.[1]?.trim());
      console.log("  - Data:", dataMatch?.[1]);

      const hoje = new Date();
      const dataFormatada = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

      // Extrair descrição de forma mais robusta
      let descricao = descricaoMatch?.[1]?.trim();
      if (!descricao || descricao.length < 3) {
        // Tentar pegar primeira linha não vazia
        const linhas = respostaIA
          .split("\n")
          .filter((l) => l.trim().length > 5);
        descricao =
          linhas[0]?.replace(/\*\*/g, "").trim() || "Despesa extraída por IA";
      }

      // Limpar asteriscos e caracteres extras
      descricao = descricao
        .replace(/\*\*/g, "")
        .replace(/^\*\s*/, "")
        .trim();

      // Extrair valor
      let valorStr =
        valorMatch?.[1]?.replace(/\./g, "").replace(",", ".") || "0";
      const valor = parseFloat(valorStr);

      // Extrair categoria
      let categoria =
        categoriaMatch?.[1]?.trim()?.replace(/\*\*/g, "") || "Outros";

      // Extrair e converter data
      let dataFinal = dataFormatada;
      if (dataMatch?.[1]) {
        dataFinal = converterDataBR(dataMatch[1]);
      }

      const despesaExtraida: DadosDespesa = {
        descricao: descricao,
        valor: isNaN(valor) ? 0 : valor,
        categoria: categoria,
        data: dataFinal,
        resposta_ia: respostaIA,
      };

      console.log("✅ Dados finais extraídos:", despesaExtraida);

      // Validar dados mínimos
      if (!despesaExtraida.descricao || despesaExtraida.valor === 0) {
        console.warn("⚠️ Dados incompletos, mostrando resposta original");
        alert(
          `ℹ️ Resposta da IA:\n\n${respostaIA}\n\nPor favor, verifique se a imagem está legível e tente novamente.`,
        );
        return;
      }

      // Mostrar card de confirmação
      setDadosDespesa(despesaExtraida);
      setShowConfirmacao(true);
    } catch (error) {
      console.error("❌ Erro ao processar com IA:", error);
      alert("❌ Erro ao processar. Verifique sua conexão e tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const converterDataBR = (dataBR: string): string => {
    try {
      // Remover espaços e normalizar separadores
      dataBR = dataBR.trim().replace(/[\-\.]/g, "/");

      const partes = dataBR.split("/");
      if (partes.length !== 3) {
        console.warn("⚠️ Formato de data inválido:", dataBR);
        const hoje = new Date();
        return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
      }

      let [dia, mes, ano] = partes;

      // Normalizar ano com 2 dígitos para 4 dígitos
      if (ano.length === 2) {
        const anoAtual = new Date().getFullYear();
        const seculo = Math.floor(anoAtual / 100) * 100;
        ano = String(seculo + parseInt(ano));
      }

      // Adicionar zeros à esquerda se necessário
      dia = dia.padStart(2, "0");
      mes = mes.padStart(2, "0");

      console.log(
        `📅 Data convertida: ${dia}/${mes}/${ano} -> ${ano}-${mes}-${dia}`,
      );
      return `${ano}-${mes}-${dia}`;
    } catch (error) {
      console.error("❌ Erro ao converter data:", error);
      const hoje = new Date();
      return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
    }
  };

  const confirmarLancamento = async () => {
    if (!dadosDespesa || !userId) return;

    try {
      setIsProcessing(true);

      console.log("📤 Enviando despesa:", {
        usuario_id: userId,
        descricao: dadosDespesa.descricao,
        valor: dadosDespesa.valor,
        categoria: dadosDespesa.categoria,
        data: dadosDespesa.data,
        tipoDivisao: "igual",
      });

      // Lançar despesa via API
      const resultado = await API.despesas.create({
        usuario_id: userId,
        descricao: dadosDespesa.descricao,
        valor: dadosDespesa.valor,
        categoria: dadosDespesa.categoria,
        data: dadosDespesa.data,
        tipoDivisao: "igual",
      });

      console.log("✅ Despesa criada:", resultado);

      // Fechar modal
      setShowConfirmacao(false);
      setDadosDespesa(null);

      // Recarregar página
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("❌ Erro ao lançar despesa:", error);
      alert("❌ Erro ao lançar despesa. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelarLancamento = () => {
    setShowConfirmacao(false);
    setDadosDespesa(null);
  };

  const handleCameraCapture = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Apenas imagens são permitidas");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("❌ Imagem muito grande. Máximo 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await processarComIA("imagem", reader.result as string);
    };
    reader.readAsDataURL(file);

    // Limpar input
    e.target.value = "";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      await processarComIA("arquivo", reader.result as string);
    };
    reader.readAsDataURL(file);

    // Limpar input
    e.target.value = "";
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "❌ Seu navegador não suporta gravação de áudio.\n\nUse Chrome, Firefox ou Edge.",
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        mimeType = "audio/ogg";
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = async () => {
          await processarComIA("audio", reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("❌ Erro ao iniciar gravação:", error);
      alert(
        "❌ Não foi possível acessar o microfone. Verifique as permissões.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  if (!userId) return null;

  return (
    <>
      {/* Card de Confirmação */}
      {showConfirmacao && dadosDespesa && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-slide-up">
            {/* Header */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-center">
                sistemaseugerente.com.br diz
              </h3>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                Aqui estão os dados extraídos. Você pode editá-los antes de
                confirmar:
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <div>
                  <label className="text-gray-600 text-sm font-semibold block mb-1">
                    Descrição:
                  </label>
                  <input
                    type="text"
                    value={dadosDespesa.descricao}
                    onChange={(e) =>
                      setDadosDespesa({
                        ...dadosDespesa,
                        descricao: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-semibold block mb-1">
                    Valor (R$):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dadosDespesa.valor}
                    onChange={(e) =>
                      setDadosDespesa({
                        ...dadosDespesa,
                        valor: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-semibold block mb-1">
                    Categoria:
                  </label>
                  <select
                    value={dadosDespesa.categoria}
                    onChange={(e) =>
                      setDadosDespesa({
                        ...dadosDespesa,
                        categoria: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Internet">Internet</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Energia">Energia</option>
                    <option value="Água">Água</option>
                    <option value="Gás">Gás</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-semibold block mb-1">
                    Data:
                  </label>
                  <input
                    type="date"
                    value={dadosDespesa.data}
                    onChange={(e) =>
                      setDadosDespesa({
                        ...dadosDespesa,
                        data: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                Revise os dados e clique em OK para confirmar o lançamento.
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={confirmarLancamento}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isProcessing ? "Lançando..." : "OK"}
              </button>
              <button
                onClick={cancelarLancamento}
                disabled={isProcessing}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

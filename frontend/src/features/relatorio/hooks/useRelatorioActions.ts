"use client";

import React, { useState } from "react";
import { API } from "@/services/api";
import { backendFetch } from "@/services/httpClient";
import { Morador } from "@/features/relatorio/types";

interface UseRelatorioActionsProps {
  userId: string | null;
  moradores: Morador[];
  valoresFinais: number[];
  despesasDoMes: any[];
  mesSelecionado: string;
  anoSelecionado: string;
  totalDespesas: number;
  findPagamentoByMorador: (moradorId: string) => any;
}

export function useRelatorioActions({
  userId,
  moradores,
  valoresFinais,
  despesasDoMes,
  mesSelecionado,
  anoSelecionado,
  totalDespesas,
  findPagamentoByMorador,
}: UseRelatorioActionsProps) {
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [enviandoWhatsApp, setEnviandoWhatsApp] = useState(false);
  const [enviandoCobranca, setEnviandoCobranca] = useState(false);
  const [gerandoPDF, setGerandoPDF] = useState(false);
  const [mensagemPDF, setMensagemPDF] = useState("");

  const limparMensagem = () => {
    setTimeout(() => setMensagemPDF(""), 5000);
  };

  const enviarCobrancaEmailIndividual = async (
    morador: Morador,
    valor: number,
  ) => {
    if (!morador || valor <= 0) return;

    setGerandoPDF(true);
    setMensagemPDF("");

    try {
      // Formato de data esperado pelo backend: YYYY-MM-DDT00:00:00
      const vencimentoISO = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}-15T00:00:00`;

      const dadosCobranca = {
        Telefone: morador.telefone || "",
        Email: morador.email,
        NomeDevedor: morador.nome,
        Valor: valor,
        Vencimento: vencimentoISO,
      };

      const responseEmail = await backendFetch(
        "/api/notificacoes/email/cobranca",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosCobranca),
        },
      );

      if (!responseEmail.ok) {
        const errorData = await responseEmail.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao enviar email");
      }

      setMensagemPDF(`✅ Cobrança enviada por email para ${morador.nome}!`);
    } catch (error: any) {
      setMensagemPDF(`❌ Erro ao enviar cobrança por email: ${error.message}`);
    } finally {
      setGerandoPDF(false);
      limparMensagem();
    }
  };

  const enviarCobrancaWhatsAppIndividual = async (
    morador: Morador,
    valor: number,
  ) => {
    if (!morador || valor <= 0) return;

    setGerandoPDF(true);
    setMensagemPDF("");

    try {
      // Formato de data esperado pelo backend: YYYY-MM-DDT00:00:00
      const vencimentoISO = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}-15T00:00:00`;

      const dadosCobranca = {
        Telefone: morador.telefone,
        Email: morador.email || null,
        NomeDevedor: morador.nome,
        Valor: valor,
        Vencimento: vencimentoISO,
      };

      const responseWhatsApp = await backendFetch(
        "/api/notificacoes/whatsapp/cobranca",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosCobranca),
        },
      );

      if (!responseWhatsApp.ok) {
        const errorData = await responseWhatsApp.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao enviar WhatsApp");
      }

      setMensagemPDF(`✅ Cobrança enviada por WhatsApp para ${morador.nome}!`);
    } catch (error: any) {
      setMensagemPDF(
        `❌ Erro ao enviar cobrança por WhatsApp: ${error.message}`,
      );
    } finally {
      setGerandoPDF(false);
      limparMensagem();
    }
  };

  const enviarCobrancaEmailTodos = async () => {
    setEnviandoCobranca(true);
    setMensagemPDF("Enviando cobranças por email para todos os moradores...");

    try {
      // Formato de data esperado pelo backend: YYYY-MM-DDT00:00:00
      const vencimentoISO = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}-15T00:00:00`;

      const moradoresComCobranca = moradores
        .map((morador, idx) => ({
          Email: morador.email,
          Nome: morador.nome,
          Valor: Number(valoresFinais[idx] || 0),
          Vencimento: vencimentoISO,
        }))
        .filter((m) => m.Valor > 0 && m.Email);

      if (moradoresComCobranca.length === 0) {
        setMensagemPDF("⚠️ Nenhum morador com email e valor para cobrar.");
        setEnviandoCobranca(false);
        limparMensagem();
        return;
      }

      const responseEmail = await backendFetch(
        "/api/notificacoes/email/cobranca-lote",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Moradores: moradoresComCobranca }),
        },
      );

      if (!responseEmail.ok) {
        const errorData = await responseEmail.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao enviar emails");
      }

      const result = await responseEmail.json();
      setMensagemPDF(
        result.message || "✅ Cobranças enviadas por email com sucesso!",
      );
    } catch (error: any) {
      setMensagemPDF(`❌ Erro ao enviar cobranças por email: ${error.message}`);
    } finally {
      setEnviandoCobranca(false);
      limparMensagem();
    }
  };

  const enviarCobrancaWhatsAppTodos = async () => {
    setEnviandoCobranca(true);
    setMensagemPDF(
      "Enviando cobranças por WhatsApp para todos os moradores...",
    );

    try {
      // Formato de data esperado pelo backend: YYYY-MM-DDT00:00:00
      const vencimentoISO = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}-15T00:00:00`;

      const moradoresComCobranca = moradores
        .map((morador, idx) => ({
          Telefone: morador.telefone,
          Nome: morador.nome,
          Valor: Number(valoresFinais[idx] || 0),
          Vencimento: vencimentoISO,
        }))
        .filter((m) => m.Valor > 0 && m.Telefone);

      if (moradoresComCobranca.length === 0) {
        setMensagemPDF("⚠️ Nenhum morador com telefone e valor para cobrar.");
        setEnviandoCobranca(false);
        limparMensagem();
        return;
      }

      const responseWhatsApp = await backendFetch(
        "/api/notificacoes/whatsapp/cobranca-lote",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UsuarioId: userId,
            Moradores: moradoresComCobranca,
          }),
        },
      );

      if (!responseWhatsApp.ok) {
        const errorData = await responseWhatsApp.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao enviar WhatsApp");
      }

      const result = await responseWhatsApp.json();
      setMensagemPDF(
        result.message || "✅ Cobranças enviadas por WhatsApp com sucesso!",
      );
    } catch (error: any) {
      setMensagemPDF(
        `❌ Erro ao enviar cobranças por WhatsApp: ${error.message}`,
      );
    } finally {
      setEnviandoCobranca(false);
      limparMensagem();
    }
  };

  const enviarRelatorioEmailIndividual = async (morador: Morador) => {
    if (!morador || !userId) return;

    setGerandoPDF(true);
    setMensagemPDF("Gerando PDF e enviando relatório por email...");

    try {
      const { gerarRelatorioPDF } = await import("@/features/relatorio/pdf");

      const apartamentosPDF = moradores.map((m, idx) => {
        const pagamento = findPagamentoByMorador(m.id);
        const valorAporte = Number(pagamento?.caixinha || 0);
        const valorDevido = Number(valoresFinais[idx] || 0);
        return {
          numero: m.numero,
          devido: valorDevido,
          caixinha: valorAporte,
          total: valorDevido + valorAporte,
        };
      });
      const totalComAportes =
        totalDespesas +
        apartamentosPDF.reduce((sum, apt) => sum + apt.caixinha, 0);

      const arrayBuffer = await gerarRelatorioPDF({
        despesas: despesasDoMes.map((d) => ({
          data: d.data,
          descricao: d.descricao,
          categoria: d.categoria,
          valor: Number(d.valor),
          comprovanteUrl: d.comprovanteUrl,
        })),
        apartamentos: apartamentosPDF,
        total: totalComAportes,
        mes:
          [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ][Number(mesSelecionado) - 1] || mesSelecionado,
        ano: anoSelecionado,
      });

      const userData = (await API.auth.me()) as any;
      const mesNome = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ][Number(mesSelecionado) - 1];

      const mesAno = `${mesNome}-${anoSelecionado}`;

      const blob = new Blob([new Uint8Array(arrayBuffer)], {
        type: "application/pdf",
      });
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });

      const backendResponse = await backendFetch(
        "/api/notificacoes/email/enviar-relatorio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: userId,
            email: morador.email,
            nome: morador.nome,
            mesAno: mesAno,
            pdfBase64: base64,
            todos: false,
          }),
        },
      );

      if (!backendResponse.ok) {
        throw new Error(`Erro ao enviar email: ${backendResponse.status}`);
      }

      setMensagemPDF(
        `✅ Relatório enviado por email para ${morador.nome} (Apt ${morador.numero})!`,
      );
    } catch (error: any) {
      setMensagemPDF(`❌ Erro ao enviar relatório: ${error.message}`);
    } finally {
      setGerandoPDF(false);
      limparMensagem();
    }
  };

  const enviarRelatorioEmailTodos = async () => {
    if (enviandoEmail) return;

    setEnviandoEmail(true);
    setMensagemPDF("Gerando PDF e enviando relatório por email para todos...");

    try {
      const { gerarRelatorioPDF } = await import("@/features/relatorio/pdf");

      const apartamentosPDF = moradores.map((m, idx) => {
        const pagamento = findPagamentoByMorador(m.id);
        const valorAporte = Number(pagamento?.caixinha || 0);
        const valorDevido = Number(valoresFinais[idx] || 0);
        return {
          numero: m.numero,
          devido: valorDevido,
          caixinha: valorAporte,
          total: valorDevido + valorAporte,
        };
      });
      const totalComAportes =
        totalDespesas +
        apartamentosPDF.reduce((sum, apt) => sum + apt.caixinha, 0);

      const arrayBuffer = await gerarRelatorioPDF({
        despesas: despesasDoMes.map((d) => ({
          data: d.data,
          descricao: d.descricao,
          categoria: d.categoria,
          valor: Number(d.valor),
          comprovanteUrl: d.comprovanteUrl,
        })),
        apartamentos: apartamentosPDF,
        total: totalComAportes,
        mes:
          [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ][Number(mesSelecionado) - 1] || mesSelecionado,
        ano: anoSelecionado,
      });

      const blob = new Blob([new Uint8Array(arrayBuffer)], {
        type: "application/pdf",
      });

      const mesNome = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ][Number(mesSelecionado) - 1];

      const mesAno = `${mesNome}-${anoSelecionado}`;

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });

      const backendResponse = await backendFetch(
        "/api/notificacoes/email/enviar-relatorio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: userId,
            mesAno: mesAno,
            pdfBase64: base64,
            todos: true,
          }),
        },
      );

      if (!backendResponse.ok) {
        throw new Error(`Erro ao enviar email: ${backendResponse.status}`);
      }

      setMensagemPDF("✅ Relatório enviado por email com sucesso!");
    } catch (error: any) {
      setMensagemPDF(`❌ Erro ao enviar relatório: ${error.message}`);
    } finally {
      setEnviandoEmail(false);
      limparMensagem();
    }
  };

  const enviarWhatsAppIndividual = async (morador: Morador) => {
    if (!morador || !userId) return;

    setGerandoPDF(true);
    setMensagemPDF("Gerando PDF e enviando por WhatsApp...");

    try {
      const { gerarRelatorioPDF } = await import("@/features/relatorio/pdf");

      const apartamentosPDF = moradores.map((m, idx) => {
        const pagamento = findPagamentoByMorador(m.id);
        const valorAporte = Number(pagamento?.caixinha || 0);
        const valorDevido = Number(valoresFinais[idx] || 0);
        return {
          numero: m.numero,
          devido: valorDevido,
          caixinha: valorAporte,
          total: valorDevido + valorAporte,
        };
      });
      const totalComAportes =
        totalDespesas +
        apartamentosPDF.reduce((sum, apt) => sum + apt.caixinha, 0);

      const arrayBuffer = await gerarRelatorioPDF({
        despesas: despesasDoMes.map((d) => ({
          data: d.data,
          descricao: d.descricao,
          categoria: d.categoria,
          valor: Number(d.valor),
          comprovanteUrl: d.comprovanteUrl,
        })),
        apartamentos: apartamentosPDF,
        total: totalComAportes,
        mes:
          [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ][Number(mesSelecionado) - 1] || mesSelecionado,
        ano: anoSelecionado,
      });

      const mesNome = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ][Number(mesSelecionado) - 1];

      const mesAno = `${mesNome}-${anoSelecionado}`;

      const blob = new Blob([new Uint8Array(arrayBuffer)], {
        type: "application/pdf",
      });

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const pdf_base64 = base64data.split(",")[1];

        try {
          const response = await backendFetch(
            "/api/notificacoes/whatsapp/enviar-relatorio",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                usuarioId: userId,
                numero: morador.telefone,
                mesAno: mesAno,
                pdfBase64: pdf_base64,
                todos: false,
              }),
            },
          );

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Erro ao enviar WhatsApp");
          }

          setMensagemPDF(
            `✅ WhatsApp enviado com sucesso para ${morador.nome} (Apt ${morador.numero})!`,
          );
        } catch (error: any) {
          setMensagemPDF(`❌ Erro ao enviar WhatsApp: ${error.message}`);
        } finally {
          setGerandoPDF(false);
          limparMensagem();
        }
      };

      reader.onerror = () => {
        setMensagemPDF("❌ Erro ao converter PDF para base64");
        setGerandoPDF(false);
        limparMensagem();
      };
    } catch (error: any) {
      setMensagemPDF(`❌ Erro ao enviar WhatsApp: ${error.message}`);
      setGerandoPDF(false);
      limparMensagem();
    }
  };

  const enviarWhatsAppTodos = async () => {
    console.log("🚀 enviarWhatsAppTodos - INICIANDO");
    console.log("📊 UserId:", userId);
    console.log("📊 Moradores:", moradores);
    console.log("📊 Despesas do mes:", despesasDoMes);

    if (!userId) {
      console.log("❌ Sem userId, abortando");
      return;
    }

    setEnviandoWhatsApp(true);
    setMensagemPDF("Gerando PDF e enviando por WhatsApp para todos...");

    try {
      console.log("📄 Importando gerador de PDF...");
      const { gerarRelatorioPDF } = await import("@/features/relatorio/pdf");

      console.log("📄 Gerando PDF...");
      const apartamentosPDF = moradores.map((m, idx) => {
        const pagamento = findPagamentoByMorador(m.id);
        const valorAporte = Number(pagamento?.caixinha || 0);
        const valorDevido = Number(valoresFinais[idx] || 0);
        return {
          numero: m.numero,
          devido: valorDevido,
          caixinha: valorAporte,
          total: valorDevido + valorAporte,
        };
      });
      const totalComAportes =
        totalDespesas +
        apartamentosPDF.reduce((sum, apt) => sum + apt.caixinha, 0);

      const arrayBuffer = await gerarRelatorioPDF({
        despesas: despesasDoMes.map((d) => ({
          data: d.data,
          descricao: d.descricao,
          categoria: d.categoria,
          valor: Number(d.valor),
          comprovanteUrl: d.comprovanteUrl,
        })),
        apartamentos: apartamentosPDF,
        total: totalComAportes,
        mes:
          [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ][Number(mesSelecionado) - 1] || mesSelecionado,
        ano: anoSelecionado,
      });

      const mesNome = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ][Number(mesSelecionado) - 1];

      const mesAno = `${mesNome}-${anoSelecionado}`;

      console.log(
        "📄 PDF gerado! Tamanho arrayBuffer:",
        arrayBuffer.byteLength,
      );
      console.log("📅 Mes/Ano:", mesAno);

      const blob = new Blob([new Uint8Array(arrayBuffer)], {
        type: "application/pdf",
      });

      console.log("📄 Convertendo para base64...");
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });

      console.log("📄 Base64 gerado! Tamanho:", base64.length);
      console.log("📤 Enviando para backend...");

      const response = await backendFetch(
        "/api/notificacoes/whatsapp/enviar-relatorio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: userId,
            mesAno: mesAno,
            pdfBase64: base64,
            todos: true,
          }),
        },
      );

      console.log("📥 Resposta do backend - Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Erro do backend:", errorData);
        throw new Error(errorData.error || "Erro ao enviar WhatsApp");
      }

      const result = await response.json();
      console.log("✅ Sucesso! Resultado:", result);
      setMensagemPDF(`✅ ${result.message || "WhatsApp enviado com sucesso!"}`);
    } catch (error: any) {
      console.log("❌ ERRO CATCH:", error);
      setMensagemPDF(`❌ Erro ao enviar WhatsApp: ${error.message}`);
    } finally {
      console.log("🏁 Finalizando enviarWhatsAppTodos");
      setEnviandoWhatsApp(false);
      limparMensagem();
    }
  };

  const gerarPDF = async () => {
    setGerandoPDF(true);
    setMensagemPDF("");

    try {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (isMobile) {
        setMensagemPDF(
          "Gerando PDF... Isso pode demorar um pouco em dispositivos móveis.",
        );
      }

      const { gerarRelatorioPDF } = await import("@/features/relatorio/pdf");

      const despesasPDF = despesasDoMes.map((d) => ({
        data: d.data,
        descricao: d.descricao,
        categoria: d.categoria,
        valor: Number(d.valor),
        comprovanteUrl: d.comprovanteUrl,
      }));

      const apartamentosPDF = moradores.map((m, idx) => {
        const pagamento = findPagamentoByMorador(m.id);
        const valorAporte = Number(pagamento?.caixinha || 0);
        const valorDevido = Number(valoresFinais[idx] || 0);
        return {
          numero: m.numero,
          devido: valorDevido,
          caixinha: valorAporte,
          total: valorDevido + valorAporte,
        };
      });

      const mesNome =
        [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ][Number(mesSelecionado) - 1] || mesSelecionado;

      const userData = (await API.auth.me()) as any;
      const nome =
        userData?.user?.nome ||
        userData?.user?.email?.split("@")[0] ||
        "Condomínio";
      const email = userData?.user?.email || "";

      const totalComAportes =
        totalDespesas +
        apartamentosPDF.reduce((sum, apt) => sum + apt.caixinha, 0);

      await gerarRelatorioPDF({
        despesas: despesasPDF,
        apartamentos: apartamentosPDF,
        total: totalComAportes,
        mes: mesNome,
        ano: anoSelecionado,
        nome,
        email,
        download: true,
      });

      setMensagemPDF("PDF gerado com sucesso!");
    } catch (error) {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (isMobile) {
        setMensagemPDF(
          "Erro ao gerar PDF em dispositivo móvel. Tente usar um computador ou tablet para melhor experiência.",
        );
      } else {
        setMensagemPDF("Erro ao gerar PDF. Tente novamente.");
      }
    } finally {
      setGerandoPDF(false);
      limparMensagem();
    }
  };

  return {
    enviandoEmail,
    enviandoWhatsApp,
    enviandoCobranca,
    gerandoPDF,
    mensagemPDF,
    enviarCobrancaEmailIndividual,
    enviarCobrancaWhatsAppIndividual,
    enviarCobrancaEmailTodos,
    enviarCobrancaWhatsAppTodos,
    enviarRelatorioEmailIndividual,
    enviarRelatorioEmailTodos,
    enviarWhatsAppIndividual,
    enviarWhatsAppTodos,
    gerarPDF,
  };
}

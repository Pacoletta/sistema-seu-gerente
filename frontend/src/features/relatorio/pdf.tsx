// Tipos fora da função
export type Despesa = {
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  comprovanteUrl?: string | null;
};
export type Apartamento = {
  numero: string;
  devido: number;
  caixinha: number;
  total: number;
};

// Função utilitária para gerar o PDF do relatório

export async function gerarRelatorioPDF(params: {
  despesas: Despesa[];
  apartamentos: Apartamento[];
  total: number;
  mes: string; // Ex: 'Setembro'
  ano: string | number; // Ex: '2025'
  nome?: string;
  email?: string;
  download?: boolean;
}): Promise<Uint8Array> {
  try {
    // Detecta se é dispositivo móvel
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // Carrega jsPDF de forma mais segura para mobile
    const jsPDF = (await import("jspdf")).jsPDF;
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      compress: true, // Adiciona compressão para reduzir o tamanho
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin + 5;

    // Linha sutil no topo (cabeçalho profissional)
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 3, pageWidth - margin, margin + 3);

    // Logo no canto superior esquerdo
    try {
      const logoUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/logo-seugerente.png`;

      const res = await fetch(logoUrl);
      if (res.ok) {
        const blob = await res.blob();
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(blob);
        const pngData = await base64Promise;
        doc.addImage(pngData, "PNG", margin + 2, margin + 8, 18, 18);
      }
    } catch (e) {
      console.warn("Logo não carregada:", e);
    }

    // Título do relatório
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text(`Relatório ${params.mes} ${params.ano}`, pageWidth / 2, y + 10, {
      align: "center",
    });
    y += 12;
    // Nome e email centralizados (sempre mostra)
    let nome = params.nome && params.nome.trim() ? params.nome : undefined;
    let email = params.email && params.email.trim() ? params.email : undefined;
    if (!nome) nome = "Condomínio";
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    let info = nome;
    if (email) info += "  •  " + email;
    doc.text(info, pageWidth / 2, y + 6, { align: "center" });
    y += 10;
    doc.setTextColor(44, 62, 80);
    // Valor total destacado
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 150, 243);
    doc.text(
      `R$ ${params.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      pageWidth / 2,
      y + 10,
      { align: "center" },
    );
    y += 20;
    // Linha separadora sutil após valor total
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(44, 62, 80);

    // Tabela: Despesas detalhadas
    y += 6;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Despesas detalhadas", margin + 2, y);
    y += 7;
    // Cabeçalho
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Data", margin + 2, y);
    doc.text("Descrição", margin + 28, y);
    doc.text("Categoria", margin + 110, y);
    doc.text("Valor (R$)", pageWidth - margin - 2 - 28, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    // Linhas de despesas (com quebra de linha na descrição)
    let isFirstPage = true;
    params.despesas.forEach((d) => {
      if (y > pageHeight - margin - 12) {
        doc.addPage();
        isFirstPage = false;
        y = margin + 5; // Espaço extra no topo das próximas páginas
      }

      const dataObj = new Date(d.data);
      const dataBR = new Date(dataObj.getTime() + 3 * 60 * 60 * 1000); // Ajusta UTC para GMT-3
      doc.text(dataBR.toLocaleDateString("pt-BR"), margin + 2, y);

      // Descrição normal (sem link)
      const descLines = doc.splitTextToSize(d.descricao, 78);
      const maxLines = Math.max(1, descLines.length);
      doc.text(descLines, margin + 28, y);

      doc.text(d.categoria, margin + 110, y);
      doc.text(
        `R$ ${d.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        pageWidth - margin - 2 - 28,
        y,
      );
      y += 6 * maxLines;
    });
    // Linha separadora sutil após despesas detalhadas
    y += 4;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10; // aumenta o espaço antes do título 'Valor por apartamento'

    // Tabela: Valor por apartamento
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Valor por apartamento", margin + 2, y);
    y += 7;
    doc.setFontSize(11);
    doc.text("Apartamento", margin + 2, y);
    doc.text("Valor Devido", margin + 60, y);
    doc.text("Aporte", margin + 110, y);
    doc.text("Total", pageWidth - margin - 2 - 28, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    isFirstPage = true;
    params.apartamentos.forEach((ap) => {
      if (y > pageHeight - margin - 12) {
        doc.addPage();
        isFirstPage = false;
        y = margin + 5; // Espaço extra no topo das próximas páginas
      }
      doc.text(ap.numero, margin + 2, y);
      doc.text(
        `R$ ${ap.devido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        margin + 60,
        y,
      );
      // Aporte em verde
      doc.setTextColor(22, 163, 74); // Verde
      doc.text(
        `R$ ${(ap.caixinha || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        margin + 110,
        y,
      );
      doc.setTextColor(44, 62, 80); // Volta para cor padrão
      doc.text(
        `R$ ${ap.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        pageWidth - margin - 2 - 28,
        y,
      );
      y += 6;
    });

    // Seção de Comprovantes (URLs)
    const despesasComComprovante = params.despesas.filter(
      (d) => d.comprovanteUrl,
    );
    if (despesasComComprovante.length > 0) {
      y += 8; // Espaço antes da seção

      // Verifica se precisa de nova página
      if (y > pageHeight - margin - 20) {
        doc.addPage();
        y = margin + 5;
      }

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Comprovantes", margin + 2, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      despesasComComprovante.forEach((d) => {
        // Verifica se precisa de nova página
        if (y > pageHeight - margin - 15) {
          doc.addPage();
          y = margin + 5;
        }

        // Nome da despesa
        doc.setFont("helvetica", "bold");
        doc.text(`• ${d.descricao}:`, margin + 2, y);
        y += 5;

        // URL do comprovante
        doc.setFont("helvetica", "normal");
        doc.setTextColor(33, 150, 243); // Azul para indicar link
        const urlLines = doc.splitTextToSize(
          d.comprovanteUrl!,
          pageWidth - margin * 2 - 6,
        );
        urlLines.forEach((line: string) => {
          if (y > pageHeight - margin - 12) {
            doc.addPage();
            y = margin + 5;
          }
          doc.textWithLink(line, margin + 6, y, { url: d.comprovanteUrl! });
          y += 5;
        });
        doc.setTextColor(44, 62, 80); // Volta para cor padrão
        y += 2; // Espaço entre comprovantes
      });
    }

    if (params.download) {
      if (isMobile) {
        // Para dispositivos móveis, usa uma abordagem diferente
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        // Cria um link temporário para download
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio-${params.mes}-${params.ano}.pdf`;
        link.style.display = "none";
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Limpa recursos
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        doc.save(`relatorio-${params.mes}-${params.ano}.pdf`);
      }
    }
    return new Uint8Array(doc.output("arraybuffer"));
  } catch (error) {
    // Erro ao gerar PDF

    // Fallback: tenta uma versão mais simples do PDF
    try {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      const jsPDF = (await import("jspdf")).jsPDF;
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      // Versão simplificada sem imagens
      doc.setFontSize(16);
      doc.text(`Relatório ${params.mes} ${params.ano}`, 20, 20);
      doc.setFontSize(12);
      doc.text(
        `Total: R$ ${params.total.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        20,
        35,
      );

      let y = 50;
      doc.text("Despesas:", 20, y);
      y += 10;

      params.despesas.forEach((despesa, index) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.text(
          `${despesa.descricao}: R$ ${despesa.valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`,
          20,
          y,
        );
        y += 7;
      });

      if (params.download) {
        const fileName = `relatorio-${params.mes}-${params.ano}.pdf`;
        if (isMobile) {
          const pdfBlob = doc.output("blob");
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          doc.save(fileName);
        }
      }

      return new Uint8Array(doc.output("arraybuffer"));
    } catch (fallbackError) {
      // Erro no fallback do PDF
      throw new Error(
        "Não foi possível gerar o PDF. Tente novamente em um navegador desktop.",
      );
    }
  }
}

import { useState } from "react";
import { backendFetch } from "@/services/httpClient";
import type { Morador, Pagamento } from "@/features/receitas/types";

interface UseReceitasActionsProps {
  userId: string | null;
  moradores: Morador[];
  moradoresFiltrados: Morador[];
  pagamentos: Pagamento[];
  valoresDevidos: number[];
  mesSelecionado: string;
  anoSelecionado: string;
  findPagamentoByMorador: (moradorId: string) => Pagamento | undefined;
  mutatePagamentos: () => Promise<any>;
}

export function useReceitasActions({
  userId,
  moradores,
  moradoresFiltrados,
  pagamentos,
  valoresDevidos,
  mesSelecionado,
  anoSelecionado,
  findPagamentoByMorador,
  mutatePagamentos,
}: UseReceitasActionsProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  // Funções auxiliares de formatação de data
  const formatarDataBrasil = (dataISO: string | null): string => {
    if (!dataISO) return "";

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
        return dataISO;
      }

      if (dataISO.includes("T")) {
        const data = new Date(dataISO);
        const offsetBrasil = -3 * 60;
        const offsetUTC = data.getTimezoneOffset();
        const dataAjustada = new Date(
          data.getTime() + (offsetUTC + offsetBrasil) * 60000,
        );

        const ano = dataAjustada.getFullYear();
        const mes = String(dataAjustada.getMonth() + 1).padStart(2, "0");
        const dia = String(dataAjustada.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
      }

      const data = new Date(dataISO);
      if (isNaN(data.getTime())) {
        return "";
      }

      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");

      return `${ano}-${mes}-${dia}`;
    } catch (error) {
      return "";
    }
  };

  const converterDataParaUTC = (dataInput: string): string => {
    try {
      const [ano, mes, dia] = dataInput.split("-").map(Number);
      const data = new Date();
      data.setFullYear(ano);
      data.setMonth(mes - 1);
      data.setDate(dia);
      data.setHours(10, 0, 0, 0);

      const offsetBrasil = -3;
      const dataUTC = new Date(data.getTime() - offsetBrasil * 60 * 60 * 1000);

      if (isNaN(dataUTC.getTime())) {
        throw new Error("Data inválida após conversão");
      }

      return dataUTC.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  };

  // Função para extrair o caminho completo do arquivo
  function extrairNomeArquivo(url: string): string | null {
    try {
      if (!url) return null;
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const filename = pathParts[pathParts.length - 1];
      const userId = pathParts[pathParts.length - 2];
      return `${userId}/${filename}`;
    } catch (error) {
      console.error("Erro ao extrair caminho do arquivo:", error);
      return null;
    }
  }

  // Função para deletar arquivo do Storage
  async function deletarArquivoStorage(url: string): Promise<boolean> {
    try {
      const nomeArquivo = extrairNomeArquivo(url);
      if (!nomeArquivo) return false;
      const res = await backendFetch(
        `/api/comprovantes/${nomeArquivo}?bucket=receitas`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async function atualizarPagamento(moradorId: string, update?: any) {
    const mesAno = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}`;
    let pagamento = findPagamentoByMorador(moradorId);

    console.log("🔍 atualizarPagamento chamado:", {
      moradorId,
      mesAno,
      update,
      updateType: typeof update,
      updateKeys: update ? Object.keys(update) : [],
      urlComprovanteValue: update?.urlComprovante,
      urlComprovanteType: typeof update?.urlComprovante,
      isFile: update?.urlComprovante instanceof File,
      pagamentoEncontrado: !!pagamento,
      pagamentoId: pagamento?.id,
      statusAtual: pagamento?.status,
      novoStatus: update?.status,
      totalPagamentosEmCache: pagamentos.length,
    });

    // Se não existe, cria o registro primeiro
    if (!pagamento) {
      try {
        const morador = moradores.find((m) => m.id === moradorId);
        if (!morador) {
          console.error("Morador não encontrado");
          return;
        }

        // Busca índice em moradoresFiltrados (que é o array usado para calcular valoresDevidos)
        const idx = moradoresFiltrados.findIndex((m) => m.id === moradorId);
        const valorDevido = Number(valoresDevidos[idx] || 0);

        const novoPagamento = {
          moradorId: moradorId,
          mesAno: mesAno,
          valor: valorDevido,
          caixinha: 0,
          dataVencimento: `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}-05T10:00:00Z`,
        };

        const resCreate = await backendFetch(`/api/pagamentos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoPagamento),
        });

        if (!resCreate.ok) {
          let errorData;
          try {
            errorData = await resCreate.json();
          } catch (e) {
            errorData = await resCreate.text();
          }
          console.error("Erro ao criar pagamento:", {
            status: resCreate.status,
            statusText: resCreate.statusText,
            error: errorData,
          });
          return;
        }

        const resFetch = await backendFetch(
          `/api/pagamentos?usuario_id=${userId}&mes_ano=${mesAno}&morador_id=${moradorId}`,
        );

        if (!resFetch.ok) {
          console.error("Erro ao buscar pagamento criado");
          return;
        }

        const pagamentoCriado = await resFetch.json();
        if (!pagamentoCriado || pagamentoCriado.length === 0) {
          console.error("Não foi possível criar pagamento para o morador");
          return;
        }

        pagamento = pagamentoCriado[0];
        await mutatePagamentos();
      } catch (error) {
        console.error("Erro ao criar registro:", error);
        return;
      }
    }

    const { id } = pagamento;
    let campos = { ...update };

    // Se está removendo comprovante, deleta do storage
    if ((update?.urlComprovante === null || update?.urlComprovante === "") && pagamento?.urlComprovante) {
      await deletarArquivoStorage(pagamento.urlComprovante);
    }

    // Se for comprovante, faz upload via backend
    if (update && update.urlComprovante instanceof File) {
      const file = update.urlComprovante;
      const uploadKey = `${moradorId}_upload`;
      try {
        setUploadingFiles((prev) => new Set([...prev, uploadKey]));
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pagamento_id", id);
        formData.append("user_id", userId || "");

        const res = await backendFetch(`/api/comprovantes/upload/receitas`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Erro ao fazer upload do comprovante:", {
            status: res.status,
            statusText: res.statusText,
            error: errorText,
            pagamentoId: id,
            mesAno,
          });
          alert(`Erro ao fazer upload: ${res.status} - ${res.statusText}`);
          return;
        }

        const { publicUrl } = await res.json();
        console.log("✅ Upload receita concluído! URL recebida:", publicUrl);
        campos.urlComprovante = publicUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        console.error("❌ Erro ao processar upload:", {
          error: errorMessage,
          moradorId,
          mesAno,
          stack: error instanceof Error ? error.stack : undefined,
        });
        alert(`Erro ao processar upload: ${errorMessage}`);
        return;
      } finally {
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(uploadKey);
          return newSet;
        });
      }
    }

    // Atualizar diretamente via backend
    try {
      console.log("🔄 Atualizando pagamento:", {
        id,
        campos,
        camposKeys: Object.keys(campos),
        urlComprovanteNoCampos: campos.urlComprovante,
        url: `/api/pagamentos/${id}`,
      });

      const res = await backendFetch(`/api/pagamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campos),
      });

      console.log("📡 Resposta do backend:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = await res.text();
        }
        console.error("Erro ao atualizar pagamento:", {
          status: res.status,
          statusText: res.statusText,
          error: errorData,
          campos,
        });
        return;
      }

      console.log("✅ Pagamento atualizado com sucesso! Revalidando dados...");

      // Força revalidação imediata
      const resultMutate = await mutatePagamentos();
      console.log(
        "📊 Resultado do mutate:",
        resultMutate?.length,
        "pagamentos",
      );
      console.log(
        "📊 Dados do mutate (detalhado):",
        resultMutate?.map((p: any) => ({
          id: p.id,
          moradorId: p.moradorId,
          mesAno: p.mesAno,
          status: p.status,
          urlComprovante: p.urlComprovante,
          url_comprovante: p.url_comprovante,
          statusType: typeof p.status,
        })),
      );

      // Segunda revalidação após delay
      setTimeout(async () => {
        console.log("⏱️ Revalidação tardia (500ms)...");
        const resultMutate2 = await mutatePagamentos();
        console.log(
          "📊 Resultado do mutate tardio:",
          resultMutate2?.length,
          "pagamentos",
        );
      }, 500);
    } catch (error) {
      console.error("Erro na requisição de atualização:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        campos,
      });
    }
  }

  async function salvarAporte(
    valorAporte: string,
    moradorIds: string[],
    aporteParaTodos: boolean,
  ) {
    if (!valorAporte || Number(valorAporte) <= 0) {
      alert("Por favor, informe um valor válido para o aporte");
      return false;
    }

    if (!aporteParaTodos && moradorIds.length === 0) {
      alert("Por favor, selecione ao menos um apartamento");
      return false;
    }

    try {
      const mesAno = `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}`;

      // Define lista de moradores a processar
      const moradoresParaProcessar = aporteParaTodos
        ? moradores
        : moradores.filter((m) => moradorIds.includes(m.id));

      let sucessos = 0;
      let erros = 0;
      const errosDetalhes: string[] = [];

      for (const morador of moradoresParaProcessar) {
        try {
          let pagamento = findPagamentoByMorador(morador.id);

          if (!pagamento) {
            // Busca índice em moradoresFiltrados para pegar valor correto
            const idx = moradoresFiltrados.findIndex(
              (m) => m.id === morador.id,
            );
            const valorDevido = Number(valoresDevidos[idx] || 0);

            const novoPagamento = {
              moradorId: morador.id,
              mesAno: mesAno,
              valor: valorDevido,
              status: "pendente",
              caixinha: Number(valorAporte),
              dataVencimento: `${anoSelecionado}-${mesSelecionado.padStart(2, "0")}-05T10:00:00Z`,
            };

            const resCreate = await backendFetch(`/api/pagamentos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(novoPagamento),
            });

            if (!resCreate.ok) {
              const errorText = await resCreate.text();
              errosDetalhes.push(`Apt ${morador.numero}: ${errorText}`);
              erros++;
              continue;
            }
          } else {
            // Atualiza pagamento existente adicionando ao valor da caixinha
            const valorCaixinhaAtual = Number(pagamento.caixinha || 0);
            const novoValorCaixinha = valorCaixinhaAtual + Number(valorAporte);

            const resUpdate = await backendFetch(
              `/api/pagamentos/${pagamento.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  caixinha: novoValorCaixinha,
                }),
              },
            );

            if (!resUpdate.ok) {
              const errorText = await resUpdate.text();
              errosDetalhes.push(`Apt ${morador.numero}: ${errorText}`);
              erros++;
              continue;
            }
          }
          sucessos++;
        } catch (error) {
          errosDetalhes.push(`Apt ${morador.numero}: ${error}`);
          erros++;
        }
      }

      await mutatePagamentos();

      if (erros > 0) {
        alert(
          `Aporte aplicado com sucesso para ${sucessos} apartamento(s). ${erros} falharam.\n\nErros:\n${errosDetalhes.join("\n")}`,
        );
      } else {
        alert(
          `✅ Aporte de R$ ${Number(valorAporte).toFixed(2)} aplicado para ${sucessos} apartamento(s) com sucesso!`,
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar aporte:", error);
      alert("Erro ao salvar aporte. Tente novamente.");
      return false;
    }
  }

  // Função para fazer upload de arquivo de comprovante
  async function handleFileUpload(moradorId: string, file: File) {
    await atualizarPagamento(moradorId, { urlComprovante: file });
  }

  // Função para remover comprovante
  async function handleComprovanteRemove(moradorId: string) {
    await atualizarPagamento(moradorId, { urlComprovante: "" });
  }

  return {
    uploadingFiles,
    formatarDataBrasil,
    converterDataParaUTC,
    atualizarPagamento,
    salvarAporte,
    handleFileUpload,
    handleComprovanteRemove,
  };
}

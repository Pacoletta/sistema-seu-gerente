import { useState } from "react";
import { API } from "@/services/api";
import { backendFetch } from "@/services/httpClient";
import { Despesa, Morador } from "@/features/despesas/types";

export function useDespesasActions(
  despesas: Despesa[],
  moradores: Morador[],
  mutate: () => Promise<any>,
  userId: string | null,
) {
  const [uploadingDespesas, setUploadingDespesas] = useState<Set<string>>(
    new Set(),
  );
  const [erroSupabase, setErroSupabase] = useState<string>("");

  async function handleDelete(idx: number) {
    const despesa = despesas[idx];
    const id = despesa.id;

    if (
      !confirm(
        `Tem certeza que deseja deletar a despesa "${despesa.descricao}"?`,
      )
    ) {
      return;
    }

    try {
      await API.despesas.delete(id!);
      await mutate();
    } catch (error) {
      alert(
        `Erro ao deletar despesa: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  }

  async function handleComprovanteChange(despesa: Despesa, file: File | null) {
    if (!file) return;

    if (!despesa.id) {
      alert(
        "Erro: Despesa ainda não foi salva. Salve a despesa antes de anexar comprovante.",
      );
      return;
    }

    const uploadKey = despesa.id;
    setUploadingDespesas((prev) => new Set([...prev, uploadKey]));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("despesa_id", despesa.id);
      formData.append("user_id", userId || "");

      const response = await backendFetch("/api/comprovantes/upload/despesas", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(
          `Erro ao fazer upload: ${response.status} - ${response.statusText}`,
        );
        return;
      }

      const { publicUrl } = await response.json();
      await API.despesas.update(despesa.id, {
        comprovanteUrl: publicUrl,
      });
      await mutate();
      alert("Comprovante anexado com sucesso!");
    } catch (error) {
      alert("Erro ao anexar comprovante. Tente novamente.");
    } finally {
      setUploadingDespesas((prev) => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  }

  async function handleRemoverComprovante(despesa: Despesa) {
    if (!confirm("Tem certeza que deseja remover o comprovante?")) {
      return;
    }

    try {
      if (despesa.comprovanteUrl) {
        const url = new URL(despesa.comprovanteUrl);
        const pathParts = url.pathname.split("/");
        const filename = pathParts[pathParts.length - 1];
        const userId = pathParts[pathParts.length - 2];
        const filePath = `${userId}/${filename}`;

        const deleteRes = await backendFetch(
          `/api/comprovantes/${filePath}`,
          {
            method: "DELETE",
          },
        );

        if (!deleteRes.ok) {
          console.warn("⚠️ Erro ao deletar do Storage, continuando...");
        }
      }

      await API.despesas.update(despesa.id!, {
        comprovanteUrl: "",
      });
      await mutate();
      alert("Comprovante removido com sucesso!");
    } catch (error) {
      alert("Erro ao remover comprovante. Tente novamente.");
    }
  }

  async function handleStatusChange(idx: number, status: "paga" | "pendente") {
    const despesa = despesas[idx];
    const id = despesa.id;

    console.log("🔄 Alterando status da despesa:", {
      id,
      descricao: despesa.descricao,
      statusAtual: despesa.status,
      novoStatus: status,
    });

    try {
      await API.despesas.update(id!, { status });
      console.log("✅ Status atualizado no backend");
      await mutate();
      console.log("✅ Cache atualizado via mutate()");
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
      alert("Erro ao atualizar status da despesa");
    }
  }

  return {
    uploadingDespesas,
    erroSupabase,
    setErroSupabase,
    handleDelete,
    handleComprovanteChange,
    handleRemoverComprovante,
    handleStatusChange,
  };
}

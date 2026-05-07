import { useState } from "react";
import { API } from "@/services/api";
import type {
  Melhoria,
  Sugestao,
  MelhoriaFormData,
  SugestaoFormData,
} from "@/features/melhorias/types";

export function useMelhoriasActions(
  userId: string | null,
  mutateMelhorias: () => Promise<any>,
  mutateSugestoes: () => Promise<any>,
) {
  const [showModal, setShowModal] = useState(false);
  const [showSugestaoModal, setShowSugestaoModal] = useState(false);
  const [editingMelhoria, setEditingMelhoria] = useState<Melhoria | null>(null);
  const [editingSugestao, setEditingSugestao] = useState<Sugestao | null>(null);

  const [formData, setFormData] = useState<MelhoriaFormData>({
    titulo: "",
    descricao: "",
    status: "planejada",
    prioridade: "media",
    categoria: "",
    custo_estimado: "",
    responsavel: "",
    data_inicio: "",
    data_fim_prevista: "",
    observacoes: "",
  });

  const [sugestaoFormData, setSugestaoFormData] = useState<SugestaoFormData>({
    titulo: "",
    descricao: "",
    categoria: "",
    observacoes: "",
  });

  const salvarMelhoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!formData.titulo.trim() && !formData.descricao.trim()) {
      alert("Preencha pelo menos o título ou a descrição da melhoria.");
      return;
    }

    try {
      const melhoriaData = {
        Titulo: formData.titulo.trim() || "Melhoria sem título",
        Descricao: formData.descricao.trim() || "Sem descrição",
        Status: formData.status,
        Prioridade: formData.prioridade,
        Categoria: formData.categoria?.trim() || "",
        CustoEstimado:
          formData.custo_estimado && formData.custo_estimado.trim()
            ? parseFloat(formData.custo_estimado)
            : null,
        Responsavel: formData.responsavel?.trim() || null,
        DataInicio:
          formData.data_inicio && formData.data_inicio.trim()
            ? formData.data_inicio.trim()
            : null,
        DataFimPrevista:
          formData.data_fim_prevista && formData.data_fim_prevista.trim()
            ? formData.data_fim_prevista.trim()
            : null,
        Observacoes: formData.observacoes?.trim() || null,
      };

      console.log("📤 Enviando melhoria para API:", melhoriaData);

      if (editingMelhoria) {
        await API.melhorias.update(editingMelhoria.id, melhoriaData);
      } else {
        await API.melhorias.create(melhoriaData);
      }

      await mutateMelhorias();
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar melhoria:", error);
      alert("Erro ao salvar melhoria. Tente novamente.");
    }
  };

  const deletarMelhoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta melhoria?")) return;
    try {
      await API.melhorias.delete(id);
      await mutateMelhorias();
    } catch (error) {
      console.error("Erro ao deletar melhoria:", error);
      alert("Erro ao deletar melhoria. Tente novamente.");
    }
  };

  const salvarSugestao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const sugestaoData = {
        Titulo: sugestaoFormData.titulo.trim(),
        Descricao: sugestaoFormData.descricao.trim(),
        Categoria: sugestaoFormData.categoria?.trim() || "",
        Observacoes: sugestaoFormData.observacoes?.trim() || null,
      };

      if (editingSugestao) {
        await API.sugestoes.update(editingSugestao.id, sugestaoData);
      } else {
        await API.sugestoes.create(sugestaoData);
      }

      await mutateSugestoes();
      fecharSugestaoModal();
    } catch (error) {
      console.error("Erro ao salvar sugestão:", error);
      alert("Erro ao salvar sugestão. Tente novamente.");
    }
  };

  const deletarSugestao = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta sugestão?")) return;
    try {
      await API.sugestoes.delete(id);
      await mutateSugestoes();
    } catch (error) {
      console.error("Erro ao deletar sugestão:", error);
      alert("Erro ao deletar sugestão. Tente novamente.");
    }
  };

  const transformarEmMelhoria = async (sugestao: Sugestao) => {
    try {
      const melhoriaData = {
        Titulo: sugestao.titulo,
        Descricao: sugestao.descricao,
        Status: "planejada" as const,
        Prioridade: "media" as const,
        Categoria: sugestao.categoria || "",
        Observacoes: sugestao.observacoes || null,
      };

      await API.melhorias.create(melhoriaData);
      await API.sugestoes.delete(sugestao.id);
      await Promise.all([mutateMelhorias(), mutateSugestoes()]);

      alert("Sugestão transformada em melhoria com sucesso!");
    } catch (error) {
      console.error("Erro ao transformar sugestão:", error);
      alert("Erro ao transformar sugestão. Tente novamente.");
    }
  };

  const abrirModal = (melhoria?: Melhoria) => {
    if (melhoria) {
      setEditingMelhoria(melhoria);

      // Converter datas ISO para formato YYYY-MM-DD do input date
      const formatarDataParaInput = (
        data: string | null | undefined,
      ): string => {
        if (!data) return "";
        try {
          // Se a data já está no formato correto (YYYY-MM-DD), retorna ela mesma
          if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;
          // Se tem timestamp, pega só a parte da data
          return data.split("T")[0];
        } catch {
          return "";
        }
      };

      setFormData({
        titulo: melhoria.titulo || "",
        descricao: melhoria.descricao || "",
        status: melhoria.status,
        prioridade: melhoria.prioridade,
        categoria: melhoria.categoria || "",
        custo_estimado: melhoria.custoEstimado?.toString() || "",
        responsavel: melhoria.responsavel || "",
        data_inicio: formatarDataParaInput(melhoria.dataInicio),
        data_fim_prevista: formatarDataParaInput(melhoria.dataFimPrevista),
        observacoes: melhoria.observacoes || "",
      });
    } else {
      setEditingMelhoria(null);
      setFormData({
        titulo: "",
        descricao: "",
        status: "planejada",
        prioridade: "media",
        categoria: "",
        custo_estimado: "",
        responsavel: "",
        data_inicio: "",
        data_fim_prevista: "",
        observacoes: "",
      });
    }
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditingMelhoria(null);
  };

  const abrirSugestaoModal = (sugestao?: Sugestao) => {
    if (sugestao) {
      setEditingSugestao(sugestao);
      setSugestaoFormData({
        titulo: sugestao.titulo,
        descricao: sugestao.descricao,
        categoria: sugestao.categoria,
        observacoes: sugestao.observacoes || "",
      });
    } else {
      setEditingSugestao(null);
      setSugestaoFormData({
        titulo: "",
        descricao: "",
        categoria: "",
        observacoes: "",
      });
    }
    setShowSugestaoModal(true);
  };

  const fecharSugestaoModal = () => {
    setShowSugestaoModal(false);
    setEditingSugestao(null);
  };

  const atualizarStatus = async (melhoria: Melhoria, novoStatus: string) => {
    try {
      await API.melhorias.update(melhoria.id, {
        ...melhoria,
        status: novoStatus,
      });
      await mutateMelhorias();
    } catch (err) {
      alert("Erro ao atualizar status da melhoria.");
    }
  };

  const atualizarPrioridade = async (
    melhoria: Melhoria,
    novaPrioridade: string,
  ) => {
    try {
      await API.melhorias.update(melhoria.id, {
        ...melhoria,
        prioridade: novaPrioridade,
      });
      await mutateMelhorias();
    } catch (err) {
      alert("Erro ao atualizar prioridade da melhoria.");
    }
  };

  return {
    showModal,
    showSugestaoModal,
    editingMelhoria,
    editingSugestao,
    formData,
    setFormData,
    sugestaoFormData,
    setSugestaoFormData,
    salvarMelhoria,
    deletarMelhoria,
    salvarSugestao,
    deletarSugestao,
    transformarEmMelhoria,
    abrirModal,
    fecharModal,
    abrirSugestaoModal,
    fecharSugestaoModal,
    atualizarStatus,
    atualizarPrioridade,
  };
}

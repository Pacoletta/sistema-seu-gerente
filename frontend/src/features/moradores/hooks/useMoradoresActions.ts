"use client";

import { useState } from "react";
import { API } from "@/services/api";
import type { Morador } from "@/features/moradores/types";

export function useMoradoresActions(
  moradores: Morador[],
  mutate: () => Promise<any>,
  userId: string | null,
) {
  const [aviso, setAviso] = useState<string>("");

  async function handleCreate(morador: Morador) {
    setAviso("");
    try {
      // Verificação de duplicidade antes de inserir
      const apartamentosExistentes = await API.moradores.list(userId!);
      const moradorExistente = apartamentosExistentes?.find(
        (apt: any) => Number(apt.numero) === Number(morador.numero),
      );
      if (moradorExistente) {
        setAviso("Já existe um apartamento com esse número no banco de dados!");
        return false;
      }
      const { id, ...moradorSemId } = morador;
      await API.moradores.create({ ...moradorSemId, usuario_id: userId });
      await mutate();
      return true;
    } catch (error) {
      setAviso("Erro ao cadastrar morador. Tente novamente.");
      return false;
    }
  }

  async function handleUpdate(id: string, morador: Morador, editIndex: number) {
    setAviso("");
    // Verifica duplicidade de número de apartamento
    const existe = moradores.some(
      (m, i) => i !== editIndex && Number(m.numero) === Number(morador.numero),
    );
    if (existe) {
      setAviso("Já existe um apartamento com esse número!");
      return false;
    }

    try {
      await API.moradores.update(id, morador);
      await mutate();
      return true;
    } catch (error) {
      setAviso("Erro ao atualizar morador. Tente novamente.");
      return false;
    }
  }

  async function handleDelete(index: number) {
    const id = moradores[index].id;
    try {
      // Backend agora trata a deleção de valores totais relacionados
      await API.moradores.delete(id);
      await mutate();
    } catch (error) {
      console.error("Erro ao remover morador:", error);
    }
  }

  async function limparDuplicados() {
    if (!userId) return;
    try {
      const todosMoradores = await API.moradores.list(userId);
      if (!todosMoradores || todosMoradores.length === 0) return;

      const numerosVistos = new Set();
      const duplicados = [];

      for (const morador of todosMoradores) {
        if (numerosVistos.has(morador.numero)) {
          duplicados.push(morador.id);
        } else {
          numerosVistos.add(morador.numero);
        }
      }

      if (duplicados.length > 0) {
        for (const id of duplicados) {
          // Backend agora trata a deleção de valores totais relacionados
          await API.moradores.delete(id);
        }
        await mutate();
        setAviso(
          `${duplicados.length} apartamento(s) duplicado(s) removido(s)!`,
        );
      }
    } catch (error) {
      setAviso("Erro ao limpar duplicados. Tente novamente.");
    }
  }

  return {
    aviso,
    setAviso,
    handleCreate,
    handleUpdate,
    handleDelete,
    limparDuplicados,
  };
}

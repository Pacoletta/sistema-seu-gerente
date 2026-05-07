"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMoradoresData } from "@/features/moradores/hooks/useMoradoresData";
import { useMoradoresActions } from "@/features/moradores/hooks/useMoradoresActions";
import { MoradoresMainView } from "@/features/moradores/components/MoradoresMainView";
import { useEffect } from "react";

export default function Moradores() {
  const { userId, userEmail, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("🔍 Moradores Page - useAuth retornou:", {
      userId,
      userEmail,
      isLoading,
      isAuthenticated,
    });
  }, [userId, userEmail, isLoading, isAuthenticated]);

  const { moradores, mutate } = useMoradoresData(userId, userEmail);

  const { aviso, setAviso, handleCreate, handleUpdate, handleDelete } =
    useMoradoresActions(moradores, mutate, userId);

  return (
    <MoradoresMainView
      moradores={moradores}
      aviso={aviso}
      setAviso={setAviso}
      onEdit={() => {}}
      onRemove={handleDelete}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
    />
  );
}

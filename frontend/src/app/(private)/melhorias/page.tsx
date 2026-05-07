"use client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { MelhoriasMainView } from "@/features/melhorias/components/MelhoriasMainView";

export default function Melhorias() {
  const { userId, isLoading: isLoadingAuth } = useAuth();

  return <MelhoriasMainView userId={userId} isLoadingAuth={isLoadingAuth} />;
}

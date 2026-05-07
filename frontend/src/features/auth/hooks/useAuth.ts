"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

// Re-exporta useCurrentUser com a interface original de useAuth
// para não precisar alterar todos os componentes que já usam useAuth
export function useAuth() {
  const { userId, userEmail, isLoading, isAuthenticated, error } =
    useCurrentUser();

  return { userId, userEmail, isLoading, isAuthenticated, error };
}

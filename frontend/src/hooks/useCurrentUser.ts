"use client";

import useSWR from "swr";
import { API } from "@/services/api";

const USER_CACHE_KEY = "auth/me";

async function fetchCurrentUser() {
  const session = await API.auth.getSession();
  if (!session) return null;

  const data = await API.auth.me();
  if (data.success && data.user) return data.user;
  return null;
}

export function useCurrentUser() {
  const { data: user, isLoading, error, mutate } = useSWR(USER_CACHE_KEY, fetchCurrentUser, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
    revalidateOnMount: true,
  });

  return {
    user,
    userId: user?.id as string | undefined,
    userEmail: user?.email as string | undefined,
    isLoading,
    isAuthenticated: !!user,
    error,
    mutate,
  };
}

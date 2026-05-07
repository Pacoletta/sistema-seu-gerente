"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/services/api";

function NovaSenhaInner() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Apenas para garantir que o formulário só aparece após leitura dos tokens
    setSessionReady(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");

    if (!access_token) {
      setMessage(
        "Link inválido ou expirado. Solicite uma nova redefinição de senha.",
      );
      setLoading(false);
      return;
    }

    try {
      const result = await API.auth.resetPassword(password);

      setMessage("Senha redefinida com sucesso! Faça login.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <div className="max-w-md sm:max-w-xs w-full mx-auto mt-10 p-4 sm:p-6 bg-white rounded shadow text-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md sm:max-w-xs w-full mx-auto mt-10 p-4 sm:p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Defina sua nova senha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default function NovaSenha() {
  return (
    <Suspense>
      <NovaSenhaInner />
    </Suspense>
  );
}

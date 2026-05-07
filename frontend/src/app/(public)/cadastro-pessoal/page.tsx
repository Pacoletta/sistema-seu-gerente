"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaArrowLeft,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

export default function CadastroPessoal() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { API } = await import("@/services/api");

      // 1. Criar usuário e cliente pessoal via API backend
      const result = await API.auth.register(
        formData.email,
        formData.senha,
        formData.nome,
      );

      if (!result?.success) {
        setErro("Erro ao completar cadastro. Tente novamente.");
        setLoading(false);
        return;
      }

      // Sucesso!
      setSucesso(true);
      setTimeout(() => {
        router.push("/login-pessoal");
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErro("Erro ao processar cadastro. Tente novamente.");
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cadastro realizado com sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Verifique seu email para confirmar o cadastro.
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Voltar para home
        </Link>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-green-600 to-emerald-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaMoneyBillWave className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Criar Conta Pessoal
            </h1>
            <p className="text-green-100">
              Comece a organizar suas finanças hoje
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone/WhatsApp
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {erro}
                </div>
              )}

              {/* Botão Cadastrar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando conta..." : "Criar Conta Gratuita"}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  href="/login-pessoal"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Faça login
                </Link>
              </div>
            </div>

            {/* Divisor */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500 mb-3">
                Precisa gerenciar um condomínio?
              </p>
              <Link href="/login">
                <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300">
                  Acessar Sistema de Condomínio
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" className="text-green-600 hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-green-600 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}

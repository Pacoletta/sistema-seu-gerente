"use client";
import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/services/api";

const LOGO_URL = "/logo-seugerente.png";

function CadastroForm() {
  // Estados dos formulários - todos juntos para envio único
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeCondominio, setNomeCondominio] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [quantidadeApartamentos, setQuantidadeApartamentos] = useState("");
  const [indicacao, setIndicacao] = useState<string | null>(null);

  // Estados de controle
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [cnpjCpfValido, setCnpjCpfValido] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Capturar código de indicação da URL ou localStorage
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      console.log("📋 Código de indicação capturado da URL:", ref);
      setIndicacao(ref);
      localStorage.setItem("indicacao_ref", ref);
    } else {
      // Verificar se há código salvo no localStorage (da landing page)
      const savedRef = localStorage.getItem("indicacao_ref");
      if (savedRef) {
        console.log(
          "📋 Código de indicação recuperado do localStorage:",
          savedRef,
        );
        setIndicacao(savedRef);
      }
    }
  }, [searchParams]);

  // Função para validar CNPJ/CPF
  const validarCnpjCpf = (documento: string): boolean => {
    const numeros = documento.replace(/\D/g, "");

    // Valida CNPJ (14 dígitos)
    if (numeros.length === 14) {
      return validarCNPJ(numeros);
    }

    // Valida CPF (11 dígitos)
    if (numeros.length === 11) {
      return validarCPF(numeros);
    }

    return false;
  };

  const validarCPF = (cpf: string): boolean => {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto >= 10 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto >= 10 ? 0 : resto;

    return parseInt(cpf.charAt(9)) === dv1 && parseInt(cpf.charAt(10)) === dv2;
  };

  const validarCNPJ = (cnpj: string): boolean => {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const calcularDigito = (cnpj: string, posicoes: number[]): number => {
      let soma = 0;
      for (let i = 0; i < posicoes.length; i++) {
        soma += parseInt(cnpj.charAt(i)) * posicoes[i];
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const pos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const dv1 = calcularDigito(cnpj, pos1);
    const dv2 = calcularDigito(cnpj, pos2);

    return (
      parseInt(cnpj.charAt(12)) === dv1 && parseInt(cnpj.charAt(13)) === dv2
    );
  };

  // Função para formatar CNPJ/CPF com máscara
  const formatarCnpjCpf = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "").substring(0, 14);

    if (numeros.length <= 11) {
      // Formato CPF: 000.000.000-00
      if (numeros.length <= 3) return numeros;
      if (numeros.length <= 6) return numeros.replace(/(\d{3})/, "$1.");
      if (numeros.length <= 9)
        return numeros.replace(/(\d{3})(\d{3})/, "$1.$2.");
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else {
      // Formato CNPJ: 00.000.000/0000-00
      if (numeros.length <= 2) return numeros;
      if (numeros.length <= 5) return numeros.replace(/(\d{2})/, "$1.");
      if (numeros.length <= 8)
        return numeros.replace(/(\d{2})(\d{3})/, "$1.$2.");
      if (numeros.length <= 12)
        return numeros.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3/");
      return numeros.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
        "$1.$2.$3/$4-$5",
      );
    }
  };

  // Função para formatar telefone
  const formatarTelefone = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "").substring(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 6)
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2)}`;
    if (numeros.length <= 10) {
      // Formato: (00) 0000-0000
      return `(${numeros.substring(0, 2)}) ${numeros.substring(
        2,
        6,
      )}-${numeros.substring(6)}`;
    } else {
      // Formato: (00) 00000-0000
      return `(${numeros.substring(0, 2)}) ${numeros.substring(
        2,
        7,
      )}-${numeros.substring(7)}`;
    }
  };

  // Função de validação completa antes do envio
  const validarTodosOsCampos = (): string | null => {
    // 1. Validar campos obrigatórios
    if (!nomeCompleto?.trim()) return "Nome completo é obrigatório";
    if (!email?.trim()) return "E-mail é obrigatório";
    if (!password?.trim()) return "Senha é obrigatória";
    if (!nomeCondominio?.trim()) return "Nome do condomínio é obrigatório";
    if (!cnpjCpf?.trim()) return "CNPJ/CPF é obrigatório";
    if (!telefone?.trim()) return "Telefone é obrigatório";
    if (!quantidadeApartamentos?.trim())
      return "Quantidade de apartamentos é obrigatória";

    // 2. Validar formato do email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return "Formato de e-mail inválido. Use: exemplo@dominio.com";
    }

    // 3. Validar senha forte (requisitos do Supabase Auth)
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (password.length > 100)
      return "Senha não pode ter mais de 100 caracteres";

    // Validar presença de letra minúscula
    if (!/[a-z]/.test(password))
      return "Senha deve conter pelo menos 1 letra minúscula";

    // Validar presença de letra maiúscula
    if (!/[A-Z]/.test(password))
      return "Senha deve conter pelo menos 1 letra MAIÚSCULA";

    // Validar presença de número
    if (!/[0-9]/.test(password)) return "Senha deve conter pelo menos 1 número";

    // Validar presença de caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\|<>?,.\/`~]/.test(password))
      return "Senha deve conter pelo menos 1 caractere especial (!@#$%^&* etc)";

    // 4. Validar nome completo
    const nomePartes = nomeCompleto.trim().split(/\s+/);
    if (nomePartes.length < 2) return "Informe nome e sobrenome";
    if (nomePartes.some((parte) => parte.length < 2))
      return "Nome e sobrenome devem ter pelo menos 2 caracteres cada";
    if (nomeCompleto.trim().length < 5) return "Nome completo muito curto";
    if (nomeCompleto.trim().length > 100) return "Nome completo muito longo";

    // 5. Validar CNPJ/CPF obrigatoriamente
    if (!validarCnpjCpf(cnpjCpf)) {
      const numeros = cnpjCpf.replace(/\D/g, "");
      if (numeros.length === 11)
        return "CPF inválido. Verifique os números digitados";
      if (numeros.length === 14)
        return "CNPJ inválido. Verifique os números digitados";
      return "CNPJ/CPF deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)";
    }

    // 6. Validar telefone
    const numerosTelefone = telefone.replace(/\D/g, "");
    if (numerosTelefone.length < 10)
      return "Telefone deve ter pelo menos 10 dígitos";
    if (numerosTelefone.length > 11)
      return "Telefone deve ter no máximo 11 dígitos";
    if (
      !numerosTelefone.startsWith("1") &&
      !numerosTelefone.startsWith("2") &&
      !numerosTelefone.startsWith("3") &&
      !numerosTelefone.startsWith("4") &&
      !numerosTelefone.startsWith("5") &&
      !numerosTelefone.startsWith("6") &&
      !numerosTelefone.startsWith("7") &&
      !numerosTelefone.startsWith("8") &&
      !numerosTelefone.startsWith("9")
    ) {
      return "Telefone deve começar com DDD válido (11-99)";
    }

    // 7. Validar nome do condomínio
    if (nomeCondominio.trim().length < 5)
      return "Nome do condomínio muito curto (mínimo 5 caracteres)";
    if (nomeCondominio.trim().length > 100)
      return "Nome do condomínio muito longo (máximo 100 caracteres)";

    // 8. Validar quantidade de apartamentos
    const quantidade = parseInt(quantidadeApartamentos);
    if (isNaN(quantidade))
      return "Quantidade de apartamentos deve ser um número";
    if (quantidade < 1) return "Deve ter pelo menos 1 apartamento";
    if (quantidade > 10000) return "Máximo de 10.000 apartamentos permitido";

    return null; // Todas as validações passaram
  };

  // Validar Etapa 1 - Dados Pessoais
  const validarEtapa1 = (): string | null => {
    if (!nomeCompleto?.trim()) return "Nome completo é obrigatório";
    if (!email?.trim()) return "E-mail é obrigatório";
    if (!password?.trim()) return "Senha é obrigatória";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return "Formato de e-mail inválido";
    }

    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (!/[a-z]/.test(password))
      return "Senha deve conter pelo menos 1 letra minúscula";
    if (!/[A-Z]/.test(password))
      return "Senha deve conter pelo menos 1 letra MAIÚSCULA";
    if (!/[0-9]/.test(password)) return "Senha deve conter pelo menos 1 número";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\|<>?,.\/`~]/.test(password))
      return "Senha deve conter pelo menos 1 caractere especial";

    const nomePartes = nomeCompleto.trim().split(/\s+/);
    if (nomePartes.length < 2) return "Informe nome e sobrenome";

    return null;
  };

  // Validar Etapa 2 - Dados do Condomínio
  const validarEtapa2 = (): string | null => {
    if (!nomeCondominio?.trim()) return "Nome do condomínio é obrigatório";
    if (!cnpjCpf?.trim()) return "CNPJ/CPF é obrigatório";
    if (!telefone?.trim()) return "Telefone é obrigatório";
    if (!quantidadeApartamentos?.trim())
      return "Quantidade de apartamentos é obrigatória";

    if (!validarCnpjCpf(cnpjCpf)) return "CNPJ/CPF inválido";

    const numerosTelefone = telefone.replace(/\D/g, "");
    if (numerosTelefone.length < 10)
      return "Telefone deve ter pelo menos 10 dígitos";

    const quantidade = parseInt(quantidadeApartamentos);
    if (isNaN(quantidade) || quantidade < 1)
      return "Quantidade de apartamentos inválida";

    return null;
  };

  // Avançar para próxima etapa
  const handleNextStep = () => {
    setError("");

    if (currentStep === 1) {
      const erro = validarEtapa1();
      if (erro) {
        setError(erro);
        return;
      }
      setCurrentStep(2);
    }
  };

  // Voltar para etapa anterior
  const handlePrevStep = () => {
    setError("");
    setCurrentStep(1);
  };

  // Função principal: Cadastro completo com validações rigorosas
  async function handleCadastroCompleto(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 🔍 ETAPA 1: Validações completas e rigorosas
      console.log("🔍 Iniciando validações...");
      setLoadingMessage("Validando informações...");

      const erroValidacao = validarTodosOsCampos();
      if (erroValidacao) {
        setError(erroValidacao);
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      // 🔍 ETAPA 2: Validação final do CNPJ/CPF em tempo real
      setLoadingMessage("Verificando CNPJ/CPF...");

      if (!validarCnpjCpf(cnpjCpf)) {
        setError("CNPJ/CPF inválido. Verifique os números antes de continuar.");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      // 📦 ETAPA 3: Preparar dados limpos para envio
      console.log("📦 Preparando dados para envio...");
      setLoadingMessage("Criando sua conta...");

      // 🔐 ETAPA 4: Criar usuário no Supabase Auth
      console.log("🔍 Criando usuário no Supabase Auth...");
      setLoadingMessage("Criando autenticação...");

      try {
        const authResponse = await API.auth.register(
          email.trim().toLowerCase(),
          password.trim(),
          nomeCompleto.trim(),
        );

        console.log("✅ Usuário criado no Supabase Auth:", authResponse);
        setLoadingMessage("Salvando informações...");

        // 🌐 ETAPA 5: Salvar dados adicionais no backend
        console.log("🌐 Salvando dados no backend...");

        const dadosComplementares = {
          user_id: authResponse.data.user!.id, // ✅ ID do Supabase Auth
          nome: nomeCompleto.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: telefone.replace(/\D/g, ""),
          nome_condominio: nomeCondominio.trim(),
          cnpj_cpf: cnpjCpf.replace(/\D/g, ""),
          quantidade_apartamentos: parseInt(quantidadeApartamentos),
          indicacao: indicacao, // Código do parceiro que indicou
        };

        console.log("📤 Enviando user_id:", dadosComplementares.user_id);
        if (indicacao) {
          console.log("📋 Cadastro com indicação do parceiro:", indicacao);
        }

        const backendResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cadastro`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosComplementares),
          },
        );

        console.log("📡 Status do backend:", backendResponse.status);

        if (!backendResponse.ok) {
          const errorText = await backendResponse.text();
          console.error("❌ Resposta do backend:", errorText);

          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText };
          }

          console.error("❌ Erro do backend (JSON):", errorData);
          throw new Error(
            errorData.error ||
              errorData.title ||
              errorData.errors?.UserId?.[0] ||
              "Erro ao salvar dados complementares",
          );
        }

        console.log("✅ Dados salvos no backend");

        // 📋 ETAPA 6: Sucesso!
        console.log("🎉 Cadastro completo com sucesso!");
        setSuccess("✅ Conta criada com sucesso! Redirecionando...");
        setLoadingMessage("Redirecionando...");

        // Aguardar 2 segundos para mostrar mensagem de sucesso
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (authError: any) {
        console.error("❌ Erro no cadastro:", authError);

        let errorMessage = "Erro ao criar conta. Tente novamente.";

        if (
          authError.message?.includes("already registered") ||
          authError.message?.includes("User already registered")
        ) {
          errorMessage =
            "📧 Este e-mail já está cadastrado. Tente fazer login.";
        } else if (authError.message?.includes("Password")) {
          errorMessage = "🔐 A senha deve ter pelo menos 6 caracteres.";
        } else if (authError.message) {
          errorMessage = authError.message;
        }

        setError(errorMessage);
        setLoading(false);
        setLoadingMessage("");
        return;
      }
    } catch (err: any) {
      console.error("💥 Erro no cadastro:", err);

      let errorMessage = "❌ Erro inesperado. Tente novamente.";

      // Tratar erros específicos
      if (err.name === "AbortError") {
        errorMessage =
          "⏱️ Tempo esgotado. Verifique sua conexão com a internet e tente novamente.";
      } else if (err.message) {
        // Se a mensagem já tem emoji, não adicionar
        if (!err.message.match(/^[\u{1F300}-\u{1F9FF}]/u)) {
          errorMessage = `❌ ${err.message}`;
        } else {
          errorMessage = err.message;
        }
      } else if (err.toString().toLowerCase().includes("network")) {
        errorMessage =
          "🌐 Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (err.toString().toLowerCase().includes("timeout")) {
        errorMessage = "⏱️ Tempo esgotado. Tente novamente.";
      }

      setError(errorMessage);
      setLoading(false);
      setLoadingMessage("");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Elementos de fundo animados - Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Elementos de fundo animados - Gradientes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        {/* Botão Voltar */}
        <div className="absolute top-6 left-6 z-30">
          <a
            href="/login"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl text-white/90 hover:text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar
          </a>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/3 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <img
                  src={LOGO_URL}
                  alt="Seu Gerente"
                  className="w-12 h-12 rounded-xl border border-blue-400/30"
                />
                <div className="text-left">
                  <h1 className="text-xl font-bold text-white">Criar Conta</h1>
                  <p className="text-sm text-slate-400">Seu Gerente</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Preencha os dados para começar gratuitamente
              </p>
            </div>

            {/* Indicador de Progresso */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">
                  Etapa {currentStep} de 2
                </span>
                <span className="text-xs text-slate-400">
                  {currentStep === 1 ? "Dados Pessoais" : "Dados do Condomínio"}
                </span>
              </div>
              <div className="flex gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? "bg-blue-500" : "bg-white/10"}`}
                ></div>
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-blue-500" : "bg-white/10"}`}
                ></div>
              </div>
            </div>

            {/* ETAPA 1 - Dados Pessoais */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="João Silva"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/10"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className={`w-full pl-12 pr-10 py-3.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:bg-white/10 ${
                          email &&
                          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                            email,
                          )
                            ? "border-red-500/50 focus:ring-red-500"
                            : email &&
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                  email,
                                )
                              ? "border-emerald-500/50 focus:ring-emerald-500"
                              : "border-white/10 focus:ring-blue-500"
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                            email,
                          ) ? (
                            <svg
                              className="w-5 h-5 text-emerald-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-red-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha@123"
                        className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:bg-white/10 ${
                          password &&
                          (password.length < 6 ||
                            !/[a-z]/.test(password) ||
                            !/[A-Z]/.test(password) ||
                            !/[0-9]/.test(password) ||
                            !/[!@#$%^&*()_+\-=\[\]{};':"\|<>?,.\/\`~]/.test(
                              password,
                            ))
                            ? "border-red-500/50 focus:ring-red-500"
                            : password.length >= 6 &&
                                /[a-z]/.test(password) &&
                                /[A-Z]/.test(password) &&
                                /[0-9]/.test(password) &&
                                /[!@#$%^&*()_+\-=\[\]{};':"\|<>?,.\/\`~]/.test(
                                  password,
                                )
                              ? "border-emerald-500/50 focus:ring-emerald-500"
                              : "border-white/10 focus:ring-blue-500"
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors z-10"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-#1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                        <span
                          className={`flex items-center gap-1 ${password.length >= 6 ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {password.length >= 6 ? "✓" : "○"} 6+ chars
                        </span>
                        <span
                          className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {/[a-z]/.test(password) ? "✓" : "○"} minúscula
                        </span>
                        <span
                          className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {/[A-Z]/.test(password) ? "✓" : "○"} MAIÚSCULA
                        </span>
                        <span
                          className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {/[0-9]/.test(password) ? "✓" : "○"} número
                        </span>
                        <span
                          className={`flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\|<>?,.\/\`~]/.test(password) ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {/[!@#$%^&*()_+\-=\[\]{};':"\|<>?,.\/\`~]/.test(
                            password,
                          )
                            ? "✓"
                            : "○"}{" "}
                          especial
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3">
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  className="group w-full px-6 py-4 font-semibold text-base rounded-xl bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Próximo
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            )}

            {/* ETAPA 2 - Dados do Condomínio */}
            {currentStep === 2 && (
              <form onSubmit={handleCadastroCompleto} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-400/20 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h5m-5-4h5"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Dados do Condomínio
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Nome do Condomínio
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Residencial Bella Vista"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white/10"
                        value={nomeCondominio}
                        onChange={(e) => setNomeCondominio(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        CNPJ/CPF
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={cnpjCpf}
                          onChange={(e) => {
                            const formatted = formatarCnpjCpf(e.target.value);
                            setCnpjCpf(formatted);
                            const numeros = formatted.replace(/\D/g, "");
                            if (
                              numeros.length === 11 ||
                              numeros.length === 14
                            ) {
                              setCnpjCpfValido(validarCnpjCpf(formatted));
                            } else {
                              setCnpjCpfValido(null);
                            }
                          }}
                          placeholder="00.000.000/0000-00"
                          className={`w-full pl-12 pr-10 py-3.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:bg-white/10 ${
                            cnpjCpfValido === false
                              ? "border-red-500/50 focus:ring-red-500"
                              : cnpjCpfValido === true
                                ? "border-emerald-500/50 focus:ring-emerald-500"
                                : "border-white/10 focus:ring-emerald-500"
                          }`}
                          maxLength={18}
                          required
                        />
                        {cnpjCpfValido !== null && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {cnpjCpfValido ? (
                              <svg
                                className="w-5 h-5 text-emerald-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                      {cnpjCpfValido === false && (
                        <p className="text-red-400 text-xs mt-1">
                          CNPJ/CPF inválido
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        Telefone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white/10"
                          value={telefone}
                          onChange={(e) => {
                            const formatted = formatarTelefone(e.target.value);
                            setTelefone(formatted);
                          }}
                          maxLength={15}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Quantidade de Apartamentos
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                          />
                        </svg>
                      </div>
                      <input
                        type="number"
                        placeholder="120"
                        min="1"
                        max="10000"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white/10"
                        value={quantidadeApartamentos}
                        onChange={(e) =>
                          setQuantidadeApartamentos(e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3 backdrop-blur-xl">
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3 backdrop-blur-xl">
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/3 px-6 py-4 font-semibold text-base rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Voltar
                    </span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-2/3 px-6 py-4 font-semibold text-base rounded-xl transition-all duration-300 transform overflow-hidden ${
                      loading
                        ? "bg-linear-to-r from-slate-700 to-slate-600 cursor-wait"
                        : "bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-0.5 active:translate-y-0"
                    } text-white disabled:transform-none`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span className="min-w-0 text-center">
                            {loadingMessage || "Processando..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Criar Conta
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
            </div>

            {/* Link de Login */}
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-3">Já tem uma conta?</p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Fazer login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-white">Carregando...</div>
        </div>
      }
    >
      <CadastroForm />
    </Suspense>
  );
}

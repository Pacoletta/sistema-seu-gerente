"use client";

import React from "react";
import HomeHeader from "@/components/layout/header/home-header";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaDatabase,
  FaCookie,
} from "react-icons/fa";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <HomeHeader />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-bold mb-6">
            <FaShieldAlt className="w-5 h-5" />
            Política de Privacidade
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Sua privacidade é nossa prioridade
          </h1>
          <p className="text-xl text-gray-600">
            Última atualização: 22 de fevereiro de 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introdução */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaUserShield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                1. Introdução
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              O Sistema Seu Gerente está comprometido em proteger a privacidade
              e os dados pessoais de nossos usuários. Esta Política de
              Privacidade descreve como coletamos, usamos, armazenamos e
              protegemos suas informações quando você utiliza nossa plataforma
              de gestão condominial.
            </p>
          </section>

          {/* Coleta de Dados */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaDatabase className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                2. Dados Coletados
              </h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2.1. Informações Pessoais
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Coletamos as seguintes informações pessoais quando você se
                cadastra e utiliza nosso sistema:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Telefone de contato</li>
                <li>CNPJ do condomínio</li>
                <li>Endereço do condomínio</li>
                <li>Dados de moradores (conforme cadastrado)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2.2. Dados de Uso
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Também coletamos informações sobre como você utiliza nossa
                plataforma:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Logs de acesso e navegação</li>
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de utilização</li>
                <li>Interações com funcionalidades do sistema</li>
              </ul>
            </div>
          </section>

          {/* Uso dos Dados */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaLock className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                3. Uso das Informações
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos seus dados pessoais para:
            </p>
            <div className="grid gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                <p className="text-gray-800 font-semibold mb-1">
                  ✓ Fornecimento do Serviço
                </p>
                <p className="text-gray-600 text-sm">
                  Processar registros, gerenciar contas e fornecer
                  funcionalidades da plataforma
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                <p className="text-gray-800 font-semibold mb-1">
                  ✓ Comunicação
                </p>
                <p className="text-gray-600 text-sm">
                  Enviar notificações importantes, atualizações e suporte
                  técnico
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                <p className="text-gray-800 font-semibold mb-1">✓ Melhorias</p>
                <p className="text-gray-600 text-sm">
                  Analisar o uso da plataforma para aprimorar nossos serviços
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                <p className="text-gray-800 font-semibold mb-1">✓ Segurança</p>
                <p className="text-gray-600 text-sm">
                  Prevenir fraudes e garantir a segurança da plataforma
                </p>
              </div>
            </div>
          </section>

          {/* Compartilhamento */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Não vendemos seus dados pessoais.</strong> Podemos
              compartilhar informações apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Com provedores de serviços terceiros essenciais para operação da
                plataforma (hospedagem, processamento de pagamentos)
              </li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>
                Para proteção de direitos, propriedade ou segurança nossa ou de
                terceiros
              </li>
              <li>Com seu consentimento explícito</li>
            </ul>
          </section>

          {/* Segurança */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              5. Segurança dos Dados
            </h2>
            <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <p className="text-gray-800 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais de segurança
                para proteger seus dados:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaLock className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Criptografia SSL/TLS
                    </p>
                    <p className="text-sm text-gray-600">
                      Todos os dados em trânsito são criptografados
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaDatabase className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Backups Automáticos
                    </p>
                    <p className="text-sm text-gray-600">
                      Cópias de segurança regulares dos dados
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Controle de Acesso
                    </p>
                    <p className="text-sm text-gray-600">
                      Autenticação e autorização rigorosas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUserShield className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Conformidade LGPD
                    </p>
                    <p className="text-sm text-gray-600">
                      Seguimos a Lei Geral de Proteção de Dados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaCookie className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                6. Cookies
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar sua
              experiência, manter sua sessão ativa e analisar o uso da
              plataforma. Você pode configurar seu navegador para recusar
              cookies, mas isso pode afetar algumas funcionalidades do sistema.
            </p>
          </section>

          {/* Direitos do Usuário */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              7. Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              De acordo com a LGPD, você tem os seguintes direitos:
            </p>
            <div className="grid gap-3">
              {[
                "Acesso aos seus dados pessoais",
                "Correção de dados incompletos ou desatualizados",
                "Anonimização, bloqueio ou eliminação de dados",
                "Portabilidade de dados a outro fornecedor",
                "Revogação do consentimento",
                "Informação sobre compartilhamento de dados",
              ].map((direito, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <span className="text-gray-700">{direito}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contato */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              8. Contato
            </h2>
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <p className="text-lg mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta
                política, entre em contato:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>E-mail:</strong> privacidade@sistemaseugerente.com.br
                </p>
                <p>
                  <strong>Telefone:</strong> +55 (31) 98362-5590
                </p>
                <p>
                  <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
                </p>
              </div>
            </div>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              9. Alterações nesta Política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente.
              Notificaremos você sobre mudanças significativas por e-mail ou
              através de um aviso no sistema. Recomendamos que revise esta
              página regularmente para se manter informado sobre como protegemos
              suas informações.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import HomeHeader from "@/components/layout/header/home-header";
import {
  FaFileContract,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaBalanceScale,
} from "react-icons/fa";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <HomeHeader />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-bold mb-6">
            <FaFileContract className="w-5 h-5" />
            Termos de Uso
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Termos e Condições de Uso
          </h1>
          <p className="text-xl text-gray-600">
            Última atualização: 22 de fevereiro de 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Aceitação */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                1. Aceitação dos Termos
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e utilizar o Sistema Seu Gerente, você concorda em
              cumprir e estar vinculado aos seguintes Termos de Uso. Se você não
              concorda com estes termos, não utilize nossa plataforma.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mt-4">
              <p className="text-gray-800 m-0">
                <strong>Importante:</strong> Estes termos constituem um acordo
                legal entre você e o Sistema Seu Gerente.
              </p>
            </div>
          </section>

          {/* Definições */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              2. Definições
            </h2>
            <div className="grid gap-3">
              {[
                {
                  termo: "Plataforma",
                  definicao:
                    "Sistema Seu Gerente, incluindo website, aplicações e serviços relacionados",
                },
                {
                  termo: "Usuário",
                  definicao:
                    "Síndico, administrador ou pessoa autorizada que utiliza a plataforma",
                },
                {
                  termo: "Condomínio",
                  definicao: "Entidade representada pelo usuário no sistema",
                },
                {
                  termo: "Dados",
                  definicao:
                    "Informações inseridas, processadas ou armazenadas na plataforma",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-bold text-gray-900 mb-1">{item.termo}</p>
                  <p className="text-gray-600 text-sm">{item.definicao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Serviços */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3. Descrição dos Serviços
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O Sistema Seu Gerente fornece uma plataforma de gestão condominial
              que inclui:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Gestão financeira de receitas e despesas",
                "Cadastro e controle de moradores",
                "Envio de notificações e cobranças",
                "Geração de relatórios profissionais",
                "Dashboard com análises e gráficos",
                "Integração com WhatsApp",
                "Assistência com Inteligência Artificial",
                "Armazenamento seguro de documentos",
              ].map((servico, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span className="text-gray-700">{servico}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Cadastro e Conta */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4. Cadastro e Conta de Usuário
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  4.1. Elegibilidade
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Você deve ter no mínimo 18 anos e capacidade legal para
                  aceitar estes termos. Ao se cadastrar, você declara que as
                  informações fornecidas são verdadeiras e atualizadas.
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  4.2. Responsabilidades do Usuário
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Manter a confidencialidade de suas credenciais de acesso
                  </li>
                  <li>
                    Notificar imediatamente sobre uso não autorizado de sua
                    conta
                  </li>
                  <li>
                    Garantir que todas as informações fornecidas sejam precisas
                  </li>
                  <li>Não compartilhar sua conta com terceiros</li>
                  <li>Utilizar o sistema de forma legal e ética</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Uso Aceitável */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaBalanceScale className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                5. Uso Aceitável
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você concorda em <strong>NÃO</strong> utilizar a plataforma para:
            </p>
            <div className="grid gap-3">
              {[
                "Violar leis, regulamentos ou direitos de terceiros",
                "Transmitir vírus, malware ou código malicioso",
                "Fazer engenharia reversa ou tentar acessar código-fonte",
                "Coletar dados de outros usuários sem autorização",
                "Sobrecarregar ou interferir nos servidores da plataforma",
                "Criar contas falsas ou usar informações de terceiros",
                "Compartilhar conteúdo ilegal, ofensivo ou difamatório",
              ].map((proibicao, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <FaBan className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{proibicao}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Pagamento */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              6. Pagamento e Assinatura
            </h2>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.1. Planos e Preços
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Os planos e preços são definidos de acordo com o tamanho e
                necessidades do condomínio. Valores podem variar e estão
                sujeitos a alterações com aviso prévio.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.2. Faturamento
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  Pagamentos são processados mensalmente ou conforme acordado
                </li>
                <li>Aceitamos cartão de crédito, boleto e PIX</li>
                <li>Você receberá uma fatura antes de cada cobrança</li>
                <li>
                  Falhas no pagamento podem resultar em suspensão do serviço
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6.3. Cancelamento e Reembolso
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Você pode cancelar sua assinatura a qualquer momento. Não
                oferecemos reembolsos proporcionais para períodos já pagos, mas
                você manterá acesso até o final do período contratado.
              </p>
            </div>
          </section>

          {/* Propriedade Intelectual */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              7. Propriedade Intelectual
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Todo o conteúdo da plataforma, incluindo mas não se limitando a
                textos, gráficos, logos, ícones, imagens, código-fonte e
                software, é propriedade do Sistema Seu Gerente e protegido por
                leis de direitos autorais.
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="font-bold text-gray-900 mb-2">Seus Dados</p>
                <p className="text-gray-700">
                  Você mantém todos os direitos sobre os dados que insere na
                  plataforma. Concede-nos apenas uma licença limitada para
                  processar esses dados com o objetivo de fornecer os serviços.
                </p>
              </div>
            </div>
          </section>

          {/* Limitação de Responsabilidade */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 m-0">
                8. Limitação de Responsabilidade
              </h2>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>IMPORTANTE:</strong> O Sistema Seu Gerente é fornecido
                "como está". Não garantimos que o serviço será ininterrupto ou
                livre de erros.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Não nos responsabilizamos por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Perda de dados devido a falhas técnicas (embora façamos
                  backups regulares)
                </li>
                <li>Interrupções temporárias do serviço para manutenção</li>
                <li>
                  Decisões tomadas com base em relatórios ou análises do sistema
                </li>
                <li>Uso inadequado da plataforma por terceiros</li>
                <li>Danos indiretos, incidentais ou consequenciais</li>
              </ul>
            </div>
          </section>

          {/* Modificações */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              9. Modificações nos Termos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamos o direito de modificar estes Termos de Uso a qualquer
              momento. Notificaremos você sobre alterações significativas por
              e-mail ou através de um aviso na plataforma. O uso continuado após
              as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Rescisão */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              10. Rescisão
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Podemos suspender ou encerrar sua conta nos seguintes casos:
            </p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <FaBan className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    Violação dos Termos
                  </p>
                  <p className="text-sm text-gray-600">
                    Uso inadequado ou ilegal da plataforma
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <FaBan className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Inadimplência</p>
                  <p className="text-sm text-gray-600">
                    Falta de pagamento conforme acordado
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <FaBan className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    Solicitação do Usuário
                  </p>
                  <p className="text-sm text-gray-600">
                    Você pode cancelar sua conta a qualquer momento
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Lei Aplicável */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              11. Lei Aplicável e Jurisdição
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer
              disputa será resolvida nos tribunais da comarca de Belo Horizonte,
              Minas Gerais.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              12. Contato
            </h2>
            <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <p className="text-lg mb-4">
                Para dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>E-mail:</strong> contato@sistemaseugerente.com.br
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
        </div>
      </div>
    </div>
  );
}

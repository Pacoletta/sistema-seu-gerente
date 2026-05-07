"use client";

import React from "react";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaShieldAlt,
  FaHeadset,
  FaLock,
  FaRobot,
  FaChartLine,
  FaMoneyBillWave,
  FaBell,
  FaUsers,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

const features = [
  {
    icon: FaRobot,
    text: "Inteligência Artificial para suporte e automações",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: FaChartLine,
    text: "Relatórios completos e profissionais em PDF",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FaMoneyBillWave,
    text: "Gestão financeira completa com controle total",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: FaBell,
    text: "Envio automático de cobranças via WhatsApp",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: FaChartLine,
    text: "Dashboard inteligente com gráficos em tempo real",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: FaUsers,
    text: "Apartamentos ilimitados sem restrições",
    color: "from-blue-500 to-indigo-500",
  },
];

const benefits = [
  "✓ Gerente especializado dedicado",
  "✓ Suporte prioritário 24/7",
  "✓ Consultoria em gestão condominial",
  "✓ Gestão completa de cobrança",
];

export default function LandingPricing() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS || "5531983625590";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Gostaria de conhecer a solução completa de gestão condominial e solicitar uma proposta personalizada.`;

  return (
    <section
      id="planos"
      className="relative py-32 bg-linear-to-b from-white via-blue-50 to-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-sm mb-6 shadow-lg">
            <FaStar className="w-4 h-4" />
            Solução Premium
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Transforme a gestão do{" "}
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              seu condomínio
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tecnologia de ponta + Inteligência Artificial + Suporte
            especializado.
            <br />
            Tudo em um único sistema completo.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

            {/* Card Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header Section */}
              <div className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-12 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-size-[2rem_2rem]"></div>

                {/* Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-bl-3xl rounded-tr-3xl font-bold text-sm shadow-xl flex items-center gap-2">
                    <FaStar className="w-4 h-4" />
                    Mais Escolhido
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-4xl font-black mb-3">
                    Sistema Seu Gerente
                  </h3>
                  <p className="text-xl text-blue-100 mb-6">
                    Gestão completa e inteligente para o seu condomínio
                  </p>

                  {/* Quick Benefits */}
                  <div className="flex flex-wrap gap-3">
                    {benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="p-10">
                <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Recursos Inclusos
                </h4>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={idx}
                        className="group flex items-start gap-4 p-5 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium leading-tight">
                            {feature.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Section */}
                <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                  <div className="text-center mb-6">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      💰 Planos personalizados a partir de
                    </p>
                    <div className="text-5xl font-black bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      R$ 990
                    </div>
                    <p className="text-gray-600">
                      Valor ajustado ao tamanho do seu condomínio
                    </p>
                  </div>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-3 w-full py-6 px-8 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaWhatsapp className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    Solicitar Proposta Personalizada
                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <p className="text-center text-gray-600 text-sm mt-4">
                    💬 Resposta em até 30 minutos • Consultoria gratuita • Sem
                    compromisso
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Mais de <span className="text-blue-600">500+ condomínios</span> já
              transformaram sua gestão
            </p>
            <p className="text-gray-600">
              Junte-se aos síndicos que escolheram excelência
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="group flex items-center gap-4 px-8 py-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200">
              <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">
                  Pagamento Seguro
                </div>
                <div className="text-gray-600">Proteção total garantida</div>
              </div>
            </div>

            <div className="group flex items-center gap-4 px-8 py-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaHeadset className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">
                  Suporte Premium
                </div>
                <div className="text-gray-600">Disponível 24/7 para você</div>
              </div>
            </div>

            <div className="group flex items-center gap-4 px-8 py-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaLock className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">
                  Dados Protegidos
                </div>
                <div className="text-gray-600">Privacidade total LGPD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

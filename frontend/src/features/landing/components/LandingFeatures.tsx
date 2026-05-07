"use client";

import React from "react";
import {
  FaMoneyBillWave,
  FaUsers,
  FaWhatsapp,
  FaChartBar,
  FaFileInvoiceDollar,
  FaBell,
  FaRobot,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: FaMoneyBillWave,
    title: "Gestão Financeira",
    description:
      "Controle total de receitas e despesas com relatórios detalhados e automáticos.",
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: FaUsers,
    title: "Cadastro de Moradores",
    description:
      "Gerencie informações completas de todos os moradores em um só lugar.",
    gradient: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    icon: FaWhatsapp,
    title: "Integração WhatsApp",
    description:
      "Envie notificações e comunicados direto para o WhatsApp dos moradores.",
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    icon: FaChartBar,
    title: "Relatórios Inteligentes",
    description:
      "Dashboards com gráficos e análises para decisões estratégicas.",
    gradient: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Gestão de Receitas",
    description:
      "Controle completo de todas as receitas do condomínio com relatórios detalhados.",
    gradient: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: FaBell,
    title: "Notificações Automáticas",
    description:
      "Alertas em tempo real sobre pagamentos, vencimentos e eventos importantes.",
    gradient: "from-rose-500 to-pink-600",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600",
  },
  {
    icon: FaRobot,
    title: "Suporte ao Morador",
    description:
      "Assistente virtual para automatizar tarefas e responder dúvidas dos moradores.",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600",
  },
  {
    icon: FaShieldAlt,
    title: "Segurança Total",
    description:
      "Dados criptograf ados e backups automáticos para máxima proteção.",
    gradient: "from-orange-500 to-red-600",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="funcionalidades"
      className="py-24 bg-linear-to-b from-white via-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Tudo que você precisa em{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              um só lugar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologia de ponta para uma gestão profissional e eficiente do seu
            condomínio
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

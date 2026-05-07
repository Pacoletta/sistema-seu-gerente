"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";

export default function LandingCTA() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS || "5531983625590";

  return (
    <section className="relative py-24 bg-linear-to-br from-blue-950 via-purple-950 to-blue-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Pronto para Transformar a Gestão do seu Condomínio?
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Entre em contato e descubra como nossa plataforma pode simplificar sua
          administração
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login/cadastro"
            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <span>Começar Agora</span>
            <FaArrowRight className="w-5 h-5" />
          </Link>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>Falar com Consultor</span>
          </a>
        </div>
      </div>
    </section>
  );
}

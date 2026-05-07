"use client";

import React from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

export default function LandingHero() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Animated Gradient Background Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-blue-600/10 via-transparent to-cyan-600/10 animate-[gradient_15s_ease_infinite]"></div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af15_1px,transparent_1px),linear-gradient(to_bottom,#1e40af15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] animate-[grid_20s_linear_infinite]"></div>

      {/* Gradient Orbs - Múltiplos e Animados */}
      <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-3xl animate-[float_25s_ease-in-out_infinite] opacity-70"></div>
      <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-3xl animate-[float_18s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[30%] right-[30%] w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-3xl animate-[float_22s_ease-in-out_infinite]"></div>

      {/* Floating Particles - Mais Elaboradas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[8%] w-3 h-3 bg-blue-400/50 rounded-full animate-[particle_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-[35%] right-[12%] w-4 h-4 bg-cyan-400/40 rounded-full animate-[particle_10s_ease-in-out_infinite] animation-delay-2"></div>
        <div className="absolute bottom-[25%] left-[15%] w-2 h-2 bg-blue-300/50 rounded-full animate-[particle_7s_ease-in-out_infinite] animation-delay-4"></div>
        <div className="absolute top-[55%] right-[20%] w-3 h-3 bg-cyan-300/40 rounded-full animate-[particle_9s_ease-in-out_infinite] animation-delay-1"></div>
        <div className="absolute top-[70%] left-[35%] w-2 h-2 bg-blue-400/40 rounded-full animate-[particle_11s_ease-in-out_infinite] animation-delay-3"></div>
        <div className="absolute bottom-[40%] right-[40%] w-3 h-3 bg-cyan-400/50 rounded-full animate-[particle_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-[45%] left-[60%] w-2 h-2 bg-blue-300/40 rounded-full animate-[particle_12s_ease-in-out_infinite] animation-delay-5"></div>
      </div>

      {/* Shimmer Lines Animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-full w-full h-0.5 bg-linear-to-r from-transparent via-blue-400/60 to-transparent animate-[shimmer_8s_linear_infinite]"></div>
        <div className="absolute top-[40%] -left-full w-full h-0.5 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent animate-[shimmer_10s_linear_infinite] animation-delay-2"></div>
        <div className="absolute bottom-[25%] -left-full w-full h-0.5 bg-linear-to-r from-transparent via-blue-300/50 to-transparent animate-[shimmer_12s_linear_infinite] animation-delay-4"></div>
      </div>

      {/* Animated Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-[-50%] w-[200%] h-[200px] bg-linear-to-t from-blue-600/30 to-transparent rounded-[100%] animate-[wave_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-[-50%] w-[200%] h-[250px] bg-linear-to-t from-cyan-500/20 to-transparent rounded-[100%] animate-[wave_15s_ease-in-out_infinite] animation-delay-3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Badge com Shimmer Effect */}
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 backdrop-blur-xl px-6 py-3 rounded-full mb-6 group hover:bg-blue-500/25 transition-all relative overflow-hidden shadow-lg shadow-blue-500/10">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <FaRocket className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform relative z-10" />
            <span className="text-blue-100 font-semibold text-sm relative z-10">
              Sistema Completo de Gestão Condominial
            </span>
          </div>

          {/* Main Title - Reduzido */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 animate-[fadeInUp_0.8s_ease-out]">
            <span className="bg-linear-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(59,130,246,0.6)]">
              Seu Gerente
            </span>
          </h1>

          {/* Subtitle - Reduzido */}
          <p className="text-2xl md:text-3xl font-light text-blue-100 mb-3 animate-[fadeInUp_1s_ease-out]">
            Gestão Condominial{" "}
            <span className="font-bold text-white drop-shadow-lg">
              Inteligente
            </span>
          </p>

          {/* Description - Reduzido */}
          <p className="text-base md:text-lg text-slate-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-[fadeInUp_1.2s_ease-out]">
            Simplifique a administração do seu condomínio com tecnologia de
            ponta.
            <span className="text-blue-300 font-semibold">
              {" "}
              Controle financeiro
            </span>
            , comunicação eficiente e{" "}
            <span className="text-cyan-300 font-semibold">
              relatórios profissionais
            </span>
            .
          </p>

          {/* CTA Buttons - Reduzido */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
            <Link
              href="/login/cadastro"
              className="group relative px-8 py-4 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden animate-[fadeInUp_1.4s_ease-out]"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Começar Agora</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>

            <a
              href="#funcionalidades"
              className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-blue-400/30 text-white font-semibold text-base rounded-2xl hover:bg-white/10 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 animate-[fadeInUp_1.4s_ease-out]"
            >
              Ver Funcionalidades
            </a>
          </div>

          {/* Trust Indicators - Reduzido */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              {
                icon: FaShieldAlt,
                text: "100% Seguro",
                color: "text-emerald-400",
              },
              {
                icon: FaChartLine,
                text: "500+ Condomínios",
                color: "text-blue-400",
              },
              {
                icon: FaRocket,
                text: "Suporte 24/7",
                color: "text-cyan-400",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-blue-400/20 hover:bg-white/10 hover:border-blue-300/40 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 animate-[fadeInUp_1.6s_ease-out]"
              >
                <item.icon
                  className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`}
                />
                <span className="text-xs font-semibold text-white">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
            fillOpacity="0.05"
          />
        </svg>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes particle {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          50% {
            transform: translate(0, -100px);
          }
        }
        @keyframes wave {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-25%) translateY(-10px);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes grid {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(64px);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-1 {
          animation-delay: 1s;
        }
        .animation-delay-2 {
          animation-delay: 2s;
        }
        .animation-delay-3 {
          animation-delay: 3s;
        }
        .animation-delay-4 {
          animation-delay: 4s;
        }
        .animation-delay-5 {
          animation-delay: 5s;
        }
      `}</style>
    </section>
  );
}

"use client";

import { SplineScene } from "@/components/ui/spline";
import { BeamsBackground } from "@/components/ui/beams-background";

export function SplineBanner() {
  return (
    <BeamsBackground
      className="min-h-[400px] lg:min-h-[450px]"
      intensity="strong"
    >
      <div className="flex flex-col lg:flex-row h-full min-h-[400px] lg:min-h-[450px]">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-block mb-6 w-fit animate-fade-in-up">
            <div className="relative px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              <span className="text-white/90 text-sm font-semibold tracking-wide">
                Sistema Completo de Gestão Condominial
              </span>
            </div>
          </div>

          {/* Título principal */}
          <div
            className="relative mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter leading-tight">
              Seu Gerente
            </h1>
          </div>

          {/* Subtítulo */}
          <div
            className="relative mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-lg md:text-2xl lg:text-3xl text-white/70 tracking-tighter">
              Gestão Condominial Inteligente
            </p>
          </div>

          {/* Descrição */}
          <p
            className="text-base md:text-lg text-white/60 mb-8 leading-relaxed max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Simplifique a administração do seu condomínio com uma plataforma
            moderna e intuitiva. Controle despesas, receitas, moradores e muito
            mais em um único lugar.
          </p>

          {/* Botão */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="/login/cadastro"
              className="relative group inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-green-500 via-green-400 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border-2 border-green-300/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-green-600/20 via-green-700/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                Começar Agora
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* Right content - 3D Scene */}
        <div className="flex-1 relative min-h-[300px] lg:min-h-0">
          <SplineScene
            scene={
              process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ||
              "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            }
            className="w-full h-full"
          />
        </div>
      </div>
    </BeamsBackground>
  );
}

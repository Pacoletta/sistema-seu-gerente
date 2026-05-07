"use client";
import React, { useState, useEffect } from "react";

const depoimentos = [
  {
    texto:
      "Desde que implementamos o Seu Gerente, nossa gestão ficou 10x mais eficiente. O Mercado Pago integrado facilitou muito os pagamentos e os relatórios automáticos nos poupam horas de trabalho.",
    autor: "Carlos Mendes",
    cargo: "Síndico Profissional",
    local: "São Paulo, SP",
    condominio: "Residencial Villa Lobos - 120 apts",
    avatar: "CM",
    rating: 5,
    destaque: "Economizou 15h/semana",
  },
  {
    texto:
      "O suporte é excepcional e a plataforma é muito intuitiva. Conseguimos reduzir inadimplência em 40% com as notificações automáticas e os relatórios detalhados enviados aos moradores.",
    autor: "Juliana Santos",
    cargo: "Síndica",
    local: "Belo Horizonte, MG",
    condominio: "Condomínio Horizonte - 85 apts",
    avatar: "JS",
    rating: 5,
    destaque: "Reduziu inadimplência 40%",
  },
  {
    texto:
      "A transparência que o sistema oferece é incrível. Os moradores têm acesso a tudo em tempo real e isso acabou com as reclamações sobre gestão. Recomendo fortemente!",
    autor: "Roberto Silva",
    cargo: "Síndico",
    local: "Rio de Janeiro, RJ",
    condominio: "Edifício Atlântica - 200 apts",
    avatar: "RS",
    rating: 5,
    destaque: "100% transparência",
  },
  {
    texto:
      "Migrar para o Seu Gerente foi a melhor decisão. O cadastro automático dos 150 apartamentos nos poupou dias de trabalho e os relatórios em PDF são profissionais.",
    autor: "Fernanda Costa",
    cargo: "Administradora",
    local: "Curitiba, PR",
    condominio: "Residencial Green Park - 150 apts",
    avatar: "FC",
    rating: 5,
    destaque: "Cadastro automático",
  },
  {
    texto:
      "O controle financeiro ficou perfeito com o Mercado Pago. Recebemos por PIX, cartão e boleto automaticamente. Nunca mais tivemos problemas com conciliação bancária.",
    autor: "Patrícia Oliveira",
    cargo: "Síndica",
    local: "Florianópolis, SC",
    condominio: "Condomínio Ilha Bela - 95 apts",
    avatar: "PO",
    rating: 5,
    destaque: "Pagamentos automáticos",
  },
  {
    texto:
      "Impressionante como o sistema é completo. Gestão de moradores, relatórios, comunicação, tudo integrado. Nosso condomínio nunca esteve tão bem organizado e os custos reduziram muito.",
    autor: "Marcos Ferreira",
    cargo: "Síndico",
    local: "Salvador, BA",
    condominio: "Residencial Bahia Sul - 180 apts",
    avatar: "MF",
    rating: 5,
    destaque: "Reduziu custos 30%",
  },
];

export default function CarrosselDepoimentos() {
  const [index, setIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Avança slide automaticamente
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % depoimentos.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [index, isAutoPlay]);

  // Navegação manual
  const prevSlide = () => {
    setIsAutoPlay(false);
    setIndex((prev) => (prev - 1 + depoimentos.length) % depoimentos.length);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setIsAutoPlay(false);
    setIndex((prev) => (prev + 1) % depoimentos.length);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToSlide = (i: number) => {
    setIsAutoPlay(false);
    setIndex(i);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ⭐
      </span>
    ));
  };

  const currentDepoimento = depoimentos[index];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Depoimento Principal */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50 rounded-full blur-2xl opacity-60"></div>

        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-6xl text-blue-100 font-serif leading-none">
          "
        </div>

        <div className="relative z-10">
          {/* Badge de destaque */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-100 to-emerald-100 rounded-full text-green-700 font-semibold text-sm mb-6">
            <span className="text-lg">🏆</span>
            {currentDepoimento.destaque}
          </div>

          {/* Texto do depoimento */}
          <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
            {currentDepoimento.texto}
          </blockquote>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">{renderStars(currentDepoimento.rating)}</div>
            <span className="text-gray-600 font-medium ml-2">
              {currentDepoimento.rating}/5 estrelas
            </span>
          </div>

          {/* Informações do autor */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {currentDepoimento.avatar}
            </div>

            {/* Dados do autor */}
            <div>
              <div className="font-bold text-gray-900 text-lg">
                {currentDepoimento.autor}
              </div>
              <div className="text-blue-600 font-medium">
                {currentDepoimento.cargo}
              </div>
              <div className="text-gray-600 text-sm">
                📍 {currentDepoimento.local}
              </div>
              <div className="text-gray-500 text-sm">
                🏢 {currentDepoimento.condominio}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={prevSlide}
          className="group bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Depoimento anterior"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Indicadores */}
        <div className="flex gap-2">
          {depoimentos.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir para depoimento ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="group bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Próximo depoimento"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="group-hover:translate-x-0.5 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicador de autoplay */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              isAutoPlay ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          ></div>
          <span>{isAutoPlay ? "Reprodução automática" : "Pausado"}</span>
        </div>
      </div>
    </div>
  );
}

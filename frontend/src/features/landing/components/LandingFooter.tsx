"use client";

import React from "react";
import Link from "next/link";
import {
  FaWhatsapp,
  FaEnvelope,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaClock,
} from "react-icons/fa";

export default function LandingFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="text-white text-2xl font-bold mb-4">Seu Gerente</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Solução completa para gestão condominial moderna e eficiente.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#funcionalidades"
                  className="hover:text-white transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Recursos */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Recursos</h4>
            <ul className="space-y-3">
              <li>
                <span className="flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4 text-green-400" />
                  Segurança Garantida
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2">
                  <FaHeadset className="w-4 h-4 text-blue-400" />
                  Suporte 24/7
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2">
                  <FaMobileAlt className="w-4 h-4 text-purple-400" />
                  Acesso Mobile
                </span>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FaWhatsapp className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                <span className="text-sm">+55 (31) 98362-5590</span>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                <span className="text-sm">
                  contato@sistemaseugerente.com.br
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaClock className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                <span className="text-sm">Seg - Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026{" "}
              <span className="text-white font-semibold">Seu Gerente</span>.
              Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacidade"
                className="hover:text-white transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="/termos"
                className="hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

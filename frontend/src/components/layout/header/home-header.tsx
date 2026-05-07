import React from "react";
import Link from "next/link";

const LOGO_URL = "/logo-seugerente.png";

export default function HomeHeader() {
  return (
    <header className="w-full bg-linear-to-r from-blue-950 via-blue-900 to-blue-950 shadow-2xl backdrop-blur-sm border-b border-blue-800/30">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <img
              src={LOGO_URL}
              alt="Logo"
              width="38"
              height="38"
              className="relative rounded-full shadow-lg border-2 border-blue-300/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cadastro-pessoal"
            className="text-white text-sm font-semibold px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-400/50 transition-all duration-200"
          >
            Cadastrar
          </Link>
          <Link
            href="/login"
            className="text-white text-sm font-semibold px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-400/50 transition-all duration-200"
          >
            Entrar
          </Link>
        </div>
      </nav>
    </header>
  );
}

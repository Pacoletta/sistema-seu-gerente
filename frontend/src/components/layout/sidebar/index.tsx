"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API } from "@/services/api";
import styles from "./sidebar.module.css";

const LOGO_URL = "/logo-seugerente.png";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Carrega estado do localStorage e habilita animações após hydration
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setCollapsed(true);
    }
    // Habilita transições apenas após o primeiro render no client
    requestAnimationFrame(() => {
      setAnimated(true);
    });
  }, []);

  // Fecha o drawer ao navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Bloqueia scroll do body quando drawer está aberto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", newState.toString());
  };

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: "/moradores",
      label: "Moradores",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      href: "/receitas",
      label: "Receitas",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      href: "/despesas",
      label: "Despesas",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      href: "/melhorias",
      label: "Melhorias",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      href: "/reservas",
      label: "Reservas",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/relatorio",
      label: "Relatório",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      href: "/configuracao",
      label: "Configurações",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await API.auth.logout();
    } catch (e) {
      console.error("❌ Erro ao fazer logout:", e);
    } finally {
      window.location.href = "/login";
    }
  };

  const sidebarClass = [
    styles.sidebar,
    collapsed ? styles.collapsed : "",
    animated ? styles.animated : "",
    mobileOpen ? styles.mobileOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Barra de topo mobile — visível apenas em telas < lg */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 border-b border-slate-700 shadow-lg">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <img
            src={LOGO_URL}
            alt="Logo"
            className="h-8 w-8 rounded-lg border border-blue-500 shadow"
          />
          <span className="text-white font-bold text-base">Seu Gerente</span>
        </div>

        {/* Espaço para balancear o layout (equivale ao botão hamburguer) */}
        <div className="w-10" />
      </div>

      {/* Overlay — fecha o drawer ao clicar fora */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Desktop (sticky) / Drawer Mobile (fixed, deslizante) */}
      <aside className={sidebarClass}>
        {/* Header com Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${
              collapsed ? "justify-center w-full" : ""
            }`}
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <div className="relative shrink-0">
              <img
                src={LOGO_URL}
                alt="Logo"
                className="w-10 h-10 rounded-lg border-2 border-blue-500 shadow-lg"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className={styles.label}>
              <h2 className="text-white font-bold text-base">Seu Gerente</h2>
              <p className="text-slate-400 text-xs">Gestão Profissional</p>
            </div>
          </div>

          {/* Botão fechar no mobile (X) */}
          <button
            className="lg:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors shrink-0"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items — todos os itens com scroll */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className={`${styles.label} font-medium text-sm`}>
                  {item.label}
                </span>
                {!collapsed && isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full shrink-0"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            title={collapsed ? "Sair do sistema" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-3 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 ${
              collapsed ? "justify-center" : ""
            }`}
            aria-label="Sair do sistema"
          >
            <svg
              className="w-6 h-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className={`${styles.label} text-sm`}>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

import "../styles/globals.css";
import React from "react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Seu Gerente - Gestão Condominial Inteligente",
  description: "Sistema completo de gestão para condomínios",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }, { url: "/favicon.ico" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}

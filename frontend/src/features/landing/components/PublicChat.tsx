"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function PublicChat() {
  // Número do WhatsApp (formato: código do país + DDD + número sem espaços)
  const whatsappNumber = "5531983625590";

  // Mensagem pré-definida que será enviada
  const message = "Olá! Gostaria de saber mais sobre o Sistema Seu Gerente.";

  // URL do WhatsApp Web/App
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition-all hover:scale-110 hover:bg-green-600 hover:shadow-green-500/50 animate-bounce"
      aria-label="Abrir WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <FaWhatsapp className="text-4xl" />
    </button>
  );
}

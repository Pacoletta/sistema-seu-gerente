"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HomeHeader from "@/components/layout/header/home-header";
import PublicChat from "@/features/landing/components/PublicChat";
import { LandingBannerCarousel } from "@/features/landing/components/LandingBannerCarousel";
import {
  LandingFeatures,
  LandingCTA,
  LandingFooter,
} from "@/features/landing/components";

function HomeContent() {
  const searchParams = useSearchParams();

  // Capturar código de indicação da URL e salvar no localStorage
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      console.log("📋 Código de indicação capturado na landing page:", ref);
      localStorage.setItem("indicacao_ref", ref);
    }
  }, [searchParams]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <HomeHeader />
      <LandingBannerCarousel />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
      <PublicChat />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Carregando...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

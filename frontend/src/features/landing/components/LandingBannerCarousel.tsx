"use client";

import { useState, useEffect, useCallback } from "react";
import { API } from "@/services/api";

interface Banner {
  id: string;
  imagemUrl: string;
  ordem: number;
}

export function LandingBannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    API.banners
      .listAtivos()
      .then((data) => {
        setBanners(data as Banner[]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1)),
    [banners.length],
  );

  const next = useCallback(
    () => setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1)),
    [banners.length],
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (!loaded || banners.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "min(620px, 65vw)", minHeight: "320px" }}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((b) => (
          <div key={b.id} className="relative shrink-0 w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.imagemUrl}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/55 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Próximo"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/55 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para banner ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

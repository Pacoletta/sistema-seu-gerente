"use client";

import React, { useEffect, useRef } from "react";

interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  pos: Vector2D;
  vel: Vector2D;
  acc: Vector2D;
  target: Vector2D;
  maxSpeed = 1.5;
  maxForce = 0.15;
  particleSize = 8;
  startColor: { r: number; g: number; b: number };
  targetColor: { r: number; g: number; b: number };
  colorWeight = 1;
  colorBlendRate: number;

  constructor(x: number, y: number, targetX: number, targetY: number) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: targetX, y: targetY };

    // Cores do tema azul
    const blueColors = [
      { r: 147, g: 197, b: 253 }, // blue-300
      { r: 96, g: 165, b: 250 }, // blue-400
      { r: 59, g: 130, b: 246 }, // blue-500
      { r: 186, g: 230, b: 253 }, // cyan-200
      { r: 103, g: 232, b: 249 }, // cyan-400
    ];

    const randomColor1 =
      blueColors[Math.floor(Math.random() * blueColors.length)];
    const randomColor2 =
      blueColors[Math.floor(Math.random() * blueColors.length)];

    this.startColor = randomColor1;
    this.targetColor = randomColor2;
    this.colorBlendRate = Math.random() * 0.008 + 0.001;
  }

  move() {
    const towardsTarget: Vector2D = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x ** 2 + towardsTarget.y ** 2);

    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed;
    }

    if (magnitude < 50) {
      const slowFactor = magnitude / 50;
      towardsTarget.x *= slowFactor;
      towardsTarget.y *= slowFactor;
    }

    const steer: Vector2D = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x ** 2 + steer.y ** 2);
    if (steerMagnitude > this.maxForce) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.acc.x = 0;
    this.acc.y = 0;

    // Blend de cores
    this.colorWeight += this.colorBlendRate;
    if (this.colorWeight >= 1 || this.colorWeight <= 0) {
      this.colorBlendRate *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    const weight = Math.max(0, Math.min(1, this.colorWeight));
    const r = Math.round(
      this.startColor.r * (1 - weight) + this.targetColor.r * weight
    );
    const g = Math.round(
      this.startColor.g * (1 - weight) + this.targetColor.g * weight
    );
    const b = Math.round(
      this.startColor.b * (1 - weight) + this.targetColor.b * weight
    );

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    if (drawAsPoints) {
      ctx.fillRect(
        this.pos.x,
        this.pos.y,
        this.particleSize,
        this.particleSize
      );
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

interface BannerParticleTextProps {
  words?: string[];
  className?: string;
}

export function BannerParticleText({
  words = ["SEU", "GERENTE"],
  className = "",
}: BannerParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const currentIndexRef = useRef(0);
  const frameCountRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas responsivo
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = Math.min(parent.clientWidth, 600);
        canvas.height = 200;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Canvas offscreen para renderizar texto
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    const nextWord = () => {
      const word = words[currentIndexRef.current];
      currentIndexRef.current = (currentIndexRef.current + 1) % words.length;

      offscreenCtx.clearRect(
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height
      );
      offscreenCtx.fillStyle = "white";
      offscreenCtx.font = "bold 80px Inter, sans-serif";
      offscreenCtx.textAlign = "center";
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.fillText(
        word,
        offscreenCanvas.width / 2,
        offscreenCanvas.height / 2
      );

      const imageData = offscreenCtx.getImageData(
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height
      );
      const pixels = imageData.data;
      const pixelSteps = 4;

      let particleIndex = 0;
      for (let y = 0; y < offscreenCanvas.height; y += pixelSteps) {
        for (let x = 0; x < offscreenCanvas.width; x += pixelSteps) {
          const index = (y * offscreenCanvas.width + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 128) {
            if (particleIndex < particlesRef.current.length) {
              const particle = particlesRef.current[particleIndex];
              particle.target.x = x;
              particle.target.y = y;
            } else {
              const randomX = Math.random() * canvas.width;
              const randomY = Math.random() * canvas.height;
              particlesRef.current.push(new Particle(randomX, randomY, x, y));
            }
            particleIndex++;
          }
        }
      }

      // Remove partículas extras
      while (particlesRef.current.length > particleIndex) {
        particlesRef.current.pop();
      }
    };

    const animate = () => {
      // Motion blur suave
      ctx.fillStyle = "rgba(15, 23, 42, 0.2)"; // slate-950 com opacidade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.move();
        particle.draw(ctx, false);
      });

      frameCountRef.current++;
      if (frameCountRef.current >= 240) {
        frameCountRef.current = 0;
        nextWord();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    nextWord();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [words]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ maxWidth: "600px", height: "200px" }}
    />
  );
}

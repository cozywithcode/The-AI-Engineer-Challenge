"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  sway: number;
  phase: number;
}

const PARTICLE_COUNT = 55;
const GOLD = "rgba(252, 236, 184, ";
const WARM = "rgba(255, 248, 220, ";

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.5,
    speedY: -0.15 - Math.random() * 0.2,
    sway: 0.3 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
  };
}

/**
 * Canvas layer of slow-drifting sparkle particles (sunlight motes).
 * Runs animation in requestAnimationFrame for smooth, immersive effect.
 */
export function SparklesLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) {
        particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));
      }
    };

    const tick = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;

      for (const p of particles) {
        p.y += p.speedY;
        p.x += Math.sin(t + p.phase) * p.sway;
        if (p.y < -5) {
          p.y = h + 2;
          p.x = Math.random() * w;
        }
        if (p.x < -2 || p.x > w + 2) p.x = Math.random() * w;

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(t * 0.7 + p.phase));
        ctx.fillStyle = (Math.random() > 0.5 ? GOLD : WARM) + alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    tick();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden
    />
  );
}

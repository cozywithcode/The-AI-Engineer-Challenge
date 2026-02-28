"use client";

import { useEffect, useRef } from "react";

type ParticleType = "twinkle" | "drifter" | "glow";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  sway: number;
  phase: number;
  type: ParticleType;
}

const PARTICLE_COUNT = 55;

function createParticle(width: number, height: number): Particle {
  const rand = Math.random();
  let type: ParticleType;
  let size: number;
  let speedY: number;
  let opacity: number;

  if (rand < 0.6) {
    type = "twinkle";
    size = 0.8 + Math.random() * 1.5;
    speedY = 0.3 + Math.random() * 0.4;
    opacity = 0.3 + Math.random() * 0.5;
  } else if (rand < 0.9) {
    type = "drifter";
    size = 1.5 + Math.random() * 2.5;
    speedY = 0.1 + Math.random() * 0.15;
    opacity = 0.2 + Math.random() * 0.35;
  } else {
    type = "glow";
    size = 3 + Math.random() * 4;
    speedY = 0.05 + Math.random() * 0.1;
    opacity = 0.1 + Math.random() * 0.2;
  }

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size,
    opacity,
    speedY,
    sway: 0.2 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    type,
  };
}

function createBurstParticle(width: number): Particle {
  return {
    x: Math.random() * width,
    y: -10 - Math.random() * 50,
    size: 1 + Math.random() * 3,
    opacity: 0.5 + Math.random() * 0.4,
    speedY: 1.5 + Math.random() * 2,
    sway: 0.3 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    type: "twinkle",
  };
}

export interface SparklesLayerProps {
  burst?: boolean;
}

/**
 * Canvas layer of slow-drifting sparkle particles (sunlight motes).
 * Particles fall downward like sunlight filtering through the canopy.
 * When burst=true, spawns extra fast-falling particles for the submit effect.
 */
export function SparklesLayer({ burst = false }: SparklesLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef(burst);
  const extraParticlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    burstRef.current = burst;
    if (burst) {
      const w = window.innerWidth;
      extraParticlesRef.current = Array.from({ length: 40 }, () =>
        createBurstParticle(w)
      );
    }
  }, [burst]);

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
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) {
        particles = Array.from({ length: PARTICLE_COUNT }, () =>
          createParticle(w, h)
        );
      }
    };

    const drawParticle = (
      drawCtx: CanvasRenderingContext2D,
      p: Particle,
      alpha: number
    ) => {
      if (p.type === "glow") {
        const gradient = drawCtx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size
        );
        gradient.addColorStop(0, `rgba(253, 230, 138, ${alpha})`);
        gradient.addColorStop(1, "rgba(253, 230, 138, 0)");
        drawCtx.fillStyle = gradient;
      } else if (p.type === "drifter") {
        drawCtx.fillStyle = `rgba(255, 248, 220, ${alpha * 0.8})`;
      } else {
        drawCtx.fillStyle = `rgba(252, 236, 184, ${alpha})`;
      }
      drawCtx.beginPath();
      drawCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      drawCtx.fill();
    };

    const tick = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx!.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;

      for (const p of particles) {
        p.y += p.speedY;
        p.x += Math.sin(t + p.phase) * p.sway * 0.5;

        if (p.y > h + 5) {
          p.y = -5;
          p.x = Math.random() * w;
        }
        if (p.x < -2 || p.x > w + 2) p.x = Math.random() * w;

        const alpha =
          p.opacity * (0.6 + 0.4 * Math.sin(t * 0.7 + p.phase));
        drawParticle(ctx!, p, alpha);
      }

      // Draw burst particles (one-shot, not wrapped)
      const extras = extraParticlesRef.current;
      for (let i = extras.length - 1; i >= 0; i--) {
        const p = extras[i];
        p.y += p.speedY;
        p.x += Math.sin(t + p.phase) * p.sway;

        if (p.y > h + 10) {
          extras.splice(i, 1);
          continue;
        }

        const alpha =
          p.opacity * (0.6 + 0.4 * Math.sin(t * 1.2 + p.phase));
        drawParticle(ctx!, p, alpha);
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
      className="pointer-events-none absolute inset-0 z-[5]"
      aria-hidden
    />
  );
}

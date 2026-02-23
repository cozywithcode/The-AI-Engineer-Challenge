"use client";

import { type ReactNode } from "react";
import { SparklesLayer } from "./SparklesLayer";

/**
 * Full-bleed forest background: layered gradient, soft persistent rays, sparkles.
 * Renders children (e.g. glass chat panel) on top. Desktop-optimized.
 */
export function ForestScene({ children }: { children: ReactNode }) {
  return (
    <div className="forest-scene relative min-h-screen w-full overflow-hidden">
      {/* Base gradient: canopy to forest floor */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(180deg,
              #0d1f0a 0%,
              #1a3312 12%,
              #234019 28%,
              #2d5020 45%,
              #3a6230 62%,
              #2d5016 78%,
              #1e3d0f 100%
            )
          `,
        }}
      />

      {/* Soft vignette at edges for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          boxShadow: "inset 0 0 25vmin rgba(0,0,0,0.25)",
        }}
      />

      {/* Persistent sun rays (always visible, gentle) */}
      <div className="sun-rays-persistent pointer-events-none absolute inset-0 z-[2]" aria-hidden>
        {[8, 22, 38, 52, 68, 85].map((left, i) => (
          <div
            key={i}
            className="ray-persistent"
            style={{
              left: `${left}%`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Sparkle particles */}
      <SparklesLayer />

      {/* Content on top */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

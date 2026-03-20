"use client";

import { type ReactNode } from "react";
import { SparklesLayer } from "./SparklesLayer";
import { DappledLight } from "./DappledLight";
import { FallingLeaves } from "./FallingLeaves";

interface ForestSceneProps {
  children: ReactNode;
  burst?: boolean;
}

/**
 * Full-bleed immersive forest scene built from layered CSS backgrounds.
 * Creates the illusion of standing in a sun-dappled forest clearing:
 *   - Dense canopy above with patches of bright sky
 *   - Warm golden sunbeams streaming through gaps
 *   - Subtle tree trunk silhouettes at the edges
 *   - Warm mossy forest floor with pooled sunlight
 * Animated layers (leaves, sparkles, dappled light) render on top.
 */
export function ForestScene({ children, burst = false }: ForestSceneProps) {
  return (
    <div className="forest-scene relative min-h-screen w-full overflow-hidden">
      {/* ─── Static background: multi-layer forest scene ─── */}

      {/* Layer 0a: Base forest gradient — canopy → mid → floor */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(180deg,
              #0e1e0c 0%,
              #162a14 8%,
              #1f3820 18%,
              #2a4628 30%,
              #345532 42%,
              #3d5f38 55%,
              #46693f 65%,
              #4a6d40 75%,
              #3f5e36 85%,
              #36522f 92%,
              #2c4527 100%
            )
`,
        }}
      />

      {/* Layer 0b: Sunlight pooling on the forest floor — warm patches at bottom */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 40% 25% at 30% 88%, rgba(253, 230, 138, 0.14) 0%, transparent 100%),
            radial-gradient(ellipse 35% 20% at 60% 92%, rgba(251, 191, 36, 0.10) 0%, transparent 100%),
            radial-gradient(ellipse 50% 30% at 50% 95%, rgba(180, 210, 140, 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 30% 18% at 80% 85%, rgba(253, 230, 138, 0.09) 0%, transparent 100%)
          `,
        }}
      />

      {/* Layer 0f: Warm atmospheric haze — sunny day golden tint */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(253, 230, 138, 0.06) 0%, transparent 100%)
          `,
        }}
      />

      {/* Layer 0g: Canopy leaf texture — dense clusters suggesting overhead foliage */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle 80px at 10% 12%, rgba(42, 90, 38, 0.25) 0%, transparent 100%),
            radial-gradient(circle 100px at 30% 6%, rgba(36, 78, 34, 0.20) 0%, transparent 100%),
            radial-gradient(circle 70px at 48% 14%, rgba(48, 95, 42, 0.22) 0%, transparent 100%),
            radial-gradient(circle 90px at 65% 4%, rgba(38, 82, 36, 0.18) 0%, transparent 100%),
            radial-gradient(circle 110px at 85% 10%, rgba(32, 72, 30, 0.24) 0%, transparent 100%),
            radial-gradient(circle 60px at 22% 18%, rgba(55, 100, 48, 0.15) 0%, transparent 100%),
            radial-gradient(circle 85px at 75% 16%, rgba(46, 92, 40, 0.20) 0%, transparent 100%)
          `,
        }}
      />

      {/* ─── Animated layers ─── */}

      {/* Layer 2: Dappled light patches */}
      {/* <DappledLight /> */}

      {/* Layer 3: Persistent sun rays */}
      {/* <div
        className="sun-rays-persistent pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
      >
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
      </div> */}

      {/* Layer 4: Falling leaves */}
      <FallingLeaves />

      {/* Layer 5: Sparkle particles (sunlight motes falling down) */}
      <SparklesLayer burst={burst} />

      {/* Layer 10: Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

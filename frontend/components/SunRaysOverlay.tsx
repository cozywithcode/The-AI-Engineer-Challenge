"use client";

/**
 * Dramatic sunlight cascade effect triggered on message submit.
 * Multiple golden beams expand and sweep downward from the canopy
 * with a warm golden wash that briefly warms the entire viewport.
 */

const BEAM_POSITIONS = [10, 30, 50, 70, 90];
const RAY_POSITIONS = [5, 18, 35, 48, 62, 78, 92];

export function SunRaysOverlay() {
  return (
    <div className="sun-rays-overlay" aria-hidden>
      {/* Layer 1: Warm golden wash */}
      <div className="cascade-wash" />

      {/* Layer 2: Wide beam sweeps */}
      {BEAM_POSITIONS.map((left, i) => (
        <div
          key={`beam-${i}`}
          className="cascade-beam"
          style={{
            left: `${left}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}

      {/* Layer 3: Narrow bright rays */}
      {RAY_POSITIONS.map((left, i) => (
        <div
          key={`ray-${i}`}
          className="cascade-ray"
          style={{
            left: `${left}%`,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

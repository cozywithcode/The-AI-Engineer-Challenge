"use client";

/**
 * Animated dappled light patches: semi-transparent warm blobs
 * that slowly drift across the forest background, simulating
 * sunlight filtering through a moving canopy.
 */

const PATCHES = [
  { x: 15, y: 20, size: 200, delay: 0, duration: 16 },
  { x: 45, y: 35, size: 260, delay: 2, duration: 20 },
  { x: 70, y: 15, size: 180, delay: 4, duration: 14 },
  { x: 25, y: 60, size: 220, delay: 6, duration: 18 },
  { x: 55, y: 75, size: 150, delay: 1, duration: 15 },
  { x: 80, y: 50, size: 240, delay: 3, duration: 17 },
  { x: 10, y: 80, size: 190, delay: 5, duration: 19 },
  { x: 60, y: 45, size: 170, delay: 7, duration: 13 },
] as const;

export function DappledLight() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      aria-hidden
    >
      {PATCHES.map((p, i) => (
        <div
          key={i}
          className="dappled-patch absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(253, 230, 138, 0.30) 0%, rgba(253, 230, 138, 0.10) 50%, transparent 70%)",
            mixBlendMode: "soft-light",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

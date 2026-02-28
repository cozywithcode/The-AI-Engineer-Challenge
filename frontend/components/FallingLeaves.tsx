"use client";

/**
 * Pure CSS falling leaves with parallax depth layers.
 * Leaves gently sway and drift downward through the scene.
 * Three layers at different speeds create a depth illusion.
 */

interface Leaf {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  layer: "back" | "mid" | "front";
  hue: number;
}

const LEAVES: Leaf[] = [
  // Back layer (slow, small, faded)
  { id: 0, left: 8, size: 12, delay: 0, duration: 25, layer: "back", hue: 0 },
  { id: 1, left: 28, size: 10, delay: 5, duration: 28, layer: "back", hue: 15 },
  { id: 2, left: 52, size: 14, delay: 3, duration: 22, layer: "back", hue: -10 },
  { id: 3, left: 72, size: 11, delay: 8, duration: 30, layer: "back", hue: 5 },
  { id: 4, left: 90, size: 13, delay: 12, duration: 26, layer: "back", hue: 20 },
  // Mid layer (medium speed/size)
  { id: 5, left: 15, size: 16, delay: 2, duration: 18, layer: "mid", hue: 10 },
  { id: 6, left: 35, size: 18, delay: 6, duration: 20, layer: "mid", hue: -5 },
  { id: 7, left: 60, size: 15, delay: 0, duration: 16, layer: "mid", hue: 25 },
  { id: 8, left: 78, size: 17, delay: 9, duration: 22, layer: "mid", hue: 0 },
  { id: 9, left: 45, size: 14, delay: 4, duration: 19, layer: "mid", hue: -15 },
  // Front layer (faster, larger, vivid)
  { id: 10, left: 20, size: 22, delay: 1, duration: 14, layer: "front", hue: 5 },
  { id: 11, left: 50, size: 20, delay: 7, duration: 12, layer: "front", hue: 30 },
  { id: 12, left: 75, size: 24, delay: 3, duration: 15, layer: "front", hue: -20 },
  { id: 13, left: 38, size: 19, delay: 10, duration: 13, layer: "front", hue: 10 },
];

const LAYER_OPACITY: Record<string, number> = {
  back: 0.4,
  mid: 0.6,
  front: 0.8,
};

export function FallingLeaves() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden"
      aria-hidden
    >
      {LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className="falling-leaf absolute"
          style={{
            left: `${leaf.left}%`,
            top: "-30px",
            width: leaf.size,
            height: leaf.size * 0.7,
            opacity: LAYER_OPACITY[leaf.layer],
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            backgroundColor: `hsl(${105 + leaf.hue}, 55%, ${leaf.layer === "front" ? 45 : 35}%)`,
            borderRadius: "50% 0 50% 0",
          }}
        />
      ))}
    </div>
  );
}

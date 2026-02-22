"use client";

/**
 * Overlay that shows sun streaming through treetops to the forest floor.
 * Rendered when the user submits a message for a short, calming effect.
 */

const RAY_COUNT = 7;
const RAY_POSITIONS = [5, 18, 35, 50, 65, 82, 95];

export function SunRaysOverlay() {
  return (
    <div className="sun-rays-overlay" aria-hidden>
      {RAY_POSITIONS.slice(0, RAY_COUNT).map((left, i) => (
        <div
          key={i}
          className="ray"
          style={{
            left: `${left}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

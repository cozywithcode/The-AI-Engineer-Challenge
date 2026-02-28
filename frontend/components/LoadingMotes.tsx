"use client";

/**
 * Forest-themed loading indicator: three pulsing golden dots
 * that glow like sunlight motes, shown while the assistant is thinking.
 */
export function LoadingMotes() {
  return (
    <div
      className="flex items-center gap-2 px-5 py-4"
      role="status"
      aria-label="Thinking..."
      data-testid="loading-motes"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="loading-mote inline-block h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: "rgba(253, 230, 138, 0.8)",
            boxShadow: "0 0 8px rgba(253, 230, 138, 0.5)",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <span className="sr-only">Thinking...</span>
    </div>
  );
}

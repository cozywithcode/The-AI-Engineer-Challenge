"use client";

import { useForestSounds } from "@/hooks/useForestSounds";

/**
 * Toggle for forest ambient sound (wind + birds). Persists preference in localStorage.
 */
export function SoundToggle() {
  const { muted, toggleMuted } = useForestSounds();

  return (
    <button
      type="button"
      onClick={toggleMuted}
      className="sound-toggle flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-sm text-white/90 backdrop-blur-sm transition hover:bg-black/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/50"
      aria-label={muted ? "Turn forest sound on" : "Turn forest sound off"}
      data-testid="sound-toggle"
    >
      {muted ? (
        <>
          <span aria-hidden>🔇</span>
          <span>Sound off</span>
        </>
      ) : (
        <>
          <span aria-hidden>🔊</span>
          <span>Sound on</span>
        </>
      )}
    </button>
  );
}

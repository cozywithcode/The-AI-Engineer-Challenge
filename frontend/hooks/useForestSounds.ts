"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "forest-chat-sound-muted";

function getStoredMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === null) return true; // first visit: default muted (sound off)
    return v === "true";
  } catch {
    return true;
  }
}

function setStoredMuted(muted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    // ignore
  }
}

/**
 * Creates a brown-noise-like buffer for wind (low-pass filtered noise).
 */
function createWindBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 0.4;
  }
  return buffer;
}

/**
 * Plays a single procedural bird chirp.
 */
function playChirp(ctx: AudioContext, destination: AudioNode): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2800 + Math.random() * 1200, now);
  osc.frequency.exponentialRampToValueAtTime(3200 + Math.random() * 800, now + 0.04);
  osc.frequency.exponentialRampToValueAtTime(2000, now + 0.12);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * Forest ambient sound: wind (looped) and occasional bird chirps.
 * AudioContext is created on first unmute (user gesture) to satisfy autoplay policy.
 * Mute state is persisted in localStorage.
 */
export function useForestSounds() {
  const [muted, setMutedState] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const windSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const birdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMutedState(getStoredMuted());
  }, []);

  const stopSounds = useCallback(() => {
    try {
      if (windSourceRef.current) {
        windSourceRef.current.stop();
        windSourceRef.current = null;
      }
      if (birdIntervalRef.current) {
        clearInterval(birdIntervalRef.current);
        birdIntervalRef.current = null;
      }
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
      }
    } catch {
      // ignore
    }
  }, []);

  const startSounds = useCallback(() => {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (typeof AC !== "function") return;
    let ctx = ctxRef.current;
    if (!ctx) {
      try {
        ctx = new AC();
      } catch {
        return;
      }
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") ctx.resume();

    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const buffer = createWindBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start(0);
    windSourceRef.current = source;

    birdIntervalRef.current = setInterval(() => {
      if (!ctxRef.current || getStoredMuted()) return;
      playChirp(ctxRef.current, gain);
    }, 2200 + Math.random() * 1800);
  }, []);

  const setMuted = useCallback(
    (next: boolean) => {
      setMutedState(next);
      setStoredMuted(next);
      if (next) {
        stopSounds();
      } else {
        startSounds();
      }
    },
    [startSounds, stopSounds]
  );

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  useEffect(() => {
    if (!muted) startSounds();
    return () => {
      stopSounds();
    };
  }, [muted, startSounds, stopSounds]);

  return { muted, setMuted, toggleMuted };
}

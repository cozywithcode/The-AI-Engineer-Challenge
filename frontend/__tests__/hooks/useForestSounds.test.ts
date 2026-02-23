import { renderHook, act } from "@testing-library/react";
import { useForestSounds } from "@/hooks/useForestSounds";

const STORAGE_KEY = "forest-chat-sound-muted";

describe("useForestSounds", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns muted true by default", () => {
    const { result } = renderHook(() => useForestSounds());
    expect(result.current.muted).toBe(true);
  });

  it("respects stored preference when true", () => {
    localStorage.setItem(STORAGE_KEY, "true");
    const { result } = renderHook(() => useForestSounds());
    expect(result.current.muted).toBe(true);
  });

  it("toggle sets muted to false and persists", () => {
    const { result } = renderHook(() => useForestSounds());
    act(() => {
      result.current.toggleMuted();
    });
    expect(result.current.muted).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
  });

  it("setMuted updates state and storage", () => {
    const { result } = renderHook(() => useForestSounds());
    act(() => {
      result.current.setMuted(false);
    });
    expect(result.current.muted).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
    act(() => {
      result.current.setMuted(true);
    });
    expect(result.current.muted).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
  });
});

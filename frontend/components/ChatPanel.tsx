"use client";

import { useCallback, useState } from "react";
import { sendChatMessage } from "@/lib/chat";
import type { ChatMessage } from "@/lib/chat";
import { ForestScene } from "./ForestScene";
import { SunRaysOverlay } from "./SunRaysOverlay";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInput } from "./ChatInput";
import { SoundToggle } from "./SoundToggle";

/** Generates a unique id; uses crypto.randomUUID in browser, fallback for test env. */
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function createMessage(
  role: "user" | "assistant",
  content: string
): ChatMessage {
  return {
    id: generateId(),
    role,
    content,
    createdAt: new Date(),
  };
}

/**
 * Main chat UI: full-bleed forest scene with glass panel, messages, input, and sound toggle.
 * Posts user messages to /api/chat; triggers sun-ray burst on submit.
 */
export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSunRays, setShowSunRays] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = useCallback(async (text: string) => {
    setError(null);
    const userMessage = createMessage("user", text);
    setMessages((prev) => [...prev, userMessage]);
    setShowSunRays(true);
    setLoading(true);

    const rayTimer = window.setTimeout(() => setShowSunRays(false), 2400);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, createMessage("assistant", reply)]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", `Error: ${message}`),
      ]);
    } finally {
      clearTimeout(rayTimer);
      setLoading(false);
    }
  }, []);

  return (
    <>
      {showSunRays && <SunRaysOverlay />}
      <ForestScene>
        {/* Sound toggle: top-right of viewport */}
        <div className="absolute right-6 top-6 z-20">
          <SoundToggle />
        </div>

        {/* Glass chat card: centered, desktop width */}
        <div
          className="glass-card flex w-full max-w-2xl flex-col rounded-3xl border border-forest-dappled/20 shadow-2xl"
          style={{
            backgroundColor: "var(--glass-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            minHeight: "28rem",
            maxHeight: "calc(100vh - 4rem)",
          }}
          data-testid="chat-panel"
        >
          <header className="shrink-0 border-b border-white/10 px-8 py-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-forest-sunlight md:text-3xl">
              Forest Chat
            </h1>
            <p className="mt-1.5 text-sm text-forest-sunlight/80">
              A peaceful place to talk — sunlight through the trees.
            </p>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            {messages.length === 0 && (
              <p className="py-10 text-center font-medium text-forest-sunlight/70">
                Say something to start the conversation…
              </p>
            )}
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
          </div>

          {error && (
            <p
              className="shrink-0 px-6 pb-2 text-sm text-amber-200/90"
              role="alert"
              data-testid="chat-error"
            >
              {error}
            </p>
          )}

          <div className="shrink-0 border-t border-white/10 px-6 py-4">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </ForestScene>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "@/lib/chat";
import type { ChatMessage } from "@/lib/chat";
import { ForestScene } from "./ForestScene";
import { SunRaysOverlay } from "./SunRaysOverlay";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInput } from "./ChatInput";
import type { ChatInputHandle } from "./ChatInput";

import { LoadingMotes } from "./LoadingMotes";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputHandle>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => chatInputRef.current?.focus());
    }
  }, [loading]);

  const handleSend = useCallback(async (text: string) => {
    setError(null);
    const userMessage = createMessage("user", text);
    setMessages((prev) => [...prev, userMessage]);
    setShowSunRays(true);
    setLoading(true);

    const rayTimer = window.setTimeout(() => setShowSunRays(false), 2800);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = await sendChatMessage(history);
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
  }, [messages]);

  return (
    <>
      {false && <SunRaysOverlay />}
      <ForestScene burst={false}>
        {/* Glass chat card: centered, desktop width */}
        <div
          className="glass-card flex w-full max-w-2xl flex-col rounded-3xl border border-forest-dappled/20 shadow-2xl"
          style={{
            backgroundColor: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            minHeight: "28rem",
            maxHeight: "calc(100vh - 4rem)",
          }}
          data-testid="chat-panel"
        >
          <header className="shrink-0 border-b border-white/10 px-8 py-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-forest-sunlight md:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              komorebi
            </h1>
            <p className="mt-1.5 text-sm text-forest-sunlight/80">
              finding calm in the canopy
            </p>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            {messages.length === 0 && (
              <p className="py-10 text-center font-medium text-forest-sunlight/70">
                come rest here awhile...
              </p>
            )}
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                  <LoadingMotes />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
            <ChatInput ref={chatInputRef} onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </ForestScene>
    </>
  );
}

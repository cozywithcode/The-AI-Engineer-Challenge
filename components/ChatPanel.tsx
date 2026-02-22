"use client";

import { useCallback, useState } from "react";
import { sendChatMessage } from "@/lib/chat";
import type { ChatMessage } from "@/lib/chat";
import { SunRaysOverlay } from "./SunRaysOverlay";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInput } from "./ChatInput";

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
 * Main chat panel: message list, input, and sun-ray effect on submit.
 * Posts user messages to /api/chat and appends user + assistant replies.
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

    // Hide sun rays after animation
    const rayTimer = window.setTimeout(() => setShowSunRays(false), 2200);

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
      <div className="mx-auto flex h-full min-h-screen max-w-2xl flex-col px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-forest-sunlight drop-shadow-md md:text-3xl">
            Forest Chat
          </h1>
          <p className="mt-1 text-sm text-forest-sunlight/80">
            A peaceful place to talk — like sunlight through the trees.
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-forest-shadow/40 p-4 border border-forest-leaf/20 min-h-[200px]">
          {messages.length === 0 && (
            <p className="py-8 text-center text-forest-sunlight/70">
              Say something to start the conversation…
            </p>
          )}
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {error && (
          <p
            className="mt-2 text-sm text-amber-200"
            role="alert"
            data-testid="chat-error"
          >
            {error}
          </p>
        )}

        <div className="mt-4">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </>
  );
}

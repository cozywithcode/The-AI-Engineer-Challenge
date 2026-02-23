"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/chat";

interface ChatMessageBubbleProps {
  message: ChatMessageType;
}

/**
 * Single message bubble: glass-friendly, calm contrast. User right, assistant left.
 */
export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-leaf-shimmer`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-5 py-3.5 shadow-lg ${
          isUser
            ? "bg-forest-bark/75 text-forest-sunlight border border-forest-leaf/25"
            : "bg-white/10 text-forest-sunlight-soft border border-white/15 backdrop-blur-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}

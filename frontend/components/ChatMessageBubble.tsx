"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/chat";

interface ChatMessageBubbleProps {
  message: ChatMessageType;
}

/**
 * Single message bubble with forest-appropriate styling.
 * User messages: right-aligned, bark/moss tint. Assistant: left, dappled light tint.
 */
export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-leaf-shimmer`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
          isUser
            ? "bg-forest-bark/80 text-forest-sunlight"
            : "bg-forest-dappled/30 text-forest-sunlight border border-forest-leaf/30"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed md:text-base">
          {message.content}
        </p>
      </div>
    </div>
  );
}

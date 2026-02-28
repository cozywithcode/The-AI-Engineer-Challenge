"use client";

import { useEffect, useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/chat";

interface ChatMessageBubbleProps {
  message: ChatMessageType;
}

/**
 * Single message bubble with slide-in entrance animation.
 * User messages slide from the right, assistant from the left.
 */
export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) translateX(0)"
          : `translateY(12px) translateX(${isUser ? "8px" : "-8px"})`,
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
      }}
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

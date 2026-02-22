"use client";

import { useRef, useState } from "react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Chat input with submit button. Grows to fit content; accessible and keyboard-friendly.
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 rounded-2xl bg-forest-shadow/60 p-2 border border-forest-leaf/20">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl bg-forest-floor/80 px-4 py-3 text-forest-sunlight placeholder-forest-sunlight/50 focus:outline-none focus:ring-2 focus:ring-forest-sunlight/40"
        aria-label="Message"
        data-testid="chat-input"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-forest-canopy px-5 py-3 font-medium text-forest-sunlight transition hover:bg-forest-leaf disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-forest-sunlight/40"
        aria-label="Send message"
        data-testid="chat-submit"
      >
        Send
      </button>
    </div>
  );
}

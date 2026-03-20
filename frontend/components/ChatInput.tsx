"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatInputHandle {
  focus: () => void;
}

/**
 * Chat input with submit button. Glass styling; accessible and keyboard-friendly.
 */
export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput(
    {
      onSend,
      disabled = false,
      placeholder = "Tell the forest what is on your mind.",
    },
    ref
  ) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    // Auto-focus the textarea when it becomes enabled (e.g. after API response)
    useEffect(() => {
      if (!disabled) {
        inputRef.current?.focus();
      }
    }, [disabled]);

    const handleSubmit = () => {
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setValue("");
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div className="flex gap-3 rounded-2xl bg-black/15 p-2.5 backdrop-blur-sm border border-white/15">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="min-h-[48px] max-h-36 flex-1 resize-none rounded-xl bg-[#2f4529] px-4 py-3 text-forest-sunlight placeholder-forest-sunlight/50 border border-white/10 focus:border-forest-sunlight/40 focus:outline-none focus:ring-2 focus:ring-forest-sunlight/30"
          aria-label="Message"
          data-testid="chat-input"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="rounded-xl bg-forest-canopy/90 px-6 py-3 font-medium text-forest-sunlight transition hover:bg-forest-leaf/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-forest-sunlight/40 border border-forest-leaf/30"
          aria-label="Send message"
          data-testid="chat-submit"
        >
          Send
        </button>
      </div>
    );
  }
);

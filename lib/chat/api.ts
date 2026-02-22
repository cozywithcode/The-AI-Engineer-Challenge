/**
 * Chat API client.
 * Single place for /api/chat calls; uses env for base URL so it works locally and on Vercel.
 */

import type { ChatRequest, ChatResponse } from "./types";

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "";
};

/**
 * Sends a user message to the chat API and returns the assistant reply.
 * @throws Error with message if the request fails (network or API error).
 */
export async function sendChatMessage(message: string): Promise<string> {
  const base = getBaseUrl();
  const url = `${base}/api/chat`;
  const body: ChatRequest = { message };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let detail: string;
    try {
      const json = JSON.parse(text) as { detail?: string };
      detail = json.detail ?? text;
    } catch {
      detail = text || res.statusText;
    }
    throw new Error(detail);
  }

  const data = (await res.json()) as ChatResponse;
  return data.reply;
}

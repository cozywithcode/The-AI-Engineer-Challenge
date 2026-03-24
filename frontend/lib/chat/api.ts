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

/** Retrieve the Google ID token from the NextAuth session for backend auth. */
async function getIdToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const session = await res.json();
    return session?.id_token ?? null;
  } catch {
    return null;
  }
}

/**
 * Sends the full conversation history to the chat API and returns the assistant reply.
 * @throws Error with message if the request fails (network or API error).
 */
export async function sendChatMessage(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const base = getBaseUrl();
  const url = `${base}/api/chat`;
  const body: ChatRequest = { messages };

  const idToken = await getIdToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let detail: string;
    try {
      const json = JSON.parse(text) as { detail?: string };
      const raw = json.detail ?? text;
      detail = typeof raw === "string" ? raw : JSON.stringify(raw);
    } catch {
      detail = text || res.statusText;
    }
    throw new Error(detail);
  }

  const data = (await res.json()) as ChatResponse;
  return data.reply;
}

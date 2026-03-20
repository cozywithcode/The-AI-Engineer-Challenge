/**
 * Chat domain types.
 * Keeps API request/response shapes in one place for type safety and clarity.
 */

export interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  reply: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

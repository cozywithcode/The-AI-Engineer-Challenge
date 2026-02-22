import { render, screen } from "@testing-library/react";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import type { ChatMessage } from "@/lib/chat";

describe("ChatMessageBubble", () => {
  const userMessage: ChatMessage = {
    id: "1",
    role: "user",
    content: "Hello",
    createdAt: new Date(),
  };

  const assistantMessage: ChatMessage = {
    id: "2",
    role: "assistant",
    content: "Hi there!",
    createdAt: new Date(),
  };

  it("renders user message with correct content and testid", () => {
    render(<ChatMessageBubble message={userMessage} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByTestId("message-user-1")).toBeInTheDocument();
  });

  it("renders assistant message with correct content and testid", () => {
    render(<ChatMessageBubble message={assistantMessage} />);
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(screen.getByTestId("message-assistant-2")).toBeInTheDocument();
  });
});

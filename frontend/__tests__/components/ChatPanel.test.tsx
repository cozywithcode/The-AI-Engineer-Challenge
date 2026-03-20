import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatPanel } from "@/components/ChatPanel";

describe("ChatPanel", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("shows empty state when no messages", () => {
    render(<ChatPanel />);
    expect(screen.getByText(/Say something to start/)).toBeInTheDocument();
  });

  it("adds user message and shows sun rays then assistant reply on send", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Supportive reply" }),
    });

    render(<ChatPanel />);
    const input = screen.getByTestId("chat-input");
    const submit = screen.getByTestId("chat-submit");

    fireEvent.change(input, { target: { value: "I need help" } });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText("I need help")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Supportive reply")).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "I need help" }],
        }),
      })
    );
  });

  it("shows loading indicator while waiting for response", async () => {
    let resolveReply!: (value: unknown) => void;
    global.fetch = jest.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveReply = resolve;
      })
    );

    render(<ChatPanel />);
    fireEvent.change(screen.getByTestId("chat-input"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByTestId("chat-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("loading-motes")).toBeInTheDocument();
    });

    resolveReply({
      ok: true,
      json: async () => ({ reply: "Hi!" }),
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-motes")).not.toBeInTheDocument();
    });
  });

  it("shows error when API fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => JSON.stringify({ detail: "API error" }),
    });

    render(<ChatPanel />);
    fireEvent.change(screen.getByTestId("chat-input"), { target: { value: "hi" } });
    fireEvent.click(screen.getByTestId("chat-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("chat-error")).toHaveTextContent("API error");
    });
  });
});

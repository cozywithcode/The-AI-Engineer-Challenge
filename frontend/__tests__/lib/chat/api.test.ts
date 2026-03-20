import { sendChatMessage } from "@/lib/chat/api";

describe("sendChatMessage", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("sends POST to /api/chat with messages array and returns reply", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Hello back" }),
    });

    const messages = [{ role: "user" as const, content: "Hello" }];
    const result = await sendChatMessage(messages);
    expect(result).toBe("Hello back");
    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      })
    );
  });

  it("sends full conversation history", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Got it" }),
    });

    const messages = [
      { role: "user" as const, content: "Hi" },
      { role: "assistant" as const, content: "Hello!" },
      { role: "user" as const, content: "How are you?" },
    ];
    await sendChatMessage(messages);
    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        body: JSON.stringify({ messages }),
      })
    );
  });

  it("uses NEXT_PUBLIC_API_URL when set", async () => {
    const prev = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Hi" }),
    });

    await sendChatMessage([{ role: "user", content: "Hi" }]);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/chat",
      expect.any(Object)
    );
    process.env.NEXT_PUBLIC_API_URL = prev;
  });

  it("throws with API error detail when response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Internal Server Error",
      text: async () => JSON.stringify({ detail: "GEMINI_API_KEY not configured" }),
    });

    await expect(
      sendChatMessage([{ role: "user", content: "x" }])
    ).rejects.toThrow("GEMINI_API_KEY not configured");
  });

  it("throws with response text when detail is missing", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => "Server error",
    });

    await expect(
      sendChatMessage([{ role: "user", content: "x" }])
    ).rejects.toThrow("Server error");
  });
});

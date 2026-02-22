import { sendChatMessage } from "@/lib/chat/api";

describe("sendChatMessage", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("sends POST to /api/chat with message and returns reply", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Hello back" }),
    });

    const result = await sendChatMessage("Hello");
    expect(result).toBe("Hello back");
    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello" }),
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

    await sendChatMessage("Hi");
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

    await expect(sendChatMessage("x")).rejects.toThrow("GEMINI_API_KEY not configured");
  });

  it("throws with response text when detail is missing", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => "Server error",
    });

    await expect(sendChatMessage("x")).rejects.toThrow("Server error");
  });
});

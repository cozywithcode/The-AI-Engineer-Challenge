import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * In development, proxy /api/* to the FastAPI backend so the client can
   * call fetch("/api/chat") and hit the Python server (e.g. on port 8000).
   */
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    const target =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Only proxy /api/chat to FastAPI; /api/auth/* is handled by NextAuth
    return [
      { source: "/api/chat", destination: `${target}/api/chat` },
    ];
  },
};

export default nextConfig;

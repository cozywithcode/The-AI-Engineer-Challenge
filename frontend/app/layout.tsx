import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forest Chat — Peaceful conversations",
  description:
    "A calm chatbot experience, like standing in a peaceful forest with sunlight through the trees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-forest-sunlight/95">{children}</body>
    </html>
  );
}

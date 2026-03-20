import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "komorebi — sunlight through the leaves",
  description:
    "A calm chatbot experience inspired by komorebi — the interplay of sunlight and leaves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-[#0e1e0c] font-serif text-forest-sunlight/95 ${cormorant.variable}`}>
        {children}
      </body>
    </html>
  );
}

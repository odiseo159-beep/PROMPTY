import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
export const metadata: Metadata = {
  title: "Promptly – Master the Art of Prompting",
  description:
    "Promptly is the gamified platform to learn, practice, and master AI prompt engineering. Earn XP, unlock badges, and get real AI feedback on every prompt you write.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0d0d1a] text-white font-sans antialiased min-h-screen flex flex-col overflow-x-hidden">
        <Navigation />

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
      <body className="bg-[#0d0d1a] text-white font-sans antialiased min-h-screen flex flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0d0d1a]/80 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight hover:opacity-90 transition-opacity"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-lg shadow-lg shadow-violet-500/40">
                ⚡
              </span>
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Promptly
              </span>
            </Link>

            {/* Nav links — desktop */}
            <ul className="hidden md:flex items-center gap-1">
              {[
                { label: "Home", href: "/" },
                { label: "Lessons", href: "/lessons" },
                { label: "Sandbox", href: "/sandbox" },
                { label: "Leaderboard", href: "/leaderboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-all duration-150 hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-150 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 hover:-translate-y-px active:translate-y-0"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

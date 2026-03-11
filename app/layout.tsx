import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Promptly – Master the Art of Prompting",
  description:
    "Promptly es la plataforma gamificada para aprender, practicar y dominar la ingeniería de prompts. Gana XP, desbloquea insignias y obtén retroalimentación real de IA en cada prompt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col overflow-x-hidden">
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

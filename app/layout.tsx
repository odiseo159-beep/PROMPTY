import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Providers } from "./providers";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable} scroll-smooth`}>
      <body className="font-body bg-[#FAFAF8] text-[#1A1A18] antialiased min-h-screen flex flex-col overflow-x-hidden">
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

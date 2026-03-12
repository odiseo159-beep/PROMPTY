"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Inicio",        href: "/"            },
  { label: "Lecciones",     href: "/lessons"     },
  { label: "Sandbox",       href: "/sandbox"     },
  { label: "Clasificación", href: "/leaderboard" },
  { label: "Perfil",        href: "/profile"     },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/80 backdrop-blur-md border-b border-[#E8E5E0] sticky top-0 z-50"
      classNames={{
        wrapper: "max-w-5xl mx-auto px-5",
        base: "shadow-none",
      }}
      maxWidth="full"
      isBordered={false}
    >
      {/* Logo + hamburger */}
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden text-[#6B6960]"
        />
        <NavbarBrand>
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="w-7 h-7 rounded-md bg-[#E2654A] flex items-center justify-center text-white text-xs font-bold shrink-0">
              P
            </span>
            <span className="font-display text-lg text-[#1A1A18] leading-none">
              Promptly
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop links */}
      <NavbarContent className="hidden sm:flex gap-0" justify="center">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <NavbarItem key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  active
                    ? "text-[#E2654A]"
                    : "text-[#6B6960] hover:text-[#E2654A] hover:bg-[#FDF0ED]"
                }`}
              >
                {link.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* CTA + Avatar */}
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <Button
            as={Link}
            href="/lesson"
            size="sm"
            className="hidden sm:flex font-semibold bg-[#E2654A] text-white rounded-xl hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 border-0 px-4"
          >
            Empezar →
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/profile"
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-150 border-2 ${
              pathname === "/profile"
                ? "bg-[#E2654A] text-white border-[#E2654A]"
                : "bg-[#FDF0ED] text-[#E2654A] border-[#E2654A]/30 hover:border-[#E2654A]"
            }`}
            aria-label="Ver perfil"
          >
            DF
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-white/95 backdrop-blur-md border-t border-[#E8E5E0] pt-4 gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <NavbarMenuItem key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full px-4 py-3 text-base font-medium rounded-xl transition-colors duration-150 min-h-[44px] flex items-center ${
                  active
                    ? "text-[#E2654A] bg-[#FDF0ED]"
                    : "text-[#6B6960] hover:text-[#E2654A] hover:bg-[#FDF0ED]"
                }`}
              >
                {link.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
        <NavbarMenuItem className="pt-3 mt-2 border-t border-[#E8E5E0]">
          <Button
            as={Link}
            href="/lesson"
            onClick={() => setIsMenuOpen(false)}
            fullWidth
            className="font-semibold bg-[#E2654A] text-white rounded-xl hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 border-0"
          >
            Empezar →
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

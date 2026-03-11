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
import { useState } from "react";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Lecciones", href: "/lessons" },
  { label: "Sandbox", href: "/sandbox" },
  { label: "Clasificación", href: "/leaderboard" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-black/40 backdrop-blur-xl border-b border-white/5"
      maxWidth="xl"
      isBordered={false}
    >
      {/* Logo */}
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMenuOpen(false)}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-lg shadow-lg shadow-violet-500/40">
              ⚡
            </span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              Promptly
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Links */}
      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        {links.map((link) => (
          <NavbarItem key={link.href}>
            <Link
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* CTA */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="/lesson"
            color="secondary"
            variant="solid"
            size="sm"
            className="hidden sm:flex font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30"
            endContent={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            }
          >
            Empezar
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/95 pt-4 gap-2">
        {links.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block w-full px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="pt-2 mt-2 border-t border-white/5">
          <Button
            as={Link}
            href="/lesson"
            onClick={() => setIsMenuOpen(false)}
            fullWidth
            color="secondary"
            className="font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white"
          >
            Empezar →
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

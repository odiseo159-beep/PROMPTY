"use client";

import Link from "next/link";
import { useState } from "react";

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { label: "Inicio", href: "/" },
        { label: "Lecciones", href: "/lessons" },
        { label: "Sandbox", href: "/sandbox" },
        { label: "Clasificación", href: "/leaderboard" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0d0d1a]/80 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight hover:opacity-90 transition-opacity"
                    onClick={() => setIsOpen(false)}
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-lg shadow-lg shadow-violet-500/40">
                        ⚡
                    </span>
                    <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                        Promptly
                    </span>
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
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

                {/* Desktop CTA & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/lesson"
                        className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-150 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 hover:-translate-y-px active:translate-y-0"
                    >
                        Empezar
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </Link>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        aria-label="Abrir menú"
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden border-t border-white/5 bg-[#0d0d1a] px-6 py-4 absolute w-full shadow-xl">
                    <ul className="flex flex-col gap-2">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-2 mt-2 border-t border-white/5">
                            <Link
                                href="/lesson"
                                onClick={() => setIsOpen(false)}
                                className="flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-base font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500"
                            >
                                Empezar
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

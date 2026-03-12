"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FDF0ED] flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E2654A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 className="font-display text-4xl text-[#1A1A18] mb-3">Página no encontrada</h1>
      <p className="text-[#6B6960] text-lg mb-8 max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="bg-[#E2654A] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-xl bg-[#E2654A] flex items-center justify-center text-white font-bold text-sm shrink-0">
            P
          </span>
          <span className="font-display text-2xl text-[#1A1A18]">Promptly</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E5E0] rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl text-[#1A1A18] mb-1 text-center">
            Bienvenido de vuelta
          </h1>
          <p className="text-[#6B6960] text-sm text-center mb-6">
            Continúa tu camino en prompt engineering
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] bg-[#FAFAF8] text-[#1A1A18] placeholder:text-[#9C9890] text-sm outline-none focus:border-[#E2654A] focus:ring-2 focus:ring-[#E2654A]/20 transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] bg-[#FAFAF8] text-[#1A1A18] placeholder:text-[#9C9890] text-sm outline-none focus:border-[#E2654A] focus:ring-2 focus:ring-[#E2654A]/20 transition-all duration-150"
              />
            </div>

            <Button
              onPress={() => router.push("/profile")}
              fullWidth
              className="bg-[#E2654A] text-white rounded-xl font-semibold hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 border-0 py-6"
            >
              Iniciar sesión
            </Button>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-[#6B6960] hover:text-[#E2654A] transition-colors duration-150">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-[#6B6960] mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/" className="text-[#E2654A] font-medium hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

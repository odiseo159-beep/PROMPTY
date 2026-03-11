# Promptly – Guía de Proyecto para Claude

## Stack Técnico

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **UI Library**: **HeroUI** (`@heroui/react`) — librería principal de componentes UI
- **Styling**: Tailwind CSS v4 (configuración CSS-based en `globals.css`)
- **Animaciones**: Framer Motion
- **Estado global**: Zustand + persist (`store/useProgressStore.ts`)
- **Auth / DB**: Supabase SSR (`@supabase/ssr`)
- **IA**: Anthropic SDK (`@anthropic-ai/sdk`)
- **Lenguaje**: TypeScript strict

## Configuración HeroUI

HeroUI **no usa `@plugin`** en Tailwind v4 (incompatible — exporta objeto nombrado `{ heroui }`, no función directa).
La configuración correcta en `app/globals.css` es:

```css
@import "tailwindcss";
@source "../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}";
```

El provider vive en `app/providers.tsx` (Client Component) y se carga en `app/layout.tsx`.
El dark mode se activa por defecto con `className="dark"` en el `<html>`.

## Estructura de Archivos Clave

```
app/
  layout.tsx          — RootLayout con <Providers>
  providers.tsx       — HeroUIProvider (client component)
  globals.css         — Tailwind v4 + source HeroUI
  page.tsx            — Landing page
  lesson/page.tsx     — Motor de lecciones (7 tipos de ejercicio)
  lessons/page.tsx    — Currículo de lecciones
  dashboard/page.tsx  — Panel de usuario
  sandbox/page.tsx    — Sandbox de prompts
  leaderboard/page.tsx — Clasificación
  api/evaluate/route.ts — API Anthropic para evaluar prompts

components/
  Navigation.tsx      — Navbar principal (HeroUI Navbar)
  exercises/
    TrueFalseComponent.tsx
    QuizComponent.tsx
    PromptDropZone.tsx

store/
  useProgressStore.ts — Zustand store (XP, nivel, streaks, lecciones)

proxy.ts              — Next.js 16 middleware (Supabase session)
utils/supabase/       — Helpers Supabase (client, server, middleware)
```

## Convenciones

- **Idioma UI**: Español neutro, tono amigable/gamificado (estilo Duolingo)
- **Dark mode**: Siempre activo por defecto (`dark` class en `<html>`)
- **Componentes HeroUI**: Usar props semánticas (`color="primary"`, `variant="flat"`) en lugar de clases Tailwind custom cuando sea posible
- **Middleware**: `proxy.ts` exporta `proxy` (no `middleware`) — convención Next.js 16
- **Path alias**: `@/*` apunta a la raíz del repo (`./*` en tsconfig)
- **Ejercicios SELF_CONTAINED**: tipos `["chat", "concept", "audio", "story"]` manejan su propio feedback sin el footer global

## 🎨 Sistema de Diseño — Identidad Visual Prompty

### Filosofía
Prompty NO es una app corporativa. Es una experiencia gamificada estilo Duolingo — debe sentirse DIVERTIDA, recompensante, y adictiva. Cada interacción debe tener personalidad y feedback táctil.

### Dirección Estética: "Neon Arcade meets Modern Learning"
- Dark mode como base (bg-[#0a0a0f])
- Colores neón vibrantes con propósito (no decorativos)
- Profundidad con glassmorphism sutil y sombras con color
- Micro-interacciones que recompensan cada acción
- Tipografía con personalidad, no genérica

### Paleta de Colores (HeroUI tokens + custom)
- **Primary**: Violet-500 (#8b5cf6) — acciones principales, CTAs
- **Secondary**: Fuchsia-500 (#d946ef) — acentos, highlights
- **Success**: Emerald-400 (#34d399) — respuestas correctas, XP ganado
- **Warning**: Amber-400 (#fbbf24) — streaks, rankings
- **Danger**: Rose-500 (#f43f5e) — errores, respuestas incorrectas
- **Cyan**: Cyan-400 (#22d3ee) — elementos informativos, tips
- **Surfaces**: white/[0.04] a white/[0.08] para cards sobre dark bg

### Tipografía
- NUNCA usar Inter, Roboto, Arial, o system fonts como fuente principal visible
- Headings: Usar fuente display con personalidad via next/font/google
- Body: Sans-serif legible con carácter (Plus Jakarta Sans, DM Sans, Outfit)
- Emojis como iconografía: permitido para el tono gamificado
- Tamaño mínimo body en móvil: 16px (text-base)

### Botones — Estilo "3D Pressable" (patrón existente, mantener)
```css
shadow-[0_6px_0_<dark-color>]
hover:shadow-[0_3px_0_<dark-color>] hover:translate-y-[3px]
active:shadow-[0_1px_0_<dark-color>] active:translate-y-[5px]
transition-all duration-100
```

### Cards
- Background: bg-white/[0.04] con border border-white/8
- Backdrop blur sutil: backdrop-blur-sm
- NUNCA Cards con fondo blanco sólido
- Hover states: white/[0.08] + scale sutil

### Animaciones (Framer Motion)
- Entry: fadeUp con spring (stiffness 260, damping 20)
- Stagger: delay incremental de 0.1-0.12s
- PopIn para rankings: scale 0.88 → 1
- SIEMPRE viewport={{ once: true }} en whileInView
- Transiciones: 150-300ms

### Backgrounds
- Glow blobs con blur-[90px] a blur-[140px]
- Colores: violet-600/25, fuchsia-600/20, cyan-500/15
- NUNCA fondo blanco o gris sólido

## 📱 Reglas Mobile-First OBLIGATORIAS

- SIEMPRE diseñar primero para móvil, luego escalar
- Clases sin prefijo = MOBILE. md: y lg: = pantallas más grandes
- flex flex-col por defecto → md:flex-row para desktop
- Touch targets mínimo 44×44px (p-3 mínimo en interactivos)
- Botones: w-full en móvil → sm:w-auto en desktop
- Body text mínimo text-base (16px) en móvil
- Headings: text-3xl sm:text-4xl lg:text-5xl
- NUNCA anchos fijos en px para containers
- NUNCA horizontal overflow
- Padding: px-4 móvil → px-6 md:px-8 desktop

## 🚫 Anti-Patrones (NUNCA HACER)

- NUNCA Inter, Roboto, Arial, Space Grotesk como fuente principal
- NUNCA gradientes purple-on-white genéricos
- NUNCA card grids simétricos sin variación
- NUNCA fondos blancos/grises sólidos
- NUNCA componentes sin hover/active/focus states
- NUNCA texto < 16px para contenido principal en móvil
- NUNCA layouts solo-desktop
- NUNCA botones sin feedback visual
- NUNCA instalar shadcn/ui — usamos HeroUI exclusivamente

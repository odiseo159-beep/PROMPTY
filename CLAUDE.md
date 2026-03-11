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

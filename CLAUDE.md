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
- **Light mode**: Diseño en light mode (#FAFAF8 base). Sin clase `dark` en `<html>`.
- **Componentes HeroUI**: Usar props semánticas (`color="primary"`, `variant="flat"`) en lugar de clases Tailwind custom cuando sea posible
- **Middleware**: `proxy.ts` exporta `proxy` (no `middleware`) — convención Next.js 16
- **Path alias**: `@/*` apunta a la raíz del repo (`./*` en tsconfig)
- **Ejercicios SELF_CONTAINED**: tipos `["chat", "concept", "audio", "story"]` manejan su propio feedback sin el footer global

## Sistema de Diseño — Nueva Dirección Visual

### El problema actual
El diseño actual se ve "generado por AI" — gradientes neón violet/fuchsia, glow blobs, fondo negro puro, emojis como iconos. Esto es exactamente lo que queremos ELIMINAR.

### Nueva dirección: "Warm Editorial Education"
Inspiración: la limpieza de Claude Desktop, la calidez de Notion, la claridad de Linear. Pero adaptado para una app educativa gamificada.

Principios:
1. **Limpio, no vacío** — Espacio blanco generoso pero con propósito
2. **Cálido, no frío** — Tonos warm en vez de neón fríos
3. **Marcado, no genérico** — Una paleta de 2 colores que se siente "Promptly"
4. **Contenido primero** — El diseño sirve al contenido, no compite con él
5. **Refinado, no llamativo** — La calidad se nota en los detalles sutiles

### Paleta de Colores (MÁXIMO 2 colores principales + neutrales)

**Color principal: un tono terracotta/warm coral**
- Primary: #E2654A (terracotta cálido — CTAs, acentos, brand)
- Primary hover: #C9553D
- Primary light: #FDF0ED (backgrounds sutiles)

**Color secundario: un teal/sage profundo**
- Secondary: #2D6A6A (teal oscuro — elementos secundarios, contraste)
- Secondary light: #EFF6F6

**Neutrales warm (NO grises puros):**
- Background: #FAFAF8 (off-white cálido, NO blanco puro #fff)
- Surface: #FFFFFF (cards)
- Border: #E8E5E0 (warm gray border)
- Text primary: #1A1A18 (casi negro pero warm)
- Text secondary: #6B6960 (gris warm)
- Text muted: #9C9890

**Dark mode (opcional futuro, NO ahora):**
Por ahora el diseño es LIGHT MODE. El dark mode actual con negro puro y neón es exactamente lo que se ve "AI". Cambiamos a light mode limpio.

### Tipografía
- Display/Headings: **DM Serif Display** o **Fraunces** (serif con personalidad, NO sans-serif genérica)
- Body: **DM Sans** o **Plus Jakarta Sans** (sans limpia y moderna)
- Monospace (para código/prompts): **JetBrains Mono**
- NUNCA: Inter, Roboto, Arial, Space Grotesk
- Font weights: headings 700, subheadings 600, body 400, emphasis 500
- Letter-spacing: -0.02em en headings grandes (tight), normal en body

### Botones
ELIMINAR el patrón "3D arcade" con sombras grandes. Nuevo estilo:
- Primary: bg-[#E2654A] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#C9553D] transition-colors duration-150
- Secondary: bg-transparent border-2 border-[#E8E5E0] text-[#1A1A18] rounded-xl px-6 py-3 font-semibold hover:border-[#E2654A] hover:text-[#E2654A] transition-colors duration-150
- Ghost: bg-transparent text-[#6B6960] hover:text-[#1A1A18] hover:bg-[#F5F4F0] rounded-xl px-4 py-2
- Todos con focus:ring-2 focus:ring-[#E2654A]/30
- Feedback sutil: active:scale-[0.98] transition-transform

### Cards
- Background: #FFFFFF
- Border: 1px solid #E8E5E0
- Border-radius: rounded-2xl (16px)
- Shadow: shadow-sm (sutil, NO dramático)
- Hover: shadow-md + border-[#D0CDC6] transition
- NUNCA: glassmorphism, backdrop-blur, bg-white/[0.04], glow effects
- Padding interno generoso: p-6 o p-8

### Iconos
- ELIMINAR emojis como iconos principales (📖 🎮 🏆 ⚡)
- Usar SVG icons simples (lucide-react o heroicons)
- Si no están instalados, usar caracteres simples o crear SVG inline
- Estilo: stroke de 1.5-2px, color monocromático
- Los emojis están PERMITIDOS solo en contextos muy específicos de gamificación (ej: 🔥 para streaks) pero NO como iconografía principal

### Backgrounds
- ELIMINAR todos los glow blobs, gradient meshes, noise textures
- Fondo principal: #FAFAF8 sólido
- Secciones alternadas: #FAFAF8 y #FFFFFF para crear ritmo
- Si necesitas decoración: formas geométricas sutiles en #F0EDE8 o el patrón de dots/grid muy sutil
- NUNCA: fondo negro, fondo dark, neón, blurs decorativos

### Animaciones
- REDUCIR drásticamente. Menos es más.
- Entrada de página: solo un fade-in suave (opacity 0→1, duration 400ms)
- NO stagger de 12 elementos individualmente — es patrón AI
- Hover: transition-colors y transition-shadow, 150ms
- Botones: active:scale-[0.98] es suficiente
- Scroll animations: MÁXIMO fade-in cuando entra al viewport, nada más
- ELIMINAR: spring physics exageradas, popIn, scale animations dramáticas

### Espaciado
- Generoso. Las secciones respiran.
- Entre secciones: py-20 sm:py-28
- Entre heading y contenido: mb-4 a mb-6
- Gap en grids: gap-4 a gap-6
- Padding de página: px-5 sm:px-8 max-w-5xl mx-auto

### Gamificación Visual (cómo mantener lo educativo sin verse AI)
- XP y niveles: badges minimalistas con el color primary, no neón
- Progress bars: finas (h-2), rounded-full, color primary
- Leaderboard: tabla limpia con buen spacing, el #1 se distingue con un subtle bg-primary/5 y un icono crown SVG, NO con glows
- Achievements: iconos SVG pequeños en círculos con borde, no emojis gigantes
- Streaks: chip/badge pequeño, color warm, texto "7 días 🔥"

## Mobile-First (mantener estas reglas)

- Diseñar primero para 375px, luego escalar
- flex flex-col → md:flex-row
- Touch targets >= 44px
- Body text >= 16px
- Botones w-full en móvil → sm:w-auto en desktop
- px-5 → sm:px-8
- NUNCA horizontal overflow

## Anti-Patrones (NUNCA HACER)

- NUNCA fondo oscuro/negro (estamos en light mode ahora)
- NUNCA glow blobs, blur decorativos, noise textures
- NUNCA gradientes neón (violet, fuchsia, cyan)
- NUNCA emojis como iconografía principal de secciones
- NUNCA animaciones spring exageradas con stagger
- NUNCA glassmorphism o bg-white/[0.04]
- NUNCA más de 2 colores principales + neutrales
- NUNCA tipografía sans-serif genérica en headings
- NUNCA el patrón de botón "3D arcade" con shadow offset
- NUNCA shadcn/ui — seguimos con HeroUI

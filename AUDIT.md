# Auditoría de Accesibilidad y Responsive — Promptly
**Fecha:** 2026-03-11
**Alcance:** `app/**/*.tsx`, `components/**/*.tsx`
**Estándar:** WCAG 2.1 AA, mobile-first 320px

---

## Resumen Ejecutivo

| Categoría | Crítico | Alto | Medio | Total |
|---|---|---|---|---|
| Touch Targets | 1 | 4 | 2 | 7 |
| Contraste WCAG AA | 0 | 3 | 2 | 5 |
| ARIA / Semántica | 2 | 3 | 1 | 6 |
| Jerarquía de Headings | 0 | 2 | 0 | 2 |
| Focus States | 0 | 4 | 1 | 5 |
| Responsive 320px | 0 | 0 | 1 | 1 |
| Tamaño de Texto Móvil | 0 | 2 | 2 | 4 |
| **TOTAL** | **3** | **18** | **9** | **30** |

---

## Hallazgos Detallados y Correcciones

### 1. Touch Targets < 44px

#### [CRÍTICO] `components/exercises/PromptDropZone.tsx` — ZonePill remove button
- **Problema:** `w-5 h-5` = 20×20px. Muy por debajo del mínimo WCAG de 44×44px.
- **Fix:** Botón con `min-w-[44px] min-h-[44px]` y visual interior como `<span>`. ✅ Corregido

#### [ALTO] `components/exercises/PromptDropZone.tsx` — "Reiniciar" button
- **Problema:** `text-xs` sin padding → ~20px de altura touch.
- **Fix:** `py-2 px-2 min-h-[44px] inline-flex items-center` ✅ Corregido

#### [ALTO] `app/sandbox/page.tsx` — "Limpiar" button
- **Problema:** `text-[11px]` sin padding → touch target ~16px.
- **Fix:** `min-h-[44px] flex items-center px-2` ✅ Corregido

#### [ALTO] `app/dashboard/page.tsx` — "Entrar al Sandbox" link
- **Problema:** `px-4 py-2` → 8+8+20 = ~36px de altura. Falta 8px.
- **Fix:** `py-3` → 12+12+20 = ~44px ✅ Corregido

#### [ALTO] `app/page.tsx` — Footer links
- **Problema:** Links sin padding vertical — touch target = line-height (~20px).
- **Fix:** `py-2 px-1` añadido. ✅ Corregido

#### [MEDIO] `app/lessons/page.tsx` — "Ir →" links en cards de pasos 2/3
- **Problema:** `text-sm` link sin altura mínima.
- **Fix:** `block py-2 px-1 min-h-[44px] flex items-center` ✅ Corregido

#### [MEDIO] `app/sandbox/page.tsx` — Template Chips con onClick
- **Problema:** HeroUI Chip renderiza como `<div>`, touch target variable.
- **Fix:** Añadido `role="button"` + `tabIndex={0}` + handler `onKeyDown` ✅ Corregido

---

### 2. Contraste WCAG AA

Referencia: Tailwind colors sobre `bg-[#0a0a0f]` / `bg-[#0d0d18]`:
| Color | Ratio estimado | Estado (AA normal ≥4.5:1) |
|---|---|---|
| `text-gray-400` (#9CA3AF) | ~7.9:1 | ✅ Pasa |
| `text-gray-500` (#6B7280) | ~4.5:1 | ✅ Pasa (límite) |
| `text-gray-600` (#4B5563) | ~2.9:1 | ❌ Falla |
| `text-gray-700` (#374151) | ~2.0:1 | ❌ Falla |

#### [ALTO] `app/sandbox/page.tsx` — Múltiples `text-gray-700` como contenido
- **Problema:** "Insertar plantilla:", hint text de templates, "sin guardar" → ratio ~2.0:1.
- **Fix:** `text-gray-700` → `text-gray-500` en todo el contenido visible. ✅ Corregido

#### [ALTO] `components/exercises/PromptDropZone.tsx` — "Reiniciar" button
- **Problema:** `text-gray-600` → ratio ~2.9:1. Falla AA para texto normal.
- **Fix:** → `text-gray-500` ✅ Corregido

#### [ALTO] `app/sandbox/page.tsx` — Hint text en IdlePanel templates
- **Problema:** `text-gray-700` en texto descriptivo de plantillas.
- **Fix:** → `text-gray-500` ✅ Corregido

#### [MEDIO] `app/lessons/page.tsx` — Lecciones bloqueadas `text-gray-700`
- **Problema:** Descripción de lecciones bloqueadas con opacity-35 encima.
- **Nota:** El bajo contraste es intencional (estado "bloqueado") pero el texto principal se sube a `text-gray-600`.
- **Fix:** `text-gray-700` → `text-gray-600` en estado locked. ✅ Corregido

#### [MEDIO] `app/leaderboard/page.tsx` — Footer note `text-xs text-gray-600`
- **Problema:** Texto muy pequeño (12px) con ratio ~2.9:1.
- **Fix:** → `text-gray-400` ✅ Corregido

---

### 3. ARIA / Semántica

#### [CRÍTICO] `components/exercises/PromptDropZone.tsx` — DropZone `<div>` con onClick
- **Problema:** Elemento `<motion.div>` con `onClick` sin `role`, `tabIndex`, ni handler de teclado. Inaccesible por teclado.
- **Fix:** Añadido `role="button"`, `tabIndex`, `onKeyDown` (Enter/Space), `aria-label`. ✅ Corregido

#### [CRÍTICO] `app/lesson/page.tsx` — Página sin `<h1>` visible o invisible
- **Problema:** El motor de lecciones no tiene `h1` de página. Todos los ejercicios usan `h2` internamente creando una jerarquía sin raíz.
- **Fix:** `<h1 className="sr-only">` añadido. ✅ Corregido

#### [ALTO] `app/lesson/page.tsx` — Audio play button sin `aria-label`
- **Problema:** `isIconOnly` Button con emoji "▶" / "🔊". Lectores de pantalla leen el emoji literalmente.
- **Fix:** `aria-label` dinámico añadido. ✅ Corregido

#### [ALTO] `app/leaderboard/page.tsx` — Trend icons sin descripción accesible
- **Problema:** `▲` `▼` `—` como spans sin contexto para screen readers.
- **Fix:** `aria-label="Subiendo"` / `"Bajando"` / `"Sin cambio"` añadidos. ✅ Corregido

#### [ALTO] `app/sandbox/page.tsx` — SVG gauge sin `aria-hidden`
- **Problema:** SVG decorativo en ResultPanel procesado por lectores de pantalla. La puntuación ya se presenta textualmente.
- **Fix:** `aria-hidden="true"` añadido al SVG. ✅ Corregido

#### [MEDIO] `app/leaderboard/page.tsx` — Tabla de rankings con grid CSS
- **Problema:** `grid-cols-12` sin elementos `<table>`, `<thead>`, `<th scope>`. Screen readers no asocian celdas con columnas.
- **Nota:** Requiere refactor estructural mayor. Documentado como deuda técnica, **no corregido en esta auditoría** para preservar diseño.

---

### 4. Jerarquía de Headings

#### [ALTO] `app/lessons/page.tsx` — Títulos de módulo como `<p>`
- **Problema:** `ModuleHeader` usa `<p>` para el título del módulo. La página tiene `h1` → (nada) → `h3` (lesson cards). Salto de nivel.
- **Fix:** `<p>` → `<h2>` para títulos de módulo. ✅ Corregido

#### [ALTO] `app/lesson/page.tsx` — Ausencia de `<h1>` (ver ARIA sección)
- **Fix:** `sr-only h1` añadido. ✅ Corregido

---

### 5. Focus States Visibles

#### [ALTO] `components/exercises/QuizComponent.tsx` — `motion.button` sin focus ring
- **Problema:** OptionCard usa `motion.button` sin `focus-visible:ring-*`. Teclado no muestra feedback.
- **Fix:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0f]` ✅ Corregido

#### [ALTO] `components/exercises/TrueFalseComponent.tsx` — `motion.button` sin focus ring
- **Mismo problema y fix que QuizComponent.** ✅ Corregido

#### [ALTO] `components/exercises/PromptDropZone.tsx` — BankPill sin focus ring
- **Fix:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1` ✅ Corregido

#### [ALTO] `app/lesson/page.tsx` — Botones de opción en Audio y Story sin focus ring
- **Problema:** Botones `<button>` nativos con solo estilos de hover. Teclado invisible.
- **Fix:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0f]` en ambos componentes. ✅ Corregido

#### [MEDIO] `app/sandbox/page.tsx` — "Limpiar" button sin focus ring
- **Fix:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md` ✅ Corregido

---

### 6. Sin Horizontal Overflow en 320px

#### [MEDIO] `app/dashboard/page.tsx` — Sin `overflow-x-hidden` en el body del contenido
- **Problema:** El body del layout tiene `overflow-x-hidden` pero el dashboard page usa `-translate-x-1/2` en el blob decorativo que puede provocar overflow lateral en 320px.
- **Fix:** Añadido `overflow-x-hidden` al contenedor principal de dashboard. ✅ Corregido

---

### 7. Texto ≥ 16px para Contenido Principal en Móvil

#### [ALTO] `app/lessons/page.tsx` — Descripción de lecciones `text-sm` (14px)
- **Problema:** El texto descriptivo de cada lección — contenido principal — es `text-sm`.
- **Fix:** → `text-base` (16px). ✅ Corregido

#### [ALTO] `app/sandbox/page.tsx` — Respuesta de Claude `text-sm` (14px)
- **Problema:** El output principal de la IA es `text-sm`. Este es EL contenido central del sandbox.
- **Fix:** → `text-base` (16px). ✅ Corregido

#### [MEDIO] `app/sandbox/page.tsx` — Texto de sugerencias `text-sm`
- **Problema:** Sugerencias de mejora = contenido accionable principal = `text-sm`.
- **Fix:** → `text-base` ✅ Corregido

#### [MEDIO] `app/lesson/page.tsx` — Texto de InlineFeedback `text-xs` (12px)
- **Problema:** La explicación teórica de por qué la respuesta es incorrecta es `text-xs`. Es contenido de aprendizaje, no metadata.
- **Fix:** → `text-sm` (mejora parcial; texto secundario de feedback, no el contenido primario). ✅ Corregido

---

## Elementos Verificados Sin Cambios Necesarios

| Archivo | Elemento | Estado |
|---|---|---|
| `components/Navigation.tsx` | `NavbarMenuToggle` | ✅ Tiene `aria-label` dinámico |
| `components/Navigation.tsx` | Mobile menu links | ✅ `py-3` = ~44px touch target |
| `app/lesson/page.tsx` | Exit button | ✅ `aria-label="Salir de la lección"` |
| `app/lesson/page.tsx` | Progress bar | ✅ `aria-label="Progreso de la lección"` |
| `app/lesson/page.tsx` | Quiz option buttons | ✅ `py-4 min-h-[80px]` |
| `app/lesson/page.tsx` | TrueFalse cards | ✅ `min-h-[120px]` |
| `components/exercises/PromptDropZone.tsx` | ZonePill remove | Tenía `aria-label` ✅ (touch target corregido) |
| `app/page.tsx` | Hero CTAs | ✅ `w-full` + `size="lg"` |
| `app/sandbox/page.tsx` | Evaluar button | ✅ HeroUI Button `size="sm"` con min-h |
| `app/lessons/page.tsx` | Progress bars | ✅ Tienen `aria-label` |
| `app/sandbox/page.tsx` | Textarea | ✅ HeroUI Textarea con `aria` heredado |
| `app/layout.tsx` | `lang="es"` | ✅ Definido |
| `app/layout.tsx` | `dark` class | ✅ Consistente |

---

## Deuda Técnica (No Corregida — Requiere Refactor Mayor)

1. **`app/leaderboard/page.tsx`** — Grid CSS como tabla: debería migrarse a `<table>` semántica con `scope`, `thead`, `tbody`.
2. **`app/dashboard/page.tsx`** — Misiones diarias sin lista semántica: usar `<ul>/<li>` en vez de divs genéricos.
3. **`app/lesson/page.tsx`** — Chat mensajes sin `role="log"` ni `aria-live`: el contenido del chat debería tener `aria-live="polite"`.

---

*Auditoría realizada por Claude Sonnet 4.6 · Promptly v2.0*

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PromptPiece {
  id: string;
  label: string;
  icon: string;
  color: "emerald" | "violet" | "sky" | "amber" | "rose" | "fuchsia";
  example: string;
}

export interface PromptDropZoneProps {
  pieces?: PromptPiece[];
  correctOrder?: string[];
  onPlacedChange?: (placedIds: string[]) => void;
  isChecked?: boolean;
}

// ── Default exercise data ──────────────────────────────────────────────────────

const DEFAULT_PIECES: PromptPiece[] = [
  {
    id: "role",
    label: "Rol",
    icon: "🎭",
    color: "emerald",
    example: "Eres un redactor experto…",
  },
  {
    id: "context",
    label: "Contexto",
    icon: "📄",
    color: "sky",
    example: "La audiencia son principiantes en IA…",
  },
  {
    id: "task",
    label: "Tarea",
    icon: "✅",
    color: "violet",
    example: "Escribe una explicación de 3 frases sobre…",
  },
  {
    id: "format",
    label: "Formato",
    icon: "📋",
    color: "amber",
    example: "Usa viñetas, máximo 100 palabras…",
  },
  {
    id: "tone",
    label: "Tono",
    icon: "🎨",
    color: "rose",
    example: "Mantén un tono amigable y claro…",
  },
];

const DEFAULT_CORRECT_ORDER = ["role", "context", "task", "format", "tone"];

// ── Color maps ─────────────────────────────────────────────────────────────────

const COLOR = {
  emerald: {
    border: "border-[#2D6A6A]/50",
    bg:     "bg-[#EFF6F6]",
    text:   "text-[#2D6A6A]",
  },
  violet: {
    border: "border-[#E2654A]/50",
    bg:     "bg-[#FDF0ED]",
    text:   "text-[#E2654A]",
  },
  sky: {
    border: "border-sky-500/40",
    bg:     "bg-sky-50",
    text:   "text-sky-700",
  },
  amber: {
    border: "border-amber-500/40",
    bg:     "bg-amber-50",
    text:   "text-amber-700",
  },
  rose: {
    border: "border-rose-400/40",
    bg:     "bg-rose-50",
    text:   "text-rose-600",
  },
  fuchsia: {
    border: "border-fuchsia-500/40",
    bg:     "bg-fuchsia-50",
    text:   "text-fuchsia-700",
  },
} as const;

// ── Bank Pill ──────────────────────────────────────────────────────────────────

function BankPill({
  piece,
  isSelected,
  isDisabled,
  onTap,
}: {
  piece: PromptPiece;
  isSelected: boolean;
  isDisabled: boolean;
  onTap: () => void;
}) {
  const c = COLOR[piece.color];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      whileTap={!isDisabled ? { scale: 0.92 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      onClick={onTap}
      disabled={isDisabled}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-2xl border-2
        font-bold text-sm cursor-pointer select-none
        transition-all duration-150
        disabled:cursor-default
        min-h-[52px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] focus-visible:ring-offset-2 focus-visible:ring-offset-white
        ${isSelected
          ? `${c.border} ${c.bg} ${c.text} shadow-sm`
          : "border-[#E8E5E0] bg-white text-[#6B6960] hover:border-[#E8E5E0] hover:bg-[#FAFAF8]"
        }
      `}
    >
      <span className="text-base">{piece.icon}</span>
      <span>{piece.label}</span>
      {isSelected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 text-xs opacity-70"
        >
          ← toca aquí
        </motion.span>
      )}
    </motion.button>
  );
}

// ── Zone Pill ──────────────────────────────────────────────────────────────────

function ZonePill({
  piece,
  index,
  isChecked,
  isCorrect,
  onRemove,
}: {
  piece: PromptPiece;
  index: number;
  isChecked: boolean;
  isCorrect: boolean | null;
  onRemove: () => void;
}) {
  const c = COLOR[piece.color];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className="flex flex-col gap-1 min-w-[100px]"
    >
      <span className="text-[10px] font-bold text-[#9C9890] uppercase tracking-widest px-1">
        #{index + 1}
      </span>

      <div
        className={`
          relative flex items-center gap-2 px-4 py-3 rounded-2xl border-2
          font-bold text-sm select-none shadow-sm
          ${c.border} ${c.bg} ${c.text}
        `}
      >
        <span className="text-base">{piece.icon}</span>
        <span>{piece.label}</span>

        {!isChecked && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A]"
            aria-label={`Quitar ${piece.label}`}
          >
            <span className="w-5 h-5 rounded-full bg-black/[0.05] flex items-center justify-center text-[#6B6960] hover:text-[#1A1A18] text-xs pointer-events-none">✕</span>
          </button>
        )}

        {isChecked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 400 }}
            className={`ml-1 text-base ${isCorrect ? "text-[#2D6A6A]" : "text-[#E2654A]"}`}
          >
            {isCorrect ? "✓" : "✗"}
          </motion.span>
        )}
      </div>

      <p className={`text-[11px] leading-tight px-1 ${c.text} opacity-60 max-w-[120px]`}>
        {piece.example}
      </p>
    </motion.div>
  );
}

// ── Drop Zone ──────────────────────────────────────────────────────────────────

function DropZone({
  placed,
  isActive,
  isChecked,
  correctOrder,
  onTap,
  onRemove,
}: {
  placed: PromptPiece[];
  isActive: boolean;
  isChecked: boolean;
  correctOrder: string[];
  onTap: () => void;
  onRemove: (id: string) => void;
}) {
  const isEmpty = placed.length === 0;

  return (
    <motion.div
      onClick={isActive && !isChecked ? onTap : undefined}
      role={isActive && !isChecked ? "button" : undefined}
      tabIndex={isActive && !isChecked ? 0 : undefined}
      aria-label="Zona de ensamblaje — toca para colocar la pieza seleccionada"
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && isActive && !isChecked) {
          e.preventDefault();
          onTap();
        }
      }}
      animate={
        isActive
          ? { borderColor: ["rgba(226,101,74,0.3)", "rgba(226,101,74,0.8)", "rgba(226,101,74,0.3)"] }
          : { borderColor: "rgba(232,229,224,1)" }
      }
      transition={isActive ? { repeat: Infinity, duration: 1.6 } : {}}
      className={`
        relative w-full min-h-[140px] rounded-2xl border-2 border-dashed p-4
        transition-all duration-200
        ${isActive && !isChecked
          ? "bg-[#FDF0ED]/40 cursor-pointer"
          : "bg-[#FAFAF8]"
        }
      `}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[#E2654A] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#9C9890]">
          Zona de Ensamblaje — Tu Prompt
        </span>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-16">
          <p className="text-[#9C9890] text-sm text-center">
            {isActive
              ? "Toca aquí para colocar la pieza seleccionada ↓"
              : "Selecciona una pieza y toca aquí para colocarla"}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {placed.map((piece, i) => {
              const isCorrectPos = correctOrder[i] === piece.id;
              return (
                <ZonePill
                  key={piece.id}
                  piece={piece}
                  index={i}
                  isChecked={isChecked}
                  isCorrect={isChecked ? isCorrectPos : null}
                  onRemove={() => onRemove(piece.id)}
                />
              );
            })}
          </AnimatePresence>

          {isActive && !isChecked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center self-center"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[#E2654A]/50 flex items-center justify-center text-[#E2654A]/70 text-lg">
                +
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function PromptDropZone({
  pieces = DEFAULT_PIECES,
  correctOrder = DEFAULT_CORRECT_ORDER,
  onPlacedChange,
  isChecked = false,
}: PromptDropZoneProps) {
  const [bank, setBank]           = useState<PromptPiece[]>(pieces);
  const [zone, setZone]           = useState<PromptPiece[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const placedIds      = zone.map((p) => p.id);
  const isFullyPlaced  = placedIds.length === pieces.length;
  const isOrderCorrect =
    isFullyPlaced && placedIds.every((id, i) => correctOrder[i] === id);

  const handleBankTap = useCallback(
    (id: string) => {
      if (isChecked) return;
      setSelectedId((prev) => (prev === id ? null : id));
    },
    [isChecked]
  );

  const handleZoneTap = useCallback(() => {
    if (!selectedId || isChecked) return;
    const piece = bank.find((p) => p.id === selectedId);
    if (!piece) return;
    const newZone = [...zone, piece];
    setBank((prev) => prev.filter((p) => p.id !== selectedId));
    setZone(newZone);
    setSelectedId(null);
    onPlacedChange?.(newZone.map((p) => p.id));
  }, [selectedId, bank, zone, isChecked, onPlacedChange]);

  const handleRemoveFromZone = useCallback(
    (id: string) => {
      if (isChecked) return;
      const piece = zone.find((p) => p.id === id);
      if (!piece) return;
      const newZone = zone.filter((p) => p.id !== id);
      setZone(newZone);
      setBank((prev) => [...prev, piece]);
      if (selectedId === id) setSelectedId(null);
      onPlacedChange?.(newZone.map((p) => p.id));
    },
    [zone, isChecked, selectedId, onPlacedChange]
  );

  const handleReset = useCallback(() => {
    setBank(pieces);
    setZone([]);
    setSelectedId(null);
    onPlacedChange?.([]);
  }, [pieces, onPlacedChange]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h2 className="text-[#1A1A18] text-2xl font-bold leading-snug mb-1">
          Anatomía de un Prompt
        </h2>
        <p className="text-[#6B6960] text-sm">
          Toca cada pieza en el orden correcto para construir un prompt bien estructurado.
        </p>
      </div>

      <DropZone
        placed={zone}
        isActive={selectedId !== null}
        isChecked={isChecked}
        correctOrder={correctOrder}
        onTap={handleZoneTap}
        onRemove={handleRemoveFromZone}
      />

      <AnimatePresence>
        {isChecked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
              isOrderCorrect
                ? "bg-[#EFF6F6] border-[#2D6A6A]/40 text-[#2D6A6A]"
                : "bg-[#FDF0ED] border-[#E2654A]/40 text-[#E2654A]"
            }`}
          >
            <span className="text-xl">{isOrderCorrect ? "🏆" : "💡"}</span>
            <p className="text-sm font-semibold">
              {isOrderCorrect
                ? "¡Orden perfecto! Así se estructura un gran prompt."
                : `Orden correcto: ${correctOrder
                    .map((id) => pieces.find((p) => p.id === id)?.label)
                    .filter(Boolean)
                    .join(" → ")}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9C9890]">
            Banco de Piezas
          </span>
          {zone.length > 0 && !isChecked && (
            <button
              onClick={handleReset}
              className="text-xs text-[#6B6960] hover:text-[#1A1A18] underline underline-offset-2 transition-colors py-2 px-2 min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] rounded-md"
            >
              Reiniciar
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {bank.map((piece) => (
              <BankPill
                key={piece.id}
                piece={piece}
                isSelected={selectedId === piece.id}
                isDisabled={isChecked}
                onTap={() => handleBankTap(piece.id)}
              />
            ))}
          </AnimatePresence>

          {bank.length === 0 && !isChecked && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#9C9890] text-sm italic"
            >
              ¡Todas las piezas colocadas! Comprueba tu respuesta.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

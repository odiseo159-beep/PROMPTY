"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QuizComponent, type QuizOption } from "@/components/exercises/QuizComponent";
import { TrueFalseComponent } from "@/components/exercises/TrueFalseComponent";
import { PromptDropZone } from "@/components/exercises/PromptDropZone";

// ── Types ──────────────────────────────────────────────────────────────────────

type LessonState = "idle" | "correct" | "incorrect" | "finished";

type QuizExercise = {
  type: "quiz";
  question: string;
  options: QuizOption[];
  correctId: string;
  theoryExplanation?: string;
};

type TrueFalseExercise = {
  type: "truefalse";
  question: string;
  correctId: "true" | "false";
  theoryExplanation?: string;
};

type DropZoneExercise = {
  type: "dropzone";
  question: string;
};

type ChatMessage = { from: "bot" | "user"; text: string };
type ChatExercise = {
  type: "chat";
  messages: ChatMessage[];
  replyLabel: string;
};

type ConceptExercise = {
  type: "concept";
  emoji: string;
  title: string;
  body: string;
};

type AudioExercise = {
  type: "audio";
  speakerLabel: string;
  transcript: string;
  question: string;
  options: QuizOption[];
  correctId: string;
  theoryExplanation?: string;
};

type StoryLine = { speaker?: string; text: string };
type StoryExercise = {
  type: "story";
  lines: StoryLine[];
  question: string;
  options: QuizOption[];
  correctId: string;
  theoryExplanation?: string;
};

type Exercise =
  | ChatExercise
  | ConceptExercise
  | AudioExercise
  | StoryExercise
  | QuizExercise
  | TrueFalseExercise
  | DropZoneExercise;

const SELF_CONTAINED: Exercise["type"][] = ["chat", "concept", "audio", "story"];

// ── Ejercicios ─────────────────────────────────────────────────────────────────

const EXERCISES: Exercise[] = [
  // 1 ── Chat de bienvenida
  {
    type: "chat",
    messages: [
      { from: "bot", text: "¡Hola! 👋 Soy Promptly, tu tutor de IA." },
      {
        from: "bot",
        text: "Primera lección: todo gran prompt empieza con un **Rol**. Dile a la IA *quién* debe ser — y observa la magia. 🎭",
      },
    ],
    replyLabel: "¡Entendido! A practicar →",
  },

  // 2 ── Ficha conceptual: Few-Shot Prompting
  {
    type: "concept",
    emoji: "🎯",
    title: "Few-Shot Prompting",
    body: "Le das a la IA 2–5 ejemplos de entrada/salida dentro del prompt. El modelo aprende el patrón sin ningún fine-tuning — solo a partir del contexto.",
  },

  // 3 ── Quiz: instrucción de rol
  {
    type: "quiz",
    question: "¿Qué parte de un prompt le indica a la IA qué rol asumir?",
    correctId: "b",
    theoryExplanation:
      "Una instrucción de Rol limita el vocabulario y el estilo de razonamiento del modelo para que coincida con el de un experto, mejorando considerablemente la calidad y relevancia de la respuesta.",
    options: [
      { id: "a", text: "El bloque de contexto", icon: "📄" },
      { id: "b", text: "La instrucción de sistema / rol", icon: "🎭" },
      { id: "c", text: "El formato de salida", icon: "📋" },
      { id: "d", text: "La configuración de temperatura", icon: "🌡️" },
    ],
  },

  // 4 ── Audio: alucinaciones
  {
    type: "audio",
    speakerLabel: "Prof. Ada · Seguridad en IA",
    transcript:
      "Cuando un modelo de lenguaje afirma con confianza algo falso, lo llamamos alucinación. Ocurre porque el modelo predice tokens que suenan plausibles — no hechos verificados. Ancla siempre tus prompts con contexto real para reducir este riesgo.",
    question: "¿Qué causa las alucinaciones de la IA?",
    correctId: "b",
    theoryExplanation:
      "Los modelos no recuperan hechos — predicen continuaciones plausibles. Proporcionar contexto factual en el prompt actúa como ancla y reduce drásticamente las alucinaciones.",
    options: [
      { id: "a", text: "El modelo miente intencionalmente", icon: "🤥" },
      { id: "b", text: "Predice tokens plausibles, no hechos verificados", icon: "🎲" },
      { id: "c", text: "La temperatura es demasiado baja", icon: "🌡️" },
      { id: "d", text: "El prompt era demasiado corto", icon: "📏" },
    ],
  },

  // 5 ── Verdadero/Falso: verbosidad
  {
    type: "truefalse",
    question: "Añadir más palabras a un prompt siempre produce una mejor respuesta de la IA.",
    correctId: "false",
    theoryExplanation:
      "La verbosidad suele confundir al modelo. Los prompts concisos y específicos superan a los extensos porque cada token compite por la atención del modelo.",
  },

  // 6 ── Historia: María y la IA alucinando
  {
    type: "story",
    lines: [
      { speaker: "Narrador", text: "María necesita escribir un informe sobre política climática. 📄" },
      { speaker: "María", text: "\"IA, escríbeme un informe sobre las actualizaciones del Acuerdo de París de 2023.\"" },
      { speaker: "IA", text: "\"¡Claro! En 2023, el Acuerdo de París fue enmendado para exigir que todas las naciones alcancen la neutralidad de carbono en 2027...\"" },
      { speaker: "Narrador", text: "María entrega el informe. Su profesor lo marca como incorrecto — ese plazo no existe. 😬" },
      { speaker: "Narrador", text: "La IA alucinó un hecho porque María no proporcionó contexto de anclaje." },
    ],
    question: "¿Qué debería haber hecho María de forma diferente?",
    correctId: "c",
    theoryExplanation:
      "Anclar los prompts con documentos reales o hechos verificados evita que el modelo invente información que suena plausible pero es falsa.",
    options: [
      { id: "a", text: "Pedirle a la IA que fuera más breve", icon: "✂️" },
      { id: "b", text: "Usar un modelo de IA diferente", icon: "🤖" },
      { id: "c", text: "Proporcionar documentos fuente reales como contexto", icon: "📎" },
      { id: "d", text: "Bajar la configuración de temperatura", icon: "🌡️" },
    ],
  },

  // 7 ── Quiz: temperatura
  {
    type: "quiz",
    question: "¿Qué controla la 'temperatura' en un modelo de lenguaje?",
    correctId: "c",
    theoryExplanation:
      "La temperatura escala la distribución de probabilidad sobre los tokens. Valores bajos (≈0) hacen las salidas deterministas; valores altos (≈1+) aumentan la creatividad pero también las alucinaciones.",
    options: [
      { id: "a", text: "La velocidad de la respuesta", icon: "⚡" },
      { id: "b", text: "La longitud de la salida", icon: "📏" },
      { id: "c", text: "La aleatoriedad / creatividad", icon: "🎲" },
      { id: "d", text: "El idioma utilizado", icon: "🌐" },
    ],
  },

  // 8 ── Verdadero/Falso: few-shot
  {
    type: "truefalse",
    question:
      "El few-shot prompting consiste en proporcionar ejemplos dentro de tu prompt para que el modelo aprenda el patrón.",
    correctId: "true",
    theoryExplanation:
      "El few-shot prompting aprovecha el aprendizaje en contexto. Al mostrar al modelo 2–5 ejemplos de entrada/salida, orientas su estilo de completado sin cambiar los pesos del modelo.",
  },

  // 9 ── Dropzone
  {
    type: "dropzone",
    question: "Ordena las piezas para construir una estructura de prompt perfecta.",
  },

  // 10 ── Quiz: chain-of-thought
  {
    type: "quiz",
    question: "¿Qué técnica descompone una tarea difícil en pasos de razonamiento más pequeños?",
    correctId: "a",
    theoryExplanation:
      "El prompting de Cadena de Pensamiento (CoT) elicita razonamiento paso a paso, permitiendo al modelo dedicar más cómputo a subproblemas difíciles antes de comprometerse con una respuesta final.",
    options: [
      { id: "a", text: "Prompting de Cadena de Pensamiento", icon: "🔗" },
      { id: "b", text: "Zero-shot prompting", icon: "🎯" },
      { id: "c", text: "Inyección de Prompt", icon: "💉" },
      { id: "d", text: "Fine-tuning", icon: "🛠️" },
    ],
  },
];

const TOTAL_STEPS = EXERCISES.length;

// ── Helpers compartidos ────────────────────────────────────────────────────────

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

function InlineFeedback({
  isCorrect,
  theoryExplanation,
}: {
  isCorrect: boolean;
  theoryExplanation?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full rounded-2xl px-4 py-3 ${
        isCorrect
          ? "bg-[#58cc02]/20 border border-[#58cc02]/40"
          : "bg-red-500/20 border border-red-500/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{isCorrect ? "✅" : "❌"}</span>
        <p className={`font-bold text-sm ${isCorrect ? "text-[#58cc02]" : "text-red-400"}`}>
          {isCorrect ? "¡Correcto!" : "Casi..."}
        </p>
      </div>
      {!isCorrect && theoryExplanation && (
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-2 text-xs text-gray-300 leading-relaxed overflow-hidden"
        >
          {theoryExplanation}
        </motion.p>
      )}
    </motion.div>
  );
}

function ProceedButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
      className="w-full min-h-[60px] rounded-2xl bg-[#58cc02] text-white font-extrabold text-base
        shadow-[0_6px_0_#389200] hover:shadow-[0_3px_0_#389200] hover:translate-y-[3px]
        active:shadow-[0_1px_0_#389200] active:translate-y-[5px]
        transition-all duration-100 select-none"
    >
      {label}
    </motion.button>
  );
}

// ── ConceptCardComponent ───────────────────────────────────────────────────────

function ConceptCardComponent({
  exercise,
  onComplete,
}: {
  exercise: ConceptExercise;
  onComplete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full bg-violet-500/25 blur-2xl" />
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="relative text-[80px] leading-none select-none"
        >
          {exercise.emoji}
        </motion.span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold text-white">{exercise.title}</h2>
        <p className="text-base text-gray-300 leading-relaxed max-w-sm mx-auto">{exercise.body}</p>
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">
        Ficha Conceptual
      </span>

      <ProceedButton label="¡Entendido! ✓" onClick={onComplete} />
    </motion.div>
  );
}

// ── AudioComponent ─────────────────────────────────────────────────────────────

const WAVEFORM_BARS = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.45, 0.75, 0.55, 0.95, 0.65];

function AudioComponent({
  exercise,
  onComplete,
  onWrongAnswer,
}: {
  exercise: AudioExercise;
  onComplete: () => void;
  onWrongAnswer: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [transcriptDone, setTranscriptDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    if (charIndex >= exercise.transcript.length) {
      setTranscriptDone(true);
      setIsPlaying(false);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCharIndex((c) => {
        if (c + 1 >= exercise.transcript.length) {
          clearInterval(intervalRef.current!);
          setTranscriptDone(true);
          setIsPlaying(false);
        }
        return c + 1;
      });
    }, 28);
    return () => clearInterval(intervalRef.current!);
  }, [isPlaying, exercise.transcript.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePlay() {
    if (transcriptDone) return;
    setIsPlaying(true);
  }

  function handleCheck() {
    if (!selectedId) return;
    const correct = selectedId === exercise.correctId;
    setIsCorrect(correct);
    setChecked(true);
    if (!correct) onWrongAnswer();
  }

  const visibleTranscript = exercise.transcript.slice(0, charIndex);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg shrink-0">
          🎓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Escuchando</p>
          <p className="text-sm font-semibold text-white truncate">{exercise.speakerLabel}</p>
        </div>
        {!transcriptDone ? (
          <motion.button
            onClick={handlePlay}
            disabled={isPlaying}
            whileTap={!isPlaying ? { scale: 0.9 } : undefined}
            animate={isPlaying ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={isPlaying ? { repeat: Infinity, duration: 0.8 } : {}}
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-colors ${
              isPlaying
                ? "bg-cyan-500/30 border-2 border-cyan-400/60 text-cyan-300"
                : "bg-cyan-500 text-white hover:bg-cyan-400"
            }`}
          >
            {isPlaying ? "🔊" : "▶"}
          </motion.button>
        ) : (
          <span className="shrink-0 w-12 h-12 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 flex items-center justify-center text-lg">
            ✅
          </span>
        )}
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="flex items-center justify-center gap-[3px] h-10"
          >
            {WAVEFORM_BARS.map((h, i) => (
              <motion.div
                key={i}
                className="w-[5px] rounded-full bg-cyan-400"
                animate={{ scaleY: [h * 0.4, h, h * 0.5, h * 0.9, h * 0.3] }}
                transition={{ repeat: Infinity, duration: 0.7 + i * 0.05, ease: "easeInOut", delay: i * 0.04 }}
                style={{ height: 36, originY: 0.5 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {charIndex > 0 && (
        <div className="rounded-2xl bg-white/[0.04] border border-white/8 px-4 py-3 min-h-[72px]">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Transcripción</p>
          <p className="text-sm text-gray-200 leading-relaxed">
            {visibleTranscript}
            {isPlaying && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="inline-block w-[2px] h-[14px] bg-cyan-400 align-middle ml-[2px]"
              />
            )}
          </p>
        </div>
      )}

      <AnimatePresence>
        {transcriptDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            <p className="text-base font-extrabold text-white">{exercise.question}</p>
            <div className="flex flex-col gap-2">
              {exercise.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const isRight = checked && opt.id === exercise.correctId;
                const isWrong = checked && isSelected && !isCorrect;
                return (
                  <button
                    key={opt.id}
                    disabled={checked}
                    onClick={() => !checked && setSelectedId(opt.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border text-left font-semibold text-sm transition-all duration-150 ${
                      isRight
                        ? "border-[#58cc02] bg-[#58cc02]/15 text-[#58cc02]"
                        : isWrong
                        ? "border-red-400 bg-red-500/15 text-red-400"
                        : isSelected
                        ? "border-violet-400 bg-violet-500/20 text-white"
                        : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {checked ? (
              <div className="flex flex-col gap-3">
                <InlineFeedback isCorrect={isCorrect} theoryExplanation={exercise.theoryExplanation} />
                <ProceedButton label="Continuar →" onClick={onComplete} />
              </div>
            ) : (
              <button
                disabled={!selectedId}
                onClick={handleCheck}
                className={`w-full min-h-[56px] rounded-2xl font-extrabold text-base transition-all duration-150 ${
                  selectedId
                    ? "bg-[#58cc02] text-white shadow-[0_4px_0_#389200] hover:bg-[#4ab001]"
                    : "bg-white/10 text-gray-600 cursor-not-allowed"
                }`}
              >
                Comprobar Respuesta
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!transcriptDone && charIndex === 0 && (
        <p className="text-center text-sm text-gray-500 mt-1">Toca ▶ para escuchar la lección</p>
      )}
    </div>
  );
}

// ── StoryComponent ─────────────────────────────────────────────────────────────

function StoryComponent({
  exercise,
  onComplete,
  onWrongAnswer,
}: {
  exercise: StoryExercise;
  onComplete: () => void;
  onWrongAnswer: () => void;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<"reading" | "quiz">("reading");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const visibleLines = exercise.lines.slice(0, lineIndex + 1);
  const isLastLine = lineIndex >= exercise.lines.length - 1;

  function handleNext() {
    if (!isLastLine) {
      setLineIndex((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  }

  function handleCheck() {
    if (!selectedId) return;
    const correct = selectedId === exercise.correctId;
    setIsCorrect(correct);
    setChecked(true);
    if (!correct) onWrongAnswer();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📖</span>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Historia Interactiva</p>
      </div>

      <div className="flex flex-col gap-3 min-h-[160px]">
        <AnimatePresence initial={false}>
          {visibleLines.map((line, i) => {
            const isBot = line.speaker === "IA";
            const isNarrator = !line.speaker || line.speaker === "Narrador";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              >
                {isNarrator ? (
                  <p className="text-xs text-gray-500 italic text-center px-4">{line.text}</p>
                ) : (
                  <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isBot
                          ? "bg-white/10 text-white border border-white/8 rounded-tl-sm"
                          : "bg-violet-500 text-white rounded-tr-sm"
                      }`}
                    >
                      {line.speaker && (
                        <p className={`text-[10px] font-bold mb-1 ${isBot ? "text-cyan-400" : "text-violet-200"}`}>
                          {line.speaker}
                        </p>
                      )}
                      {line.text}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {phase === "reading" && (
        <motion.button
          key={lineIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleNext}
          className="w-full min-h-[52px] rounded-2xl border-2 border-violet-400/40 bg-violet-500/10 text-violet-300 font-bold text-sm
            hover:bg-violet-500/20 hover:border-violet-400/70 transition-all duration-150"
        >
          {isLastLine ? "Ver la pregunta →" : "Continuar ›"}
        </motion.button>
      )}

      <AnimatePresence>
        {phase === "quiz" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4 pt-2 border-t border-white/8"
          >
            <p className="text-base font-extrabold text-white">{exercise.question}</p>
            <div className="flex flex-col gap-2">
              {exercise.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const isRight = checked && opt.id === exercise.correctId;
                const isWrong = checked && isSelected && !isCorrect;
                return (
                  <button
                    key={opt.id}
                    disabled={checked}
                    onClick={() => !checked && setSelectedId(opt.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border text-left font-semibold text-sm transition-all duration-150 ${
                      isRight
                        ? "border-[#58cc02] bg-[#58cc02]/15 text-[#58cc02]"
                        : isWrong
                        ? "border-red-400 bg-red-500/15 text-red-400"
                        : isSelected
                        ? "border-violet-400 bg-violet-500/20 text-white"
                        : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {checked ? (
              <div className="flex flex-col gap-3">
                <InlineFeedback isCorrect={isCorrect} theoryExplanation={exercise.theoryExplanation} />
                <ProceedButton label="Continuar →" onClick={onComplete} />
              </div>
            ) : (
              <button
                disabled={!selectedId}
                onClick={handleCheck}
                className={`w-full min-h-[56px] rounded-2xl font-extrabold text-base transition-all duration-150 ${
                  selectedId
                    ? "bg-[#58cc02] text-white shadow-[0_4px_0_#389200] hover:bg-[#4ab001]"
                    : "bg-white/10 text-gray-600 cursor-not-allowed"
                }`}
              >
                Comprobar Respuesta
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ChatComponent ──────────────────────────────────────────────────────────────

function ChatComponent({
  exercise,
  onComplete,
}: {
  exercise: ChatExercise;
  onComplete: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  if (visibleCount < exercise.messages.length) {
    setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 300 : 800);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl shadow-lg">
          ⚡
        </div>
        <div>
          <p className="font-extrabold text-white text-sm">Promptly</p>
          <p className="text-xs text-emerald-400">● En línea</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-[120px]">
        {exercise.messages.slice(0, visibleCount).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.from === "bot" ? -20 : 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.from === "bot"
                ? "self-start bg-white/10 text-white rounded-tl-sm border border-white/8"
                : "self-end bg-violet-500 text-white rounded-tr-sm"
            }`}
          >
            <BoldText text={msg.text} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {visibleCount >= exercise.messages.length && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 20 }}
            onClick={onComplete}
            className="mt-2 w-full min-h-[60px] rounded-2xl bg-violet-500 text-white font-extrabold text-base
              shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px]
              active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px]
              transition-all duration-100 select-none"
          >
            {exercise.replyLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-componentes de UI ──────────────────────────────────────────────────────

function XButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Salir de la lección"
      className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#58cc02] to-[#89e219] shadow-[0_0_12px_#58cc02aa]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

function HeartCounter({ hearts }: { hearts: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <span className="text-red-400 text-lg">❤️</span>
      <span className="font-bold text-red-400 text-sm">{hearts}</span>
    </div>
  );
}

function FeedbackBanner({
  state,
  theoryExplanation,
}: {
  state: LessonState;
  theoryExplanation?: string;
}) {
  if (state !== "correct" && state !== "incorrect") return null;
  const isCorrect = state === "correct";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className={`w-full px-5 py-4 rounded-2xl mb-4 ${
        isCorrect
          ? "bg-[#58cc02]/20 border border-[#58cc02]/40"
          : "bg-red-500/20 border border-red-500/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
        <div>
          <p className={`font-bold text-base ${isCorrect ? "text-[#58cc02]" : "text-red-400"}`}>
            {isCorrect ? "¡Muy bien!" : "No del todo"}
          </p>
          <p className="text-gray-400 text-sm">
            {isCorrect ? "¡Lo clavaste! ¡Sigue así!" : "¿Por qué?"}
          </p>
        </div>
      </div>
      <AnimatePresence>
        {!isCorrect && theoryExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="mt-3 pt-3 border-t border-red-500/20 text-sm text-gray-300 leading-relaxed">
              {theoryExplanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionButton({
  hasSelection,
  lessonState,
  onCheck,
  onContinue,
}: {
  hasSelection: boolean;
  lessonState: LessonState;
  onCheck: () => void;
  onContinue: () => void;
}) {
  const isAnswered = lessonState === "correct" || lessonState === "incorrect";
  const isCorrect = lessonState === "correct";
  const isDisabled = !isAnswered && !hasSelection;
  const label = !isAnswered ? "Comprobar Respuesta" : isCorrect ? "Continuar" : "Entendido";
  const colorClasses = isDisabled
    ? "bg-white/10 text-gray-600 cursor-not-allowed"
    : !isAnswered
      ? "bg-[#58cc02] hover:bg-[#4ab001] text-white shadow-[0_4px_0_#389200]"
      : isCorrect
        ? "bg-[#58cc02] hover:bg-[#4ab001] text-white shadow-[0_4px_0_#389200]"
        : "bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_0_#b91c1c]";
  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      onClick={isAnswered ? onContinue : onCheck}
      disabled={isDisabled}
      className={`w-full py-4 rounded-2xl font-extrabold text-lg tracking-wide transition-all duration-200 shadow-lg ${colorClasses}`}
    >
      {label}
    </motion.button>
  );
}

function FinishedScreen({ onRestart, onExit }: { onRestart: () => void; onExit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="flex flex-col items-center justify-center h-full gap-6 text-center px-6"
    >
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-[#58cc02]/20 flex items-center justify-center">
          <span className="text-6xl">🏆</span>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#58cc02]/60"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-white mb-2">¡Lección Completada!</h2>
        <p className="text-gray-400 text-base">
          Terminaste los {TOTAL_STEPS} ejercicios. ¡Mantén la racha!
        </p>
      </div>
      <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-5 py-2">
        <span className="text-yellow-400 text-xl">⚡</span>
        <span className="text-yellow-400 font-bold text-lg">+50 XP</span>
      </div>
      <button
        onClick={onRestart}
        className="mt-2 w-full max-w-xs py-4 rounded-2xl bg-[#58cc02] hover:bg-[#4ab001] text-white font-extrabold text-lg shadow-[0_4px_0_#389200] active:scale-95 transition-all"
      >
        Practicar de Nuevo
      </button>
      <button
        onClick={onExit}
        className="mt-2 w-full max-w-xs py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-colors border border-white/5 shadow-sm"
      >
        Volver a Lecciones
      </button>
    </motion.div>
  );
}

// ── Página Principal ───────────────────────────────────────────────────────────

const DEFAULT_CORRECT_ORDER = ["role", "context", "task", "format", "tone"];

export default function LessonPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [lessonState, setLessonState] = useState<LessonState>("idle");
  const [hearts, setHearts] = useState(3);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropzonePlaced, setDropzonePlaced] = useState<string[]>([]);

  const exercise = EXERCISES[currentStep];
  const progress = (currentStep / TOTAL_STEPS) * 100;
  const isFinished = lessonState === "finished";
  const isChecked = lessonState === "correct" || lessonState === "incorrect";
  const isSelfContained = SELF_CONTAINED.includes(exercise.type);

  const dropzoneReady =
    exercise.type === "dropzone" && dropzonePlaced.length === DEFAULT_CORRECT_ORDER.length;

  function handleCheck() {
    if (exercise.type === "dropzone") {
      const correct = dropzonePlaced.every((id, i) => DEFAULT_CORRECT_ORDER[i] === id);
      setLessonState(correct ? "correct" : "incorrect");
      if (!correct) setHearts((h) => Math.max(0, h - 1));
      return;
    }
    if (isSelfContained) return;
    if (!selectedId) return;
    const correct = selectedId === (exercise as QuizExercise | TrueFalseExercise).correctId;
    setLessonState(correct ? "correct" : "incorrect");
    if (!correct) setHearts((h) => Math.max(0, h - 1));
  }

  function handleContinue() {
    const nextStep = currentStep + 1;
    if (nextStep >= TOTAL_STEPS) {
      setLessonState("finished");
    } else {
      setCurrentStep(nextStep);
      setLessonState("idle");
      setSelectedId(null);
      setDropzonePlaced([]);
    }
  }

  function handleWrongAnswer() {
    setHearts((h) => Math.max(0, h - 1));
  }

  function handleRestart() {
    setCurrentStep(0);
    setLessonState("idle");
    setHearts(3);
    setSelectedId(null);
    setDropzonePlaced([]);
  }

  const theoryExplanation =
    exercise.type === "quiz" || exercise.type === "truefalse"
      ? exercise.theoryExplanation
      : undefined;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d1a] flex flex-col h-[100dvh] overflow-hidden">
      {!isFinished && (
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <XButton onClick={() => router.back()} />
          <ProgressBar progress={progress} />
          <HeartCounter hearts={hearts} />
        </header>
      )}

      <main className="flex-1 overflow-y-auto overscroll-contain">
        {isFinished ? (
          <FinishedScreen onRestart={handleRestart} onExit={() => router.push("/lessons")} />
        ) : (
          <div className="min-h-full flex flex-col justify-start md:justify-center px-5 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-w-lg mx-auto"
              >
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-5">
                  {currentStep + 1} / {TOTAL_STEPS}
                </p>

                {exercise.type === "chat" && (
                  <ChatComponent exercise={exercise} onComplete={handleContinue} />
                )}
                {exercise.type === "concept" && (
                  <ConceptCardComponent exercise={exercise} onComplete={handleContinue} />
                )}
                {exercise.type === "audio" && (
                  <AudioComponent
                    exercise={exercise}
                    onComplete={handleContinue}
                    onWrongAnswer={handleWrongAnswer}
                  />
                )}
                {exercise.type === "story" && (
                  <StoryComponent
                    exercise={exercise}
                    onComplete={handleContinue}
                    onWrongAnswer={handleWrongAnswer}
                  />
                )}
                {exercise.type === "quiz" && (
                  <QuizComponent
                    questionText={exercise.question}
                    options={exercise.options}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    correctId={exercise.correctId}
                    isChecked={isChecked}
                  />
                )}
                {exercise.type === "truefalse" && (
                  <TrueFalseComponent
                    questionText={exercise.question}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId(id)}
                    correctId={exercise.correctId}
                    isChecked={isChecked}
                  />
                )}
                {exercise.type === "dropzone" && (
                  <PromptDropZone
                    isChecked={isChecked}
                    onPlacedChange={setDropzonePlaced}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {!isFinished && !isSelfContained && (
        <footer className="shrink-0 border-t border-white/5 px-4 pt-3 pb-6">
          <AnimatePresence mode="wait">
            <FeedbackBanner
              key={lessonState}
              state={lessonState}
              theoryExplanation={theoryExplanation}
            />
          </AnimatePresence>
          <ActionButton
            hasSelection={exercise.type === "dropzone" ? dropzoneReady : selectedId !== null}
            lessonState={lessonState}
            onCheck={handleCheck}
            onContinue={handleContinue}
          />
        </footer>
      )}
    </div>
  );
}

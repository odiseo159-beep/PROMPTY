"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Progress, Card, CardBody, Chip } from "@heroui/react";
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

// ── Ejercicios por lección ──────────────────────────────────────────────────────

const LESSON_EXERCISES: Record<string, Exercise[]> = {

  // ── Lección 1-1: ¿Qué es un Prompt? ──────────────────────────────────────
  "1-1": [
    {
      type: "concept",
      emoji: "💬",
      title: "¿Qué es un Prompt?",
      body: "Un prompt es la instrucción que le das a la IA. Piénsalo como pedir comida: si dices «quiero algo», te traerán cualquier cosa. Pero si dices «quiero una pizza mediana con extra queso», ¡obtienes exactamente lo que quieres!",
    },
    {
      type: "chat",
      messages: [
        { from: "bot", text: "¡Hola! 👋 Soy Promptly, tu guía de IA." },
        { from: "bot", text: "Los prompts están en todas partes: «Tradúceme esto al inglés», «Hazme un resumen», «Escríbeme un correo formal»... Cada vez que le pides algo a la IA, eso es un prompt. 🎯" },
        { from: "bot", text: "No necesitas saber programar ni usar palabras técnicas. Solo comunicarte con claridad — ¡igual que en la vida real! 💡" },
      ],
      replyLabel: "¡Tiene sentido! →",
    },
    {
      type: "truefalse",
      question: "Un prompt puede ser una pregunta, un pedido o una instrucción.",
      correctId: "true",
      theoryExplanation:
        "¡Exacto! Los prompts tienen muchas formas: preguntas («¿Cómo funciona el Wi-Fi?»), órdenes («Traduce esto al inglés») o peticiones («Ayúdame a escribir un correo»). Lo importante es que sea claro.",
    },
    {
      type: "quiz",
      question: "¿Cuál de estos es un ejemplo de prompt?",
      correctId: "c",
      theoryExplanation:
        "Un prompt siempre es algo que TÚ escribes para pedirle algo a la IA. «Resume este texto en 5 puntos clave» es un prompt porque es una instrucción directa. Los demás son solo conceptos o nombres.",
      options: [
        { id: "a", text: "ChatGPT", icon: "🤖" },
        { id: "b", text: "Inteligencia Artificial", icon: "💻" },
        { id: "c", text: "Resume este texto en 5 puntos clave", icon: "📝" },
        { id: "d", text: "Algoritmo", icon: "⚙️" },
      ],
    },
    {
      type: "truefalse",
      question: "Solo los expertos en tecnología pueden escribir buenos prompts.",
      correctId: "false",
      theoryExplanation:
        "¡Para nada! Escribir prompts es una habilidad que cualquiera puede aprender. No necesitas saber programar ni términos técnicos. Solo necesitas practicar cómo comunicarte de forma clara — igual que en la vida real.",
    },
  ],

  // ── Lección 1-2: Sé Específico ────────────────────────────────────────────
  "1-2": [
    {
      type: "concept",
      emoji: "🎯",
      title: "Sé Específico",
      body: "La diferencia entre un buen y un mal prompt es la especificidad. «Escríbeme un correo» da un resultado genérico. «Escríbeme un correo formal de 3 líneas para pedir un día libre a mi jefa» da exactamente lo que necesitas. ¡Los detalles importan!",
    },
    {
      type: "chat",
      messages: [
        { from: "bot", text: "¡Hola! 👋 Imagina que le pides a un chef que te cocine «algo rico». Podría hacerte pasta, sushi o una ensalada. 🤷" },
        { from: "bot", text: "Pero si le dices «hazme tacos de pollo con guacamole, sin picante», el resultado será perfecto. Con la IA pasa exactamente lo mismo." },
        { from: "bot", text: "**Cuanto más específico seas, mejor será la respuesta.** Vamos a practicarlo. 🌮" },
      ],
      replyLabel: "¡A practicar! →",
    },
    {
      type: "truefalse",
      question: "El prompt «Escríbeme algo sobre perros» dará un resultado más útil que «Dame 5 datos curiosos sobre los perros Golden Retriever».",
      correctId: "false",
      theoryExplanation:
        "El prompt específico siempre gana. «Algo sobre perros» puede generar un poema, un artículo científico o una lista — la IA no sabe qué quieres. El segundo prompt es claro y te dará exactamente lo que necesitas.",
    },
    {
      type: "quiz",
      question: "Necesitas una receta de pasta para una cena especial. ¿Cuál es el mejor prompt?",
      correctId: "c",
      theoryExplanation:
        "La opción C incluye qué plato (carbonara), para cuántos (4 personas), el formato (paso a paso) y los detalles necesarios (ingredientes exactos). Con esa información, la IA puede darte una receta perfecta.",
      options: [
        { id: "a", text: "Pasta", icon: "🍝" },
        { id: "b", text: "Dame una receta", icon: "📋" },
        { id: "c", text: "Dame una receta de pasta carbonara para 4 personas, paso a paso y con los ingredientes exactos", icon: "👨‍🍳" },
        { id: "d", text: "Necesito cocinar algo", icon: "🍴" },
      ],
    },
    {
      type: "story",
      lines: [
        { speaker: "Narrador", text: "Carlos quiere que la IA le ayude a aprender inglés. 📚" },
        { speaker: "Carlos", text: "«IA, enséñame inglés.»" },
        { speaker: "IA", text: "«¡Claro! El inglés tiene 26 letras. El alfabeto es A, B, C, D... Hay tiempos verbales como el presente simple, el pasado...»" },
        { speaker: "Narrador", text: "Carlos recibe una respuesta genérica que no le sirve de mucho. 😕" },
        { speaker: "Carlos", text: "«Soy hispanohablante con nivel básico. Dame 5 frases para presentarme en el trabajo, con traducción y cómo se pronuncian.»" },
        { speaker: "IA", text: "«¡Perfecto! 1. 'My name is Carlos' = Me llamo Carlos (Mai neim is Carlos). 2. 'I work in marketing'...» ✅" },
        { speaker: "Narrador", text: "¡Mucho mejor! El prompt específico dio exactamente lo que Carlos necesitaba. 🎉" },
      ],
      question: "¿Qué hizo Carlos para obtener una respuesta útil?",
      correctId: "b",
      theoryExplanation:
        "Carlos añadió su nivel (básico), el contexto (trabajo), y el formato exacto que necesitaba (5 frases con traducción y pronunciación). Esos detalles transforman una respuesta genérica en algo realmente útil.",
      options: [
        { id: "a", text: "Usó palabras más largas y complicadas", icon: "📖" },
        { id: "b", text: "Añadió su nivel, el contexto y el formato que necesitaba", icon: "🎯" },
        { id: "c", text: "Le preguntó a otra IA diferente", icon: "🤖" },
        { id: "d", text: "Esperó más tiempo antes de enviar", icon: "⏱️" },
      ],
    },
    {
      type: "quiz",
      question: "¿Qué elemento hace que un prompt sea más específico?",
      correctId: "a",
      theoryExplanation:
        "La especificidad viene de los detalles: qué quieres exactamente, para qué situación y en qué formato. Nada de eso tiene que ver con el idioma, las mayúsculas o la longitud.",
      options: [
        { id: "a", text: "Indicar qué quieres, para qué y en qué formato", icon: "✅" },
        { id: "b", text: "Usar mayúsculas y signos de exclamación", icon: "❗" },
        { id: "c", text: "Escribirlo en inglés en lugar de español", icon: "🌐" },
        { id: "d", text: "Hacerlo lo más corto posible", icon: "✂️" },
      ],
    },
  ],

  // ── Lección 1-3: Añade Contexto ───────────────────────────────────────────
  "1-3": [
    {
      type: "concept",
      emoji: "📎",
      title: "El Contexto es Clave",
      body: "El contexto es la información de fondo que le das a la IA sobre tu situación. Sin contexto, responde de forma genérica. Con contexto («soy estudiante de medicina», «esto es para una presentación», «mi presupuesto es 50€»), la respuesta se vuelve perfecta para ti.",
    },
    {
      type: "chat",
      messages: [
        { from: "bot", text: "¡Hola! 👋 Piensa en esto: si le preguntas a un médico «¿qué medicamento tomo?» sin decirle qué te duele, no podrá ayudarte bien. 🏥" },
        { from: "bot", text: "Pero si le dices «tengo dolor de cabeza desde hace 2 días, soy alérgico a la aspirina y tengo 35 años», su consejo será mucho más útil." },
        { from: "bot", text: "**El contexto le da a la IA lo que necesita para personalizar su respuesta.** ¡Esa es la clave! 💡" },
      ],
      replyLabel: "¡Entendido! →",
    },
    {
      type: "truefalse",
      question: "Decirle a la IA quién eres y para qué necesitas la respuesta mejora el resultado.",
      correctId: "true",
      theoryExplanation:
        "¡Exacto! Cuando la IA sabe que eres estudiante, profesional, principiante o experto, adapta su respuesta a tu nivel y situación. Ese contexto es la diferencia entre una respuesta genérica y una perfecta para ti.",
    },
    {
      type: "audio",
      speakerLabel: "Prof. Ana · Experta en IA",
      transcript:
        "Imagina que le pides consejo a un amigo sobre qué trabajo aceptar. Si no le cuentas nada de tu situación, te dará un consejo muy genérico. Pero si le explicas que tienes familia, que valoras el horario flexible y que el salario es secundario, su consejo cambia completamente. Con la IA funciona igual: el contexto transforma una respuesta cualquiera en una respuesta hecha para ti.",
      question: "Según la profesora, ¿para qué sirve el contexto en un prompt?",
      correctId: "b",
      theoryExplanation:
        "El contexto permite a la IA personalizar su respuesta. Sin contexto, responde para «cualquier persona». Con contexto, responde exactamente para ti y tu situación.",
      options: [
        { id: "a", text: "Para hacer el prompt más largo", icon: "📏" },
        { id: "b", text: "Para que la IA adapte su respuesta a tu situación", icon: "🎯" },
        { id: "c", text: "Para que la IA responda más rápido", icon: "⚡" },
        { id: "d", text: "Para evitar que la IA cometa errores", icon: "🛡️" },
      ],
    },
    {
      type: "quiz",
      question: "Necesitas consejos para ahorrar dinero. ¿Qué prompt tiene el mejor contexto?",
      correctId: "d",
      theoryExplanation:
        "La opción D incluye edad, ingresos, gastos fijos, objetivo y tiempo. Con toda esa información, la IA puede crear un plan de ahorro personalizado y realista, no un consejo genérico que vale para cualquiera.",
      options: [
        { id: "a", text: "Dame consejos para ahorrar", icon: "💰" },
        { id: "b", text: "¿Cómo ahorro dinero?", icon: "🤔" },
        { id: "c", text: "Necesito ahorrar, ayúdame", icon: "😟" },
        { id: "d", text: "Tengo 28 años, gano 1.500€/mes, pago 600€ de alquiler y quiero ahorrar para un viaje en 6 meses. Dame un plan realista.", icon: "📊" },
      ],
    },
    {
      type: "dropzone",
      question: "Ordena las partes para construir un prompt completo y bien estructurado.",
    },
  ],

  // ── Lección 2-1: Dale un Rol a la IA ─────────────────────────────────────
  "2-1": [
    {
      type: "concept",
      emoji: "🎭",
      title: "Dale un Rol a la IA",
      body: "Cuando le dices a la IA «actúa como un chef experto», responde con el conocimiento y el vocabulario de un chef de verdad. Es como contratar a un especialista: obtienes respuestas mucho más útiles que si le preguntas a alguien genérico.",
    },
    {
      type: "chat",
      messages: [
        { from: "bot", text: "¡Hola! 👋 Prueba esto: escríbele a la IA «Dame consejos de salud». Te dará algo genérico. 🤷" },
        { from: "bot", text: "Ahora prueba: «Actúa como un nutricionista deportivo. Dame 3 consejos para comer mejor antes de hacer ejercicio.»" },
        { from: "bot", text: "¡La diferencia es enorme! Un rol convierte a la IA en el **experto exacto** que necesitas. 🏅" },
      ],
      replyLabel: "¡Entendido! Practicamos →",
    },
    {
      type: "truefalse",
      question: "Decirle a la IA «actúa como un abogado» hace que sus respuestas sean más útiles en temas legales.",
      correctId: "true",
      theoryExplanation:
        "¡Correcto! Cuando le das un rol, la IA adapta su vocabulario, nivel de detalle y enfoque al de ese profesional. No reemplaza a un experto real, pero sus respuestas serán mucho más precisas y útiles.",
    },
    {
      type: "quiz",
      question: "Quieres consejos para decorar tu apartamento con poco dinero. ¿Cuál es el mejor prompt?",
      correctId: "b",
      theoryExplanation:
        "La opción B usa un rol (decorador de interiores) y añade contexto (poco presupuesto). Esa combinación produce consejos profesionales y adaptados a tu situación, en lugar de ideas genéricas.",
      options: [
        { id: "a", text: "¿Cómo decoro mi casa?", icon: "🏠" },
        { id: "b", text: "Actúa como un decorador de interiores. Dame 5 ideas para decorar un apartamento pequeño con menos de 100€.", icon: "🛋️" },
        { id: "c", text: "Necesito decorar algo barato", icon: "💸" },
        { id: "d", text: "Decoración de interiores", icon: "🎨" },
      ],
    },
    {
      type: "story",
      lines: [
        { speaker: "Narrador", text: "Laura tiene una entrevista de trabajo mañana y está muy nerviosa. 😰" },
        { speaker: "Laura", text: "«IA, ayúdame a prepararme para una entrevista.»" },
        { speaker: "IA", text: "«¡Claro! Practica responder preguntas frecuentes. Prepara tu currículum. Viste de forma profesional...»" },
        { speaker: "Narrador", text: "Laura recibe consejos genéricos que ya conocía. 😕" },
        { speaker: "Laura", text: "«Actúa como un coach de entrevistas con 10 años de experiencia. Voy a una entrevista para diseñadora gráfica junior. Dame 3 preguntas difíciles que me pueden hacer y cómo responderlas.»" },
        { speaker: "IA", text: "«¡Perfecto! Pregunta 1: ¿Cuéntame un proyecto del que estés orgullosa? Responde mostrando tu proceso creativo... ✅»" },
        { speaker: "Narrador", text: "¡Mucho mejor! El rol convirtió a la IA en el coach exacto que Laura necesitaba. 🎉" },
      ],
      question: "¿Qué hizo Laura para obtener una ayuda más útil?",
      correctId: "c",
      theoryExplanation:
        "Laura añadió un rol específico (coach de entrevistas), experiencia (10 años), su situación (diseñadora junior) y lo que necesitaba exactamente (preguntas difíciles con respuestas). Todo eso juntos da una respuesta de experto.",
      options: [
        { id: "a", text: "Escribió el prompt más largo posible", icon: "📜" },
        { id: "b", text: "Cambió a una IA diferente", icon: "🤖" },
        { id: "c", text: "Le dio un rol concreto y explicó su situación", icon: "🎭" },
        { id: "d", text: "Repitió la misma pregunta varias veces", icon: "🔁" },
      ],
    },
    {
      type: "quiz",
      question: "¿Cuál de estas frases es un buen ejemplo de dar un rol a la IA?",
      correctId: "d",
      theoryExplanation:
        "La opción D es la única que establece un rol claro («profesor de matemáticas para niños de 10 años»). Las demás son solo preguntas directas sin rol, que darán respuestas genéricas.",
      options: [
        { id: "a", text: "¿Qué es una fracción?", icon: "🔢" },
        { id: "b", text: "Explícame las fracciones", icon: "📐" },
        { id: "c", text: "Fracciones para principiantes", icon: "📚" },
        { id: "d", text: "Eres un profesor de matemáticas para niños de 10 años. Explícame las fracciones con un ejemplo de pizza.", icon: "🍕" },
      ],
    },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// Shared inline feedback for self-contained exercises
function InlineFeedback({ isCorrect, theoryExplanation }: { isCorrect: boolean; theoryExplanation?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={isCorrect
        ? "bg-[#EFF6F6] border border-[#2D6A6A]/40"
        : "bg-[#FDF0ED] border border-[#E2654A]/40"
      }>
        <CardBody className="p-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
            <p className={`font-bold text-sm ${isCorrect ? "text-[#2D6A6A]" : "text-[#E2654A]"}`}>
              {isCorrect ? "¡Correcto!" : "Casi..."}
            </p>
          </div>
          {!isCorrect && theoryExplanation && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-sm text-[#6B6960] leading-relaxed overflow-hidden"
            >
              {theoryExplanation}
            </motion.p>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}

function ProceedButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        onPress={onClick}
        fullWidth
        size="lg"
        className="font-extrabold text-base bg-[#E2654A] text-white hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150"
      >
        {label}
      </Button>
    </motion.div>
  );
}

// ── ConceptCardComponent ───────────────────────────────────────────────────────

function ConceptCardComponent({ exercise, onComplete }: { exercise: ConceptExercise; onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <div className="flex items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="text-[80px] leading-none select-none"
        >
          {exercise.emoji}
        </motion.span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold text-[#1A1A18]">{exercise.title}</h2>
        <p className="text-base text-[#6B6960] leading-relaxed max-w-sm mx-auto">{exercise.body}</p>
      </div>

      <Chip
        variant="bordered"
        classNames={{ base: "border-[#E2654A]/20 bg-[#FDF0ED]", content: "text-[#E2654A] font-bold text-xs uppercase tracking-widest" }}
      >
        Ficha Conceptual
      </Chip>

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
    <div className="flex flex-col gap-4">
      {/* Player row */}
      <Card className="bg-[#FAFAF8] border border-[#E8E5E0]">
        <CardBody className="flex flex-row items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-full bg-[#FDF0ED] border border-[#E2654A]/20 flex items-center justify-center text-lg shrink-0">
            🎓
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#9C9890] uppercase tracking-widest font-bold">Escuchando</p>
            <p className="text-sm font-semibold text-[#1A1A18] truncate">{exercise.speakerLabel}</p>
          </div>
          {!transcriptDone ? (
            <Button
              isIconOnly
              onPress={handlePlay}
              isDisabled={isPlaying}
              aria-label={isPlaying ? "Reproduciendo audio" : "Reproducir audio"}
              className={`shrink-0 rounded-full transition-colors ${
                isPlaying
                  ? "bg-[#FDF0ED] border-2 border-[#E2654A]/40 text-[#E2654A]"
                  : "bg-[#E2654A] text-white hover:bg-[#C9553D]"
              }`}
            >
              <motion.span
                animate={isPlaying ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={isPlaying ? { repeat: Infinity, duration: 0.8 } : {}}
              >
                {isPlaying ? "🔊" : "▶"}
              </motion.span>
            </Button>
          ) : (
            <span className="shrink-0 w-10 h-10 rounded-full bg-[#EFF6F6] border border-[#2D6A6A]/40 flex items-center justify-center text-base">✅</span>
          )}
        </CardBody>
      </Card>

      {/* Waveform */}
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
                className="w-[5px] rounded-full bg-[#E2654A]"
                animate={{ scaleY: [h * 0.4, h, h * 0.5, h * 0.9, h * 0.3] }}
                transition={{ repeat: Infinity, duration: 0.7 + i * 0.05, ease: "easeInOut", delay: i * 0.04 }}
                style={{ height: 36, originY: 0.5 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript */}
      {charIndex > 0 && (
        <Card className="bg-[#FAFAF8] border border-[#E8E5E0]">
          <CardBody className="p-4 min-h-[72px]">
            <p className="text-[10px] text-[#9C9890] uppercase tracking-widest font-bold mb-1">Transcripción</p>
            <p className="text-sm text-[#1A1A18] leading-relaxed">
              {visibleTranscript}
              {isPlaying && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="inline-block w-[2px] h-[14px] bg-[#E2654A] align-middle ml-[2px]"
                />
              )}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Quiz once transcript done */}
      <AnimatePresence>
        {transcriptDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            <p className="text-base font-extrabold text-[#1A1A18]">{exercise.question}</p>
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
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border text-left font-semibold text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isRight ? "border-[#2D6A6A] bg-[#EFF6F6] text-[#2D6A6A]"
                      : isWrong ? "border-[#E2654A] bg-[#FDF0ED] text-[#E2654A]"
                      : isSelected ? "border-[#E2654A] bg-[#FDF0ED] text-[#1A1A18]"
                      : "border-[#E8E5E0] bg-white text-[#6B6960] hover:border-[#E2654A]/40 hover:bg-[#FAFAF8]"
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
              <Button
                isDisabled={!selectedId}
                onPress={handleCheck}
                fullWidth
                size="lg"
                className={`font-extrabold text-base transition-all duration-150 ${
                  selectedId
                    ? "bg-[#E2654A] text-white hover:bg-[#C9553D]"
                    : "bg-[#E8E5E0] text-[#9C9890] cursor-not-allowed"
                }`}
              >
                Comprobar Respuesta
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!transcriptDone && charIndex === 0 && (
        <p className="text-center text-sm text-[#9C9890] mt-1">Toca ▶ para escuchar la lección</p>
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
    if (!isLastLine) setLineIndex((i) => i + 1);
    else setPhase("quiz");
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
        <p className="text-[10px] text-[#9C9890] uppercase tracking-widest font-bold">Historia Interactiva</p>
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
                  <p className="text-xs text-[#9C9890] italic text-center px-4">{line.text}</p>
                ) : (
                  <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isBot
                        ? "bg-[#FAFAF8] text-[#1A1A18] border border-[#E8E5E0] rounded-tl-sm"
                        : "bg-[#E2654A] text-white rounded-tr-sm"
                    }`}>
                      {line.speaker && (
                        <p className={`text-[10px] font-bold mb-1 ${isBot ? "text-[#2D6A6A]" : "text-white/80"}`}>
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
        <motion.div key={lineIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Button
            onPress={handleNext}
            fullWidth
            variant="bordered"
            className="border-[#E8E5E0] bg-[#FAFAF8] text-[#6B6960] font-bold hover:bg-[#FDF0ED] hover:border-[#E2654A]/40 hover:text-[#E2654A]"
          >
            {isLastLine ? "Ver la pregunta →" : "Continuar ›"}
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {phase === "quiz" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4 pt-2 border-t border-[#E8E5E0]"
          >
            <p className="text-base font-extrabold text-[#1A1A18]">{exercise.question}</p>
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
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border text-left font-semibold text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isRight ? "border-[#2D6A6A] bg-[#EFF6F6] text-[#2D6A6A]"
                      : isWrong ? "border-[#E2654A] bg-[#FDF0ED] text-[#E2654A]"
                      : isSelected ? "border-[#E2654A] bg-[#FDF0ED] text-[#1A1A18]"
                      : "border-[#E8E5E0] bg-white text-[#6B6960] hover:border-[#E2654A]/40 hover:bg-[#FAFAF8]"
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
              <Button
                isDisabled={!selectedId}
                onPress={handleCheck}
                fullWidth
                size="lg"
                className={`font-extrabold text-base transition-all duration-150 ${
                  selectedId
                    ? "bg-[#E2654A] text-white hover:bg-[#C9553D]"
                    : "bg-[#E8E5E0] text-[#9C9890] cursor-not-allowed"
                }`}
              >
                Comprobar Respuesta
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ChatComponent ──────────────────────────────────────────────────────────────

function ChatComponent({ exercise, onComplete }: { exercise: ChatExercise; onComplete: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);

  if (visibleCount < exercise.messages.length) {
    setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 300 : 800);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-[#FDF0ED] border border-[#E2654A]/20 flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div>
          <p className="font-extrabold text-[#1A1A18] text-sm">Promptly</p>
          <p className="text-xs text-[#2D6A6A]">● En línea</p>
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
                ? "self-start bg-[#FAFAF8] text-[#1A1A18] rounded-tl-sm border border-[#E8E5E0]"
                : "self-end bg-[#E2654A] text-white rounded-tr-sm"
            }`}
          >
            <BoldText text={msg.text} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {visibleCount >= exercise.messages.length && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button
              onPress={onComplete}
              fullWidth
              size="lg"
              className="mt-2 font-extrabold text-base bg-[#E2654A] text-white hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150"
            >
              {exercise.replyLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Header sub-components ──────────────────────────────────────────────────────

function LessonProgressBar({ progress }: { progress: number }) {
  return (
    <Progress
      value={progress}
      size="md"
      classNames={{
        base: "flex-1",
        track: "bg-[#E8E5E0]",
        indicator: "bg-[#E2654A]",
      }}
      aria-label="Progreso de la lección"
    />
  );
}

function HeartCounter({ hearts }: { hearts: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <span className="text-lg">❤️</span>
      <span className="font-bold text-red-500 text-sm">{hearts}</span>
    </div>
  );
}

// ── FeedbackBanner ─────────────────────────────────────────────────────────────

function FeedbackBanner({ state, theoryExplanation }: { state: LessonState; theoryExplanation?: string }) {
  if (state !== "correct" && state !== "incorrect") return null;
  const isCorrect = state === "correct";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
      className="mb-3"
    >
      <Card className={isCorrect
        ? "bg-[#EFF6F6] border border-[#2D6A6A]/40"
        : "bg-[#FDF0ED] border border-[#E2654A]/40"
      }>
        <CardBody className="p-4 gap-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
            <div>
              <p className={`font-bold text-base ${isCorrect ? "text-[#2D6A6A]" : "text-[#E2654A]"}`}>
                {isCorrect ? "¡Muy bien!" : "No del todo"}
              </p>
              <p className="text-[#9C9890] text-sm">{isCorrect ? "¡Lo clavaste! ¡Sigue así!" : "¿Por qué?"}</p>
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
                <p className="pt-3 border-t border-[#E2654A]/20 text-sm text-[#6B6960] leading-relaxed">
                  {theoryExplanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </motion.div>
  );
}

// ── ActionButton ───────────────────────────────────────────────────────────────

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
  const isDisabled = !isAnswered && !hasSelection;
  const label = !isAnswered ? "Comprobar Respuesta" : lessonState === "correct" ? "Continuar" : "Entendido";

  const colorClass = isDisabled
    ? "bg-[#E8E5E0] text-[#9C9890] cursor-not-allowed"
    : lessonState !== "incorrect"
      ? "bg-[#E2654A] text-white hover:bg-[#C9553D]"
      : "bg-[#E2654A] text-white hover:bg-[#C9553D]";

  return (
    <Button
      onPress={isAnswered ? onContinue : onCheck}
      isDisabled={isDisabled}
      fullWidth
      size="lg"
      className={`font-extrabold text-lg tracking-wide transition-all duration-200 active:scale-[0.98] ${colorClass}`}
    >
      {label}
    </Button>
  );
}

// ── FinishedScreen ─────────────────────────────────────────────────────────────

function FinishedScreen({ onRestart, onExit, totalSteps }: { onRestart: () => void; onExit: () => void; totalSteps: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="flex flex-col items-center justify-center h-full gap-6 text-center px-6 py-12"
    >
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-[#EFF6F6] flex items-center justify-center">
          <span className="text-6xl">🏆</span>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#2D6A6A]/50"
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>

      <div>
        <h2 className="text-3xl font-extrabold text-[#1A1A18] mb-2">¡Lección Completada!</h2>
        <p className="text-[#6B6960] text-base">Terminaste los {totalSteps} ejercicios. ¡Mantén la racha!</p>
      </div>

      <Chip
        size="lg"
        startContent={<span className="text-yellow-500 text-xl ml-1">⚡</span>}
        classNames={{ base: "bg-yellow-50 border border-yellow-300 h-10 px-4", content: "text-yellow-600 font-bold text-lg" }}
      >
        +50 XP
      </Chip>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        <Button
          onPress={onRestart}
          fullWidth
          size="lg"
          className="font-extrabold text-lg bg-[#E2654A] text-white hover:bg-[#C9553D] active:scale-[0.98] transition-all"
        >
          Practicar de Nuevo
        </Button>
        <Button
          onPress={onExit}
          fullWidth
          size="lg"
          variant="bordered"
          className="font-bold text-[#6B6960] border-[#E8E5E0] bg-[#FAFAF8] hover:bg-[#F0EDE8]"
        >
          Volver a Lecciones
        </Button>
      </div>
    </motion.div>
  );
}

// ── Página Principal ───────────────────────────────────────────────────────────

const DEFAULT_CORRECT_ORDER = ["role", "context", "task", "format", "tone"];

function LessonEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id") ?? "1-1";
  const EXERCISES = LESSON_EXERCISES[lessonId] ?? LESSON_EXERCISES["1-1"];
  const TOTAL_STEPS = EXERCISES.length;

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
    <div className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col h-[100dvh] overflow-hidden">
      {/* Header */}
      {!isFinished && (
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#E8E5E0] bg-white">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.back()}
            aria-label="Salir de la lección"
            className="text-[#6B6960] hover:text-[#1A1A18] shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </Button>
          <LessonProgressBar progress={progress} />
          <HeartCounter hearts={hearts} />
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <h1 className="sr-only">Motor de Lecciones — Promptly</h1>
        {isFinished ? (
          <FinishedScreen onRestart={handleRestart} onExit={() => router.push("/lessons")} totalSteps={TOTAL_STEPS} />
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
                <div className="flex items-center gap-2 mb-5">
                  <Chip
                    size="sm"
                    variant="flat"
                    classNames={{ base: "bg-[#FAFAF8] border border-[#E8E5E0]", content: "text-[#9C9890] font-bold text-xs uppercase tracking-widest" }}
                  >
                    {currentStep + 1} / {TOTAL_STEPS}
                  </Chip>
                </div>

                {exercise.type === "chat" && (
                  <ChatComponent exercise={exercise} onComplete={handleContinue} />
                )}
                {exercise.type === "concept" && (
                  <ConceptCardComponent exercise={exercise} onComplete={handleContinue} />
                )}
                {exercise.type === "audio" && (
                  <AudioComponent exercise={exercise} onComplete={handleContinue} onWrongAnswer={handleWrongAnswer} />
                )}
                {exercise.type === "story" && (
                  <StoryComponent exercise={exercise} onComplete={handleContinue} onWrongAnswer={handleWrongAnswer} />
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
                  <PromptDropZone isChecked={isChecked} onPlacedChange={setDropzonePlaced} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer */}
      {!isFinished && !isSelfContained && (
        <footer className="shrink-0 border-t border-[#E8E5E0] bg-white px-4 pt-3 pb-6">
          <AnimatePresence mode="wait">
            <FeedbackBanner key={lessonState} state={lessonState} theoryExplanation={theoryExplanation} />
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

export default function LessonPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E2654A] border-t-transparent animate-spin" />
      </div>
    }>
      <LessonEngine />
    </Suspense>
  );
}

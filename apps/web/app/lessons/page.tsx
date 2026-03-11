import Link from "next/link";

const modules = [
  {
    id: 1,
    title: "Módulo 1: Fundamentos del Prompt",
    description: "Aprende la sintaxis básica y el comportamiento de los LLMs.",
    lessons: [
      { id: "1-1", title: "Hola Mundo (Zero-Shot)", desc: "La instrucción más simple posible.", status: "completed", xp: 100 },
      { id: "1-2", title: "Añadir Contexto", desc: "Proporcionar información de fondo para guiar las respuestas.", status: "completed", xp: 150 },
      { id: "1-3", title: "Formatear la Salida", desc: "Forzar a la IA a generar JSON, Markdown o tablas.", status: "completed", xp: 200 },
    ],
  },
  {
    id: 2,
    title: "Módulo 2: Técnicas Avanzadas",
    description: "Dominando el few-shot prompting y los system personas.",
    lessons: [
      { id: "2-1", title: "Few-Shot Prompting", desc: "Dar ejemplos para enseñar nuevos patrones.", status: "completed", xp: 250 },
      { id: "2-2", title: "Chain of Thought", desc: "Forzar al modelo a razonar paso a paso en matemáticas y lógica.", status: "current", xp: 300 },
      { id: "2-3", title: "System Personas", desc: "Adoptar identidades de experto.", status: "locked", xp: 350 },
    ],
  },
  {
    id: 3,
    title: "Módulo 3: Jailbreaks y Seguridad",
    description: "Comprendiendo la inyección de prompts y las barreras de seguridad.",
    lessons: [
      { id: "3-1", title: "Exploits de Roleplay", desc: "Cómo los actores maliciosos eluden los filtros de seguridad.", status: "locked", xp: 500 },
      { id: "3-2", title: "Prompting Defensivo", desc: "Redactar instrucciones de sistema seguras e inviolables.", status: "locked", xp: 500 },
    ],
  },
];

export default function LessonsPage() {
  return (
    <div className="relative isolate min-h-screen px-6 py-12 lg:px-8">
      {/* Background glow */}
      <div
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Currículo</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Domina el arte del prompt engineering a través de lecciones interactivas puntuadas por Claude.
          </p>
        </header>

        <div className="space-y-16">
          {modules.map((mod) => (
            <section key={mod.id} className="relative">
              <div className="mb-8 pl-8 border-l-2 border-emerald-500/30">
                <h2 className="text-2xl font-bold text-white mb-2">{mod.title}</h2>
                <p className="text-gray-400">{mod.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mod.lessons.map((lesson) => {
                  const isLocked = lesson.status === "locked";
                  const isCurrent = lesson.status === "current";
                  const isCompleted = lesson.status === "completed";

                  const cardClass = `relative rounded-2xl border p-6 flex flex-col transition-all ${
                    isLocked
                      ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                      : isCurrent
                      ? "border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] cursor-pointer"
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 cursor-pointer"
                  }`;

                  const cardContent = (
                    <>
                      <div className="absolute -top-3 right-4">
                        {isCompleted && (
                          <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                            ✓
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
                            Activa
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-xs font-bold text-gray-300 shadow-lg">
                            🔒
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <span className="text-xs font-mono text-emerald-400 mb-2 block">
                          Lección {lesson.id}
                        </span>
                        <h3 className={`text-lg font-bold mb-2 ${isLocked ? "text-gray-500" : "text-white"}`}>
                          {lesson.title}
                        </h3>
                        <p className={`text-sm ${isLocked ? "text-gray-600" : "text-gray-400"}`}>
                          {lesson.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs font-semibold">
                        <span className={isLocked ? "text-gray-600" : "text-emerald-400"}>
                          +{lesson.xp} XP
                        </span>
                        {!isLocked && (
                          <span className={isCurrent ? "text-emerald-300" : "text-gray-500"}>
                            {isCurrent ? "Empezar ➔" : "Repasar"}
                          </span>
                        )}
                      </div>
                    </>
                  );

                  return isLocked ? (
                    <div key={lesson.id} className={cardClass}>
                      {cardContent}
                    </div>
                  ) : (
                    <Link key={lesson.id} href="/lesson" className={cardClass}>
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

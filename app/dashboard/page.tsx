function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2z"
        fill="#E2654A" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11 2L4 11h6l-1 7 7-9h-6l1-7z" fill="#2D6A6A" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 18c-4-2-6-5-5-9 1-3 3-4 3-4s0 3 2 4c0-2 1-5 4-7-1 4 2 5 2 8 0 4-3 8-6 8z"
        fill="#D97706" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="#2D6A6A" strokeWidth="1.5" fill="none" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="#2D6A6A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SandboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="#E2654A" strokeWidth="1.5" fill="none" />
      <path d="M7 9l3 3 3-3" stroke="#E2654A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const stats = [
  { label: "Nivel",                  value: "3",       Icon: StarIcon, iconBg: "bg-[#FDF0ED]" },
  { label: "XP Total",               value: "1.240",   Icon: BoltIcon, iconBg: "bg-[#EFF6F6]" },
  { label: "Racha Actual",           value: "4 Días",  Icon: FlameIcon, iconBg: "bg-amber-50" },
  { label: "Lecciones Completadas",  value: "8/50",    Icon: BookIcon, iconBg: "bg-[#EFF6F6]" },
];

const quests = [
  { title: "Completa 1 Lección",               xp: 50,  done: true  },
  { title: "Obtén 90+ en el Sandbox",           xp: 100, done: false },
  { title: "Escribe un prompt de 300+ tokens",  xp: 75,  done: false },
];

export default function DashboardPage() {
  return (
    <div className="relative isolate min-h-screen px-6 py-12 lg:px-8 bg-[#FAFAF8] overflow-x-hidden">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl text-[#1A1A18]">Cuartel General de Daniel</h1>
          <p className="mt-2 text-lg leading-8 text-[#6B6960]">
            ¡Bienvenido de nuevo, Prompt Engineer! ¿Listo para subir de nivel?
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map(({ label, value, Icon, iconBg }) => (
            <div key={label} className="rounded-2xl border border-[#E8E5E0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B6960]">{label}</p>
                  <p className="font-display text-2xl text-[#1A1A18] leading-none mt-0.5">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-[#1A1A18]">Siguiente</h2>
            <div className="rounded-2xl border border-[#E8E5E0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center rounded-full bg-[#FDF0ED] px-3 py-1 text-xs font-semibold text-[#E2654A] border border-[#E2654A]/20 mb-4">
                    Módulo 2 · Lección 3
                  </span>
                  <h3 className="font-display text-xl text-[#1A1A18] mb-2">Configuración Avanzada de Tono y Persona</h3>
                  <p className="text-[#6B6960] max-w-md text-sm leading-relaxed">
                    Aprende a inyectar personas detalladas en modelos de IA para cambiar radicalmente su voz y perspectiva.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="h-16 w-16 rounded-full border-4 border-[#E2654A]/20 flex items-center justify-center relative">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                      <circle cx="50" cy="50" r="46" fill="transparent" stroke="#E8E5E0" strokeWidth="8" />
                      <circle cx="50" cy="50" r="46" fill="transparent" stroke="#E2654A" strokeWidth="8"
                        strokeDasharray="289" strokeDashoffset="220" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm font-bold text-[#E2654A]">25%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="/lessons"
                  className="inline-flex justify-center rounded-xl bg-[#E2654A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C9553D] transition-colors"
                >
                  Continuar Lección →
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1A1A18]">Misiones Diarias</h2>
            <div className="rounded-2xl border border-[#E8E5E0] bg-white p-5 space-y-4 shadow-sm">
              {quests.map((quest, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                    quest.done
                      ? "border-[#2D6A6A] bg-[#EFF6F6] text-[#2D6A6A]"
                      : "border-[#E8E5E0] bg-[#FAFAF8] text-[#9C9890]"
                  }`}>
                    {quest.done ? "✓" : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${quest.done ? "text-[#9C9890] line-through" : "text-[#1A1A18]"}`}>
                      {quest.title}
                    </p>
                    <p className="text-xs text-[#E2654A] font-semibold">+{quest.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#E8E5E0] bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FDF0ED] flex items-center justify-center mx-auto mb-3">
                <SandboxIcon />
              </div>
              <h3 className="text-base font-bold text-[#1A1A18] mb-1">Práctica Libre</h3>
              <p className="text-sm text-[#6B6960] mb-4">Prueba tus ideas con Claude 3.5 sin restricciones.</p>
              <a
                href="/sandbox"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#E2654A]/40 px-4 py-2.5 text-sm font-semibold text-[#E2654A] hover:bg-[#FDF0ED] transition-colors min-h-[44px]"
              >
                Entrar al Sandbox
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

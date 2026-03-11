export default function DashboardPage() {
    return (
        <div className="relative isolate min-h-screen px-6 py-12 lg:px-8 overflow-x-hidden">
            {/* Background glow */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-500 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>

            <div className="mx-auto max-w-5xl">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Cuartel General de Daniel</h1>
                    <p className="mt-2 text-lg leading-8 text-gray-400">
                        ¡Bienvenido de nuevo, Prompt Engineer! ¿Listo para subir de nivel?
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    {[
                        { label: "Nivel", value: "3", icon: "⭐", color: "from-amber-400 to-orange-500" },
                        { label: "XP Total", value: "1.240", icon: "⚡", color: "from-violet-400 to-indigo-500" },
                        { label: "Racha Actual", value: "4 Días", icon: "🔥", color: "from-rose-400 to-red-500" },
                        { label: "Lecciones Completadas", value: "8/50", icon: "📚", color: "from-emerald-400 to-teal-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm group hover:border-white/20 transition-all">
                            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Action Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white">Siguiente</h2>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-1 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-black/40 rounded-xl p-8 backdrop-blur-md border border-white/5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 ring-1 ring-inset ring-violet-500/20 mb-4">
                                            Módulo 2 • Lección 3
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-2">Configuración Avanzada de Tono y Persona</h3>
                                        <p className="text-gray-400 max-w-md">Aprende a inyectar personas detalladas en modelos de IA para cambiar radicalmente su voz y perspectiva.</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="h-16 w-16 rounded-full border-4 border-violet-500/30 flex items-center justify-center relative">
                                            <svg className="absolute inset-0 h-full w-full rotate-[-90deg] transform" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-violet-500" strokeDasharray="289" strokeDashoffset="220" />
                                            </svg>
                                            <span className="text-xl font-bold text-white">25%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <a href="/lessons" className="inline-flex justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                                        Continuar Lección ➔
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Misiones Diarias</h2>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                            {[
                                { title: "Completa 1 Lección", xp: 50, done: true },
                                { title: "Obtén 90+ en el Sandbox", xp: 100, done: false },
                                { title: "Escribe un prompt de 300+ tokens", xp: 75, done: false },
                            ].map((quest, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${quest.done ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-white/10 bg-white/5 text-gray-500'}`}>
                                        {quest.done ? '✓' : i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${quest.done ? 'text-gray-300 line-through opacity-70' : 'text-white'}`}>{quest.title}</p>
                                        <p className="text-xs text-violet-400">+{quest.xp} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent p-6 text-center">
                            <h3 className="text-lg font-bold text-white mb-2">Práctica Libre</h3>
                            <p className="text-sm text-gray-400 mb-6">Prueba tus ideas con Claude 3.5 sin restricciones.</p>
                            <a href="/sandbox" className="inline-block rounded-xl border border-violet-500/50 px-4 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/10 transition-colors w-full min-h-[44px] flex items-center justify-center">
                                Entrar al Sandbox
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

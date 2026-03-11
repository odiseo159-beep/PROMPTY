export default function LeaderboardPage() {
    const users = [
        { rank: 1, name: "Daniel F.", username: "@odiseo", xp: 12400, level: 12, trend: "up", avatar: "🤖" },
        { rank: 2, name: "Alex Chen", username: "@alexc", xp: 11850, level: 11, trend: "same", avatar: "⚡" },
        { rank: 3, name: "Sarah J.", username: "@sarah_j", xp: 10200, level: 10, trend: "up", avatar: "✨" },
        { rank: 4, name: "Mike T.", username: "@mike_tech", xp: 9500, level: 9, trend: "down", avatar: "👨‍💻" },
        { rank: 5, name: "Elena R.", username: "@elena_prompts", xp: 8900, level: 9, trend: "up", avatar: "🎨" },
        { rank: 6, name: "David K.", username: "@davidk", xp: 8200, level: 8, trend: "same", avatar: "🧠" },
        { rank: 7, name: "AI Whisperer", username: "@whisper", xp: 7500, level: 8, trend: "down", avatar: "🔮" },
        { rank: 8, name: "Leo M.", username: "@leo_m", xp: 6800, level: 7, trend: "up", avatar: "🚀" },
    ];

    const getMedalColor = (rank: number) => {
        if (rank === 1) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
        if (rank === 2) return "text-gray-300 bg-gray-300/10 border-gray-300/30";
        if (rank === 3) return "text-amber-600 bg-amber-600/10 border-amber-600/30";
        return "text-gray-500 bg-white/5 border-white/5";
    };

    return (
        <div className="relative isolate min-h-screen px-6 py-12 lg:px-8">
            {/* Background glow */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-fuchsia-500 to-pink-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>

            <div className="mx-auto max-w-4xl">
                <header className="mb-12 text-center">
                    <span className="text-6xl mb-4 block">🏆</span>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Clasificación Global</h1>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        Las clasificaciones se actualizan diariamente según las lecciones completadas y las mejores puntuaciones del Sandbox.
                    </p>
                </header>

                <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md overflow-hidden">
                    {/* Header row */}
                    <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-white/5 p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <div className="col-span-2 sm:col-span-1 text-center">Puesto</div>
                        <div className="col-span-7 sm:col-span-6">Prompt Engineer</div>
                        <div className="col-span-3 sm:col-span-2 text-center">Nivel</div>
                        <div className="hidden sm:block sm:col-span-3 text-right pr-4">XP Total</div>
                    </div>

                    {/* User rows */}
                    <div className="divide-y divide-white/5">
                        {users.map((user) => (
                            <div
                                key={user.rank}
                                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-white/[0.02] ${user.rank <= 3 ? 'bg-gradient-to-r from-white/[0.03] to-transparent' : ''}`}
                            >
                                {/* Rank Badge */}
                                <div className="col-span-2 sm:col-span-1 flex justify-center">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${getMedalColor(user.rank)} font-bold`}>
                                        {user.rank}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="col-span-7 sm:col-span-6 flex items-center gap-4">
                                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl border border-white/5">
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            {user.name}
                                            {user.rank === 1 && <span className="text-yellow-400 text-xs text-shadow-glow">👑</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-mono">{user.username}</p>
                                    </div>
                                </div>

                                {/* Level */}
                                <div className="col-span-3 sm:col-span-2 flex justify-center">
                                    <span className="inline-flex items-center rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-400 border border-fuchsia-500/20">
                                        Niv. {user.level}
                                    </span>
                                </div>

                                {/* XP Score */}
                                <div className="hidden sm:flex sm:col-span-3 justify-end items-center gap-3 pr-4">
                                    <span className="font-mono font-bold text-emerald-400">
                                        {user.xp.toLocaleString()} XP
                                    </span>
                                    {user.trend === 'up' && <span className="text-emerald-500 text-xs">▲</span>}
                                    {user.trend === 'down' && <span className="text-rose-500 text-xs">▼</span>}
                                    {user.trend === 'same' && <span className="text-gray-600 text-xs">—</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function CommitInsights({ commitPatterns, isLightMode, bgSubCard, textSub }) {
  const barColor = isLightMode ? "bg-emerald-500" : "bg-[#00ff66]";

  return (
    <div className={`relative z-10 rounded-lg border p-3 text-xs font-mono ${bgSubCard}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          // insights
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-[#00ff66]/20"}`} />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[9px] uppercase tracking-wider ${textSub}`}>Developer Rhythm</span>
            <span className="text-[10px] font-semibold">{commitPatterns.timeOfDay}</span>
          </div>
          <div className="mt-1.5 w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${commitPatterns.nightOwlRatio}%` }} />
          </div>
          <p className={`mt-1 text-[9px] ${textSub}`}>{commitPatterns.nightOwlRatio}% Night Commits</p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[9px] uppercase tracking-wider ${textSub}`}>Commit Habits</span>
            <span className="text-[10px] font-semibold">{commitPatterns.dayOfWeek}</span>
          </div>
          <div className="mt-1.5 w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${commitPatterns.weekendRatio}%` }} />
          </div>
          <p className={`mt-1 text-[9px] ${textSub}`}>{commitPatterns.weekendRatio}% Weekend Commits</p>
        </div>
      </div>
    </div>
  );
}

import { Zap, MoonStar, CalendarDays, Flame } from "lucide-react";

function InsightRow({ icon: Icon, label, value, themeColor, accent = false, isLightMode }) {
  return (
    <div className={`flex items-center justify-between gap-1 py-0.5 border-b ${isLightMode ? "border-zinc-100/40" : "border-zinc-900/30"} last:border-b-0`}>
      <div className="flex items-center gap-1 min-w-0">
        <Icon className="w-2.5 h-2.5 shrink-0 text-zinc-500" />
        <span className="text-[7.5px] font-mono uppercase tracking-wider truncate text-zinc-500">{label}</span>
      </div>
      <span
        className={`text-[8px] font-semibold font-mono break-words text-right shrink-0 ${accent ? "animate-pulse" : ""}`}
        style={{ color: accent ? themeColor : undefined }}
      >
        {value}
      </span>
    </div>
  );
}

function InsightBadge({ icon: Icon, label, value, themeColor, isLightMode }) {
  return (
    <div className={`rounded-xl border px-2.5 py-2 ${isLightMode ? "bg-white border-zinc-200" : "bg-black/40 border-zinc-800"}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">{label}</span>
        <Icon className="w-3.5 h-3.5" style={{ color: themeColor }} />
      </div>
      <div className="text-xs font-semibold font-mono" style={{ color: themeColor }}>{value}</div>
    </div>
  );
}

export default function CommitInsights({ commitPatterns, isLightMode, bgSubCard, textSub, isNested = false, themeColor = "#00ff66" }) {
  const content = (
    <>
      {!isNested && (
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: themeColor }}>
            // player.perks (commits)
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${themeColor}33` }} />
        </div>
      )}

      {isNested ? (
        <div className="flex flex-col gap-1 w-full overflow-hidden">
          <InsightRow icon={MoonStar} label="Time" value={commitPatterns.timeOfDay} themeColor={themeColor} isLightMode={isLightMode} />
          <InsightRow icon={CalendarDays} label="Days" value={commitPatterns.dayOfWeek} themeColor={themeColor} isLightMode={isLightMode} />
          <InsightRow icon={Zap} label="Night" value={`${commitPatterns.nightOwlRatio}%`} themeColor={themeColor} accent isLightMode={isLightMode} />
          <InsightRow icon={Flame} label="Weekend" value={`${commitPatterns.weekendRatio}%`} themeColor={themeColor} accent isLightMode={isLightMode} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          <InsightBadge icon={MoonStar} label="Commit Time" value={commitPatterns.timeOfDay} themeColor={themeColor} isLightMode={isLightMode} />
          <InsightBadge icon={CalendarDays} label="Commit Days" value={commitPatterns.dayOfWeek} themeColor={themeColor} isLightMode={isLightMode} />
          <InsightBadge icon={Zap} label="Night Commits" value={`${commitPatterns.nightOwlRatio}%`} themeColor={themeColor} isLightMode={isLightMode} />
          <InsightBadge icon={Flame} label="Weekend Commits" value={`${commitPatterns.weekendRatio}%`} themeColor={themeColor} isLightMode={isLightMode} />
        </div>
      )}

      {!isNested && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[9px] uppercase tracking-wider ${textSub}`}>Night Commit Ratio</span>
            <span className={`text-[9px] ${textSub}`}>{commitPatterns.nightOwlRatio}%</span>
          </div>
          <div className="w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.max(commitPatterns.nightOwlRatio, 15)}%`, backgroundColor: themeColor }} />
          </div>
        </div>
      )}
    </>
  );

  if (isNested) return <div className="relative z-10 text-xs font-mono">{content}</div>;

  return (
    <div className={`relative z-10 rounded-lg border p-3 text-xs font-mono ${bgSubCard}`}>
      {content}
    </div>
  );
}

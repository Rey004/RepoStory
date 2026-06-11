import { Zap, MoonStar, CalendarDays, Flame } from "lucide-react";

function InsightBadge({ icon: Icon, label, value, toneClass, isLightMode }) {
  return (
    <div className={`rounded-xl border px-2.5 py-2 ${isLightMode ? "bg-white border-zinc-200" : "bg-black/40 border-zinc-800"}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-[9px] uppercase tracking-wider font-mono ${isLightMode ? "text-zinc-500" : "text-zinc-500"}`}>{label}</span>
        <Icon className={`w-3.5 h-3.5 ${toneClass}`} />
      </div>
      <div className={`text-xs font-semibold font-mono ${toneClass}`}>{value}</div>
    </div>
  );
}

function InsightRow({ icon: Icon, label, value, toneClass, isLightMode }) {
  return (
    <div className={`flex items-center justify-between gap-1 py-0.5 border-b ${isLightMode ? "border-zinc-100/40" : "border-zinc-900/30"} last:border-b-0`}>
      <div className="flex items-center gap-1 min-w-0">
        <Icon className={`w-2.5 h-2.5 shrink-0 ${isLightMode ? "text-zinc-400" : "text-zinc-555"}`} />
        <span className={`text-[7.5px] font-mono uppercase tracking-wider truncate ${isLightMode ? "text-zinc-400" : "text-zinc-500"}`}>
          {label}
        </span>
      </div>
      <span className={`text-[8px] font-semibold font-mono break-words text-right shrink-0 ${toneClass}`}>
        {value}
      </span>
    </div>
  );
}

function InsightGridItem({ icon: Icon, label, value, toneClass, isLightMode }) {
  const formatValue = (val) => {
    if (val === "Daylight Developer") return "Daylight Dev";
    if (val === "Office Hours Only") return "Office Hours";
    if (val === "Weekday Warrior") return "Weekday Dev";
    if (val === "Weekend Warrior") return "Weekend Dev";
    return val;
  };

  return (
    <div className="flex flex-col gap-0.5 min-w-0 text-left">
      <div className="flex items-center gap-1 min-w-0">
        <Icon className={`w-2.5 h-2.5 shrink-0 ${isLightMode ? "text-zinc-400" : "text-zinc-550"}`} />
        <span className={`text-[7.5px] font-mono uppercase tracking-wider truncate ${isLightMode ? "text-zinc-400" : "text-zinc-505"}`}>
          {label}
        </span>
      </div>
      <span className={`text-[8.5px] font-semibold font-mono truncate ${toneClass}`}>
        {formatValue(value)}
      </span>
    </div>
  );
}

export default function CommitInsights({ commitPatterns, isLightMode, bgSubCard, textSub, isNested = false }) {
  const barColor = isLightMode ? "bg-emerald-500" : "bg-[#00ff66]";

  const content = (
    <>
      {!isNested && (
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-green-level-4"}`}>
            // player.perks (commits)
          </span>
          <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-green-level-4/20"}`} />
        </div>
      )}

      {isNested ? (
        <div className="flex flex-col gap-1 w-full overflow-hidden">
          <InsightRow
            icon={MoonStar}
            label="Time"
            value={commitPatterns.timeOfDay}
            toneClass={isLightMode ? "text-zinc-900" : "text-white"}
            isLightMode={isLightMode}
          />
          <InsightRow
            icon={CalendarDays}
            label="Days"
            value={commitPatterns.dayOfWeek}
            toneClass={isLightMode ? "text-zinc-900" : "text-white"}
            isLightMode={isLightMode}
          />
          <InsightRow
            icon={Zap}
            label="Night"
            value={`${commitPatterns.nightOwlRatio}%`}
            toneClass={isLightMode ? "text-emerald-600 animate-pulse" : "text-green-level-4 animate-pulse"}
            isLightMode={isLightMode}
          />
          <InsightRow
            icon={Flame}
            label="Weekend"
            value={`${commitPatterns.weekendRatio}%`}
            toneClass={isLightMode ? "text-emerald-600 animate-pulse" : "text-green-level-4 animate-pulse"}
            isLightMode={isLightMode}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          <InsightBadge
            icon={MoonStar}
            label="Commit Time"
            value={commitPatterns.timeOfDay}
            toneClass={isLightMode ? "text-emerald-600" : "text-green-level-4"}
            isLightMode={isLightMode}
          />
          <InsightBadge
            icon={CalendarDays}
            label="Commit Days"
            value={commitPatterns.dayOfWeek}
            toneClass={isLightMode ? "text-emerald-600" : "text-green-level-4"}
            isLightMode={isLightMode}
          />
          <InsightBadge
            icon={Zap}
            label="Night Commits"
            value={`${commitPatterns.nightOwlRatio}%`}
            toneClass={isLightMode ? "text-amber-500" : "text-green-level-4"}
            isLightMode={isLightMode}
          />
          <InsightBadge
            icon={Flame}
            label="Weekend Commits"
            value={`${commitPatterns.weekendRatio}%`}
            toneClass={isLightMode ? "text-amber-500" : "text-green-level-4"}
            isLightMode={isLightMode}
          />
        </div>
      )}

      {!isNested && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[9px] uppercase tracking-wider ${textSub}`}>Night Commit Ratio</span>
            <span className={`text-[9px] ${textSub}`}>{commitPatterns.nightOwlRatio}%</span>
          </div>
          <div className="w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(commitPatterns.nightOwlRatio, 15)}%` }} />
          </div>
        </div>
      )}
    </>
  );

  if (isNested) {
    return <div className="relative z-10 text-xs font-mono">{content}</div>;
  }

  return (
    <div className={`relative z-10 rounded-lg border p-3 text-xs font-mono ${bgSubCard}`}>
      {content}
    </div>
  );
}

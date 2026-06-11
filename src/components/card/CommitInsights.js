import { Zap, MoonStar, CalendarDays, Flame } from "lucide-react";

function InsightRow({ icon: Icon, label, value, themeColor, accent = false, isLightMode }) {
  return (
    <div className={`flex items-center justify-between gap-1 py-0.5 border-b ${isLightMode ? "border-zinc-100/40" : "border-zinc-900/30"} last:border-b-0`}>
      <div className="flex items-center gap-1 min-w-0">
        <Icon className="w-3 h-3 shrink-0 white" />
        <span className="text-[9px] font-mono uppercase tracking-wider truncate white">{label}</span>
      </div>
      <span
        className={`text-[9px] font-bold font-mono break-words text-right shrink-0 ${accent ? "animate-pulse" : ""}`}
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
      <div className="text-xs font-bold font-mono" style={{ color: themeColor }}>{value}</div>
    </div>
  );
}

export default function CommitInsights({
  commitPatterns,
  isLightMode,
  // kept for backwards compatibility; current card only renders the nested layout
  bgSubCard,
  textSub,
  isNested = false,
  themeColor = "#00ff66",
}) {
  const nestedContent = (
    <div className="flex flex-col gap-1 w-full overflow-hidden">
      <InsightRow
        icon={MoonStar}
        label="Time"
        value={commitPatterns.timeOfDay}
        themeColor={themeColor}
        isLightMode={isLightMode}
      />
      <InsightRow
        icon={CalendarDays}
        label="Days"
        value={commitPatterns.dayOfWeek}
        themeColor={themeColor}
        isLightMode={isLightMode}
      />
      <InsightRow
        icon={Zap}
        label="Night"
        value={`${commitPatterns.nightOwlRatio}%`}
        themeColor={themeColor}
        accent
        isLightMode={isLightMode}
      />
      <InsightRow
        icon={Flame}
        label="Weekend"
        value={`${commitPatterns.weekendRatio}%`}
        themeColor={themeColor}
        accent
        isLightMode={isLightMode}
      />
    </div>
  );

  // RepoStoryCard always uses CommitInsights with isNested={true}
  return <div className="relative z-10 text-xs font-mono">{nestedContent}</div>;
}

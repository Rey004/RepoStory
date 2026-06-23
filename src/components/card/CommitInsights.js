import { Zap, MoonStar, CalendarDays, Flame } from "lucide-react";

function InsightRow({ icon: Icon, label, value, themeColor, accent = false, isLightMode }) {
  return (
    <div className={`flex items-start justify-between gap-x-2 py-0.5 border-b ${isLightMode ? "border-zinc-100/40" : "border-zinc-900/30"} last:border-b-0`}>
      <div className="flex items-center gap-1 shrink-0">
        <Icon className="w-3 h-3 shrink-0 white" />
        <span className="text-[9px] font-mono uppercase tracking-wider white">{label}</span>
      </div>
      <span
        className={`text-[9px] font-bold font-mono text-right leading-tight ${accent ? "animate-pulse" : ""}`}
        style={{ color: accent ? themeColor : undefined }}
      >
        {value}
      </span>
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
        label="Peak Hours"
        value={`${commitPatterns.timeOfDay} coder`}
        themeColor={themeColor}
        isLightMode={isLightMode}
      />
      <InsightRow
        icon={CalendarDays}
        label="Work Style"
        value={`${commitPatterns.dayOfWeek} dev`}
        themeColor={themeColor}
        isLightMode={isLightMode}
      />
      <InsightRow
        icon={Zap}
        label="After Dark"
        value={`${commitPatterns.nightOwlRatio}% night commits`}
        themeColor={themeColor}
        accent
        isLightMode={isLightMode}
      />
      <InsightRow
        icon={Flame}
        label="Off-Days"
        value={`${commitPatterns.weekendRatio}% weekend commits`}
        themeColor={themeColor}
        accent
        isLightMode={isLightMode}
      />
    </div>
  );

  // RepoStoryCard always uses CommitInsights with isNested={true}
  return <div className="relative z-10 text-xs font-mono">{nestedContent}</div>;
}

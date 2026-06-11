export default function CardDescription({ description, readmeSummary, isLightMode, showLabel = true, themeColor = "#00ff66" }) {
  const cleanedDescription = description?.trim();
  const hasRepoDescription = cleanedDescription && cleanedDescription !== "No description provided.";
  const text = hasRepoDescription
    ? cleanedDescription
    : (readmeSummary?.trim() || "No description provided.");
  const sourceLabel = hasRepoDescription ? "repo.description" : "readme.summary";

  return (
    <div className="relative z-10">
      {showLabel && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: themeColor }}>
            // {sourceLabel}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${themeColor}33` }} />
        </div>
      )}
      <p
        className={`font-mono leading-relaxed ${showLabel ? "px-3 py-2.5 rounded-lg border-l-2 text-xs" : "px-0 py-0 text-[11px]"} ${
          isLightMode ? "text-zinc-700" : "text-zinc-300"
        }`}
        style={
          showLabel
            ? {
                borderLeftColor: themeColor,
                backgroundColor: `${themeColor}08`,
              }
            : {}
        }
      >
        {text}
      </p>
    </div>
  );
}

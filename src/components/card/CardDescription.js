export default function CardDescription({ description, readmeSummary, isLightMode, showLabel = true }) {
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
          <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-green-level-4"}`}>
            // {sourceLabel}
          </span>
          <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-green-level-4/20"}`} />
        </div>
      )}
      <p
        className={`font-mono leading-relaxed ${showLabel ? "px-3 py-2.5 rounded-lg border-l-2 text-xs" : "px-0 py-0 text-[11px]"} ${
          isLightMode
            ? "bg-zinc-50 border-emerald-500 text-zinc-700"
            : "bg-green-level-4/3 border-green-level-4 text-zinc-300"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

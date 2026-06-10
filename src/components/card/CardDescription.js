export default function CardDescription({ description, readmeSummary, isLightMode }) {
  const cleanedDescription = description?.trim();
  const hasRepoDescription = cleanedDescription && cleanedDescription !== "No description provided.";
  const text = hasRepoDescription
    ? cleanedDescription
    : (readmeSummary?.trim() || "No description provided.");
  const sourceLabel = hasRepoDescription ? "repo.description" : "readme.summary";

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          // {sourceLabel}
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-[#00ff66]/20"}`} />
      </div>
      <p
        className={`text-xs font-mono leading-relaxed px-3 py-2.5 rounded-lg border-l-2 ${
          isLightMode
            ? "bg-zinc-50 border-emerald-500 text-zinc-700"
            : "bg-[#00ff66]/[0.03] border-[#00ff66] text-zinc-300"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

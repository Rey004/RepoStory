import { GitCommit, GitBranch, Rocket, CircleDot, FilePlus2, ListTree } from "lucide-react";

function TimelineIcon({ type, isLightMode }) {
  const className = `w-3 h-3 shrink-0 ${isLightMode ? "text-emerald-600" : "text-green-level-4"}`;

  switch (type) {
    case "birth":
      return <CircleDot className={className} />;
    case "release":
      return <Rocket className={className} />;
    case "push":
      return <GitBranch className={className} />;
    default:
      return <GitCommit className={className} />;
  }
}

function getStoryIcon(item, index) {
  if (item.type === "birth") return FilePlus2;
  if (item.type === "release") return Rocket;
  if (item.type === "push") return GitBranch;
  return index >= 3 ? ListTree : GitCommit;
}

export default function CommitTimeline({ milestones, isLightMode, textMuted, textSub }) {
  const rootItem = milestones.find((item) => item.type === "birth") || milestones[0];
  const branchItems = milestones.filter((item) => item !== rootItem);

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-green-level-4"}`}>
          // repo.tree
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-green-level-4/20"}`} />
      </div>

      <div className={`relative rounded-xl border overflow-hidden ${isLightMode ? "border-emerald-100 bg-white" : "border-green-level-4/15 bg-black/30"}`}>
        <div className={`absolute inset-0 ${isLightMode ? "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_60%)]" : "bg-[radial-gradient(circle_at_top,rgba(0,255,102,0.08),transparent_60%)]"}`} />
        <div className="relative p-3.5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-mono uppercase tracking-wider ${isLightMode ? "bg-white border-emerald-200 text-emerald-700" : "bg-zinc-950/80 border-green-level-4/20 text-green-level-4"}`}>
                <ListTree className="w-3 h-3" />
                tree
              </span>
              <span className={`text-[9px] font-mono ${textSub}`}>root starts at repo creation</span>
            </div>
            <span className={`text-[9px] font-mono px-2 py-1 rounded-full border ${isLightMode ? "bg-white border-zinc-200 text-zinc-500" : "bg-zinc-950/80 border-zinc-800 text-zinc-500"}`}>
              {milestones.length} nodes
            </span>
          </div>

          {rootItem && (
            <div className={`rounded-lg border p-3 mb-3 ${isLightMode ? "bg-emerald-50 border-emerald-100" : "bg-zinc-950/60 border-zinc-800"}`}>
              <div className="flex items-center gap-2 mb-1">
                <CircleDot className={`w-3.5 h-3.5 ${isLightMode ? "text-emerald-600" : "text-green-level-4"}`} />
                <span className={`text-[11px] font-semibold font-mono ${isLightMode ? "text-emerald-800" : "text-green-level-4"}`}>
                  root
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${isLightMode ? "bg-white border-emerald-200 text-emerald-700" : "bg-black/60 border-green-level-4/20 text-green-level-4"}`}>
                  {rootItem.dateLabel}
                </span>
              </div>
              <p className={`text-[10px] font-mono leading-snug ${textMuted}`}>{rootItem.description}</p>
            </div>
          )}

          <div className="relative pl-5">
            <div className={`absolute left-2 top-0 bottom-1 w-px ${isLightMode ? "bg-emerald-200" : "bg-green-level-4/25"}`} />
            <div className="flex flex-col gap-2.5">
              {branchItems.map((item, index) => {
                const StoryIcon = getStoryIcon(item, index + 1);
                return (
                  <div key={item.id || index} className="relative pl-4">
                    <div className={`absolute left-px top-2 w-3 h-3 rounded-full border-2 ${isLightMode ? "bg-white border-emerald-300" : "bg-black border-green-level-4/50"}`} />
                    <div className={`rounded-lg border p-2.5 ${index % 2 === 0 ? (isLightMode ? "bg-white border-zinc-200" : "bg-black/35 border-zinc-800") : (isLightMode ? "bg-emerald-50 border-emerald-100" : "bg-zinc-950/60 border-zinc-800")}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <StoryIcon className={`w-3.5 h-3.5 ${isLightMode ? "text-emerald-600" : "text-green-level-4"}`} />
                          <span className={`text-[10px] font-semibold font-mono truncate ${isLightMode ? "text-emerald-800" : "text-green-level-4"}`}>
                            {item.title}
                          </span>
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${isLightMode ? "bg-white border-zinc-200 text-zinc-500" : "bg-black/60 border-zinc-800 text-zinc-500"}`}>
                          {item.dateLabel}
                        </span>
                      </div>
                      <p className={`text-[10px] font-mono leading-snug ${textMuted}`}>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

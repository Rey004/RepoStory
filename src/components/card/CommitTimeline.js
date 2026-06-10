import { GitCommit, GitBranch, Rocket, CircleDot } from "lucide-react";

function TimelineIcon({ type, isLightMode }) {
  const className = `w-3 h-3 shrink-0 ${isLightMode ? "text-emerald-600" : "text-[#00ff66]"}`;

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

export default function CommitTimeline({ milestones, isLightMode, textMuted, textSub }) {
  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          // project.timeline
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-[#00ff66]/20"}`} />
      </div>

      <div className="relative pl-4">
        <div
          className={`absolute left-[5px] top-1 bottom-1 w-px ${
            isLightMode ? "bg-emerald-200" : "bg-[#00ff66]/25"
          }`}
        />

        <div className="flex flex-col gap-3.5">
          {milestones.map((item, index) => (
            <div key={item.id || index} className="relative flex gap-3 text-left">
              <div
                className={`absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2 z-10 ${
                  index === milestones.length - 1
                    ? isLightMode
                      ? "bg-emerald-500 border-emerald-300"
                      : "bg-[#00ff66] border-[#33ff85]"
                    : isLightMode
                      ? "bg-white border-emerald-300"
                      : "bg-black border-[#00ff66]/50"
                }`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <TimelineIcon type={item.type} isLightMode={isLightMode} />
                    <span
                      className={`text-[11px] font-semibold font-mono truncate ${
                        isLightMode ? "text-emerald-800" : "text-[#00ff66]"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono shrink-0 ${textSub}`}>{item.dateLabel}</span>
                </div>
                <p className={`text-[10px] font-mono leading-snug ${textMuted}`}>{item.description}</p>
                {item.sha && (
                  <span
                    className={`inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isLightMode ? "bg-zinc-100 text-zinc-600" : "bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    {item.sha}
                    {item.author ? ` · ${item.author}` : ""}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

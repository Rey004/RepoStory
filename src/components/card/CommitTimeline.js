import React from "react";
import { GitCommit, GitBranch, Rocket, Star } from "lucide-react";

function TimelineNodeIcon({ type, isLightMode, isLatestCommit }) {
  if (isLatestCommit) {
    return <GitCommit className={`w-3.5 h-3.5 shrink-0 ${isLightMode ? "text-blue-600" : "text-blue-400"}`} />;
  }
  const iconClass = `w-3.5 h-3.5 shrink-0 ${isLightMode ? "text-emerald-600" : "text-[#00ff66]"}`;
  switch (type) {
    case "birth":
      return <Star className={`w-3.5 h-3.5 shrink-0 ${isLightMode ? "text-amber-500 fill-amber-400/20" : "text-amber-400 fill-amber-400/20"}`} />;
    case "release":
      return <Rocket className={iconClass} />;
    case "push":
      return <GitBranch className={iconClass} />;
    default:
      return <GitCommit className={iconClass} />;
  }
}

export default function CommitTimeline({ milestones, isLightMode, textMuted, textSub }) {
  const isBirthMilestone = (m) => {
    if (!m) return false;
    return m.type === "birth";
  };

  const isLatestCommitMilestone = (m) => {
    if (!m) return false;
    return m.title === "Latest Commit";
  };

  // Limit to 4 milestones for a perfect zigzag flowchart that fits the height
  const displayMilestones = milestones.slice(0, 4);
  const totalRows = Math.ceil(displayMilestones.length / 2);

  // Group milestones into rows
  const rows = [];
  for (let r = 0; r < totalRows; r++) {
    const leftIndex = r % 2 === 0 ? r * 2 : r * 2 + 1;
    const rightIndex = r % 2 === 0 ? r * 2 + 1 : r * 2;
    
    rows.push({
      left: displayMilestones[leftIndex],
      right: displayMilestones[rightIndex],
      isEven: r % 2 === 0,
      leftIdx: leftIndex,
      rightIdx: rightIndex
    });
  }

  return (
    <div className="relative z-10 w-full flex flex-col h-full justify-between select-none">
      {/* Header with Mac Tab Design */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/10 dark:border-zinc-200/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isLightMode ? "bg-emerald-700/60" : "bg-[#00ff66]/30"}`} />
          <span className={`w-2 h-2 rounded-full ${isLightMode ? "bg-emerald-500/70" : "bg-[#00ff66]/60"}`} />
          <span className={`w-2 h-2 rounded-full ${isLightMode ? "bg-emerald-400" : "bg-[#00ff66]"}`} />
        </div>
        <span className={`text-[9px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          {"// repo.timeline_flowchart"}
        </span>
      </div>

      {/* Flowchart Grid */}
      <div className="flex flex-col gap-6 relative p-1 pb-2 flex-1 justify-center">
        {rows.map((row, rIdx) => {
          const showRightArrow = row.isEven && row.left && row.right;
          const showLeftArrow = !row.isEven && row.left && row.right;
          
          // Vertical arrow logic:
          // If even row: down arrow on the right side if there's a next row and right element exists
          const showVerticalArrowRight = row.isEven && row.right && displayMilestones[row.rightIdx + 1];
          // If odd row: down arrow on the left side if there's a next row and left element exists
          const showVerticalArrowLeft = !row.isEven && row.left && displayMilestones[row.leftIdx + 1];

          return (
            <div key={rIdx} className="grid grid-cols-2 gap-x-12 relative">
              {/* Left Cell */}
              <div className="relative flex justify-center">
                {row.left ? (
                  <div 
                    className={`w-[195px] p-2 rounded-lg border text-left flex flex-col gap-1.5 relative ${
                      isBirthMilestone(row.left)
                        ? isLightMode
                          ? "bg-emerald-55/35 border-emerald-500/50 shadow-xs"
                          : "bg-[#001f0a]/35 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.08)] animate-[pulse_3s_infinite]"
                        : isLatestCommitMilestone(row.left)
                          ? isLightMode
                            ? "bg-blue-50/30 border-dashed border-blue-500/35 shadow-none"
                            : "bg-blue-950/25 border-dashed border-blue-500/45 shadow-[0_0_8px_rgba(59,130,246,0.08)]"
                          : isLightMode 
                            ? "bg-white border-zinc-200 shadow-xs" 
                            : "bg-zinc-950/60 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start gap-1.5 justify-between min-w-0">
                      <div className="flex items-start gap-1 min-w-0">
                        <span className="mt-0.5 shrink-0">
                          <TimelineNodeIcon type={row.left.type} isLightMode={isLightMode} isLatestCommit={isLatestCommitMilestone(row.left)} />
                        </span>
                        <span className={`text-[9.5px] font-bold font-mono break-words whitespace-normal ${isLightMode ? "text-zinc-850" : "text-zinc-200"}`}>
                          {row.left.title}
                        </span>
                      </div>
                      <span className="text-[7.5px] font-mono text-zinc-500 shrink-0 mt-0.5">
                        {row.left.dateLabel}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono leading-relaxed text-zinc-400 break-words line-clamp-2">
                      {row.left.description}
                    </p>

                    {/* Horizontal Arrow Right */}
                    {showRightArrow && (
                      <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+6px)] w-[36px] h-4 flex items-center justify-center pointer-events-none z-20">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 32 16" xmlns="http://www.w3.org/2000/svg">
                          <line x1="4" y1="8" x2="26" y2="8" stroke={isLightMode ? "#10b981" : "#00ff66"} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                          <path d="M24 5l3 3-3 3" stroke={isLightMode ? "#047857" : "#00ff66"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}

                    {/* Vertical Arrow Down Left */}
                    {showVerticalArrowLeft && (
                      <div className="absolute top-[calc(100%+2px)] left-1/2 -translate-x-1/2 h-[20px] w-4 flex items-center justify-center pointer-events-none z-20">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                          <line x1="8" y1="2" x2="8" y2="14" stroke={isLightMode ? "#10b981" : "#00ff66"} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                          <path d="M5 12l3 3 3-3" stroke={isLightMode ? "#047857" : "#00ff66"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[195px] h-1" />
                )}
              </div>

              {/* Right Cell */}
              <div className="relative flex justify-center">
                {row.right ? (
                  <div 
                    className={`w-[195px] p-2 rounded-lg border text-left flex flex-col gap-1.5 relative ${
                      isBirthMilestone(row.right)
                        ? isLightMode
                          ? "bg-emerald-50/35 border-emerald-500/50 shadow-xs"
                          : "bg-[#001f0a]/35 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.08)] animate-[pulse_3s_infinite]"
                        : isLatestCommitMilestone(row.right)
                          ? isLightMode
                            ? "bg-blue-50/30 border-dashed border-blue-500/35 shadow-none"
                            : "bg-blue-950/25 border-dashed border-blue-500/45 shadow-[0_0_8px_rgba(59,130,246,0.08)]"
                          : isLightMode 
                            ? "bg-white border-zinc-200 shadow-xs" 
                            : "bg-zinc-950/60 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start gap-1.5 justify-between min-w-0">
                      <div className="flex items-start gap-1 min-w-0">
                        <span className="mt-0.5 shrink-0">
                          <TimelineNodeIcon type={row.right.type} isLightMode={isLightMode} isLatestCommit={isLatestCommitMilestone(row.right)} />
                        </span>
                        <span className={`text-[9.5px] font-bold font-mono break-words whitespace-normal ${isLightMode ? "text-zinc-850" : "text-zinc-200"}`}>
                          {row.right.title}
                        </span>
                      </div>
                      <span className="text-[7.5px] font-mono text-zinc-500 shrink-0 mt-0.5">
                        {row.right.dateLabel}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono leading-relaxed text-zinc-400 break-words line-clamp-2">
                      {row.right.description}
                    </p>

                    {/* Horizontal Arrow Left */}
                    {showLeftArrow && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-[calc(100%+6px)] w-[36px] h-4 flex items-center justify-center pointer-events-none z-20">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 32 16" xmlns="http://www.w3.org/2000/svg">
                          <line x1="28" y1="8" x2="6" y2="8" stroke={isLightMode ? "#10b981" : "#00ff66"} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                          <path d="M8 5l-3 3 3 3" stroke={isLightMode ? "#047857" : "#00ff66"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}

                    {/* Vertical Arrow Down Right */}
                    {showVerticalArrowRight && (
                      <div className="absolute top-[calc(100%+2px)] left-1/2 -translate-x-1/2 h-[20px] w-4 flex items-center justify-center pointer-events-none z-20">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                          <line x1="8" y1="2" x2="8" y2="14" stroke={isLightMode ? "#10b981" : "#00ff66"} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                          <path d="M5 12l3 3 3-3" stroke={isLightMode ? "#047857" : "#00ff66"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[195px] h-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

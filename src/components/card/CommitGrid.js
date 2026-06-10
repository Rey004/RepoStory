export default function CommitGrid({ commits, isLightMode }) {
  const gridRows = 7;
  const gridCols = 15;
  const totalDays = gridRows * gridCols;
  const today = new Date();

  const commitCounts = {};
  commits.forEach((c) => {
    try {
      const dateStr = new Date(c.date).toISOString().split("T")[0];
      commitCounts[dateStr] = (commitCounts[dateStr] || 0) + 1;
    } catch {
      /* skip invalid dates */
    }
  });

  const cells = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    const dateStr = targetDate.toISOString().split("T")[0];
    const count = commitCounts[dateStr] || 0;

    let level = 0;
    if (count > 0 && count <= 1) level = 1;
    else if (count > 1 && count <= 3) level = 2;
    else if (count > 3 && count <= 5) level = 3;
    else if (count > 5) level = 4;

    cells.push({ dateStr, count, level });
  }

  const rows = Array.from({ length: 7 }, () => []);
  cells.forEach((cell) => {
    const day = new Date(cell.dateStr).getDay();
    rows[day].push(cell);
  });

  const getBgClass = (level) => {
    if (isLightMode) {
      switch (level) {
        case 1: return "bg-emerald-100 border-emerald-200";
        case 2: return "bg-emerald-250 border-emerald-300";
        case 3: return "bg-emerald-450 border-emerald-550";
        case 4: return "bg-emerald-600 border-emerald-700";
        default: return "bg-zinc-100 border-zinc-200";
      }
    }
    switch (level) {
      case 1: return "bg-[#003314] border-[#004d1f]";
      case 2: return "bg-[#006629] border-[#008033]";
      case 3: return "bg-[#00b347] border-[#00cc52]";
      case 4: return "bg-[#00ff66] border-[#33ff85]";
      default: return "bg-zinc-900 border-zinc-800";
    }
  };

  return (
    <div
      className={`relative z-10 flex flex-col gap-1.5 p-3 rounded-lg border ${
        isLightMode ? "border-zinc-200 bg-zinc-50/80" : "border-zinc-800/80 bg-black/40"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Commit Activity</span>
        <span className="text-[9px] font-mono text-zinc-500">Last 105 Days</span>
      </div>
      <div className="flex gap-1.5 select-none">
        <div className="flex flex-col justify-between text-[8px] font-mono text-zinc-600 w-3.5 pr-0.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="flex-1 flex gap-1 justify-between overflow-x-auto pb-1 scrollbar-none">
          {Array.from({ length: gridCols }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1">
              {Array.from({ length: gridRows }).map((_, rowIdx) => {
                const cell = rows[rowIdx]?.[colIdx];
                if (!cell) {
                  return (
                    <div
                      key={rowIdx}
                      className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-800/50"
                    />
                  );
                }
                return (
                  <div
                    key={rowIdx}
                    title={`${cell.dateStr}: ${cell.count} commits`}
                    className={`w-2.5 h-2.5 rounded-sm border ${getBgClass(cell.level)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

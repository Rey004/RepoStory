export default function CommitGrid({ commits, isLightMode, themeColor = "#00ff66" }) {
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

  // Map level → opacity suffix for hex color
  const levelOpacity = { 1: "26", 2: "59", 3: "99", 4: "ff" };

  const getCellStyle = (level) => {
    if (level === 0) {
      return isLightMode
        ? { backgroundColor: "#f4f4f5", borderColor: "#e4e4e7" }
        : { backgroundColor: "#18181b", borderColor: "#27272a80" };
    }
    const opacity = levelOpacity[level];
    return {
      backgroundColor: `${themeColor}${opacity}`,
      borderColor: `${themeColor}${Math.min(parseInt(opacity, 16) + 0x20, 0xff).toString(16).padStart(2, "0")}`,
    };
  };

  return (
    <div className="relative z-10 flex flex-col gap-1.5 w-full bg-transparent">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">// commit.activity</span>
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
                const level = cell ? cell.level : 0;
                return (
                  <div
                    key={rowIdx}
                    title={cell ? `${cell.dateStr}: ${cell.count} commits` : ""}
                    className="w-3 h-3 rounded-sm border"
                    style={getCellStyle(level)}
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

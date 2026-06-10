import React from "react";
import { 
  Star, 
  GitFork, 
  AlertCircle, 
  Calendar, 
  Cpu, 
  TrendingUp, 
  User, 
  Users, 
  Sparkles, 
  Compass, 
  Shield, 
  Award,
  Zap,
  BookOpen
} from "lucide-react";

// Helper to render archetype icons dynamically
const ArchetypeIcon = ({ id, className = "w-5 h-5" }) => {
  switch (id) {
    case "solo_builder": return <User className={className} />;
    case "rising_star": return <TrendingUp className={className} />;
    case "hidden_gem": return <Sparkles className={className} />;
    case "community_favorite": return <Users className={className} />;
    case "legacy_giant": return <Shield className={className} />;
    default: return <Compass className={className} />;
  }
};

/**
 * Generate cells for a mini GitHub contribution commit grid (7 rows x 15 columns)
 * using the last 50 fetched commits.
 */
const CommitGrid = ({ commits, isLightMode }) => {
  // Initialize grid: 7 days (rows) x 15 weeks (columns)
  // Day 0 is Sunday, Day 6 is Saturday
  const gridRows = 7;
  const gridCols = 15;
  const totalDays = gridRows * gridCols;
  
  // Create an array of date objects starting from (totalDays) days ago up to today
  const cells = [];
  const today = new Date();
  
  // Create a map of YYYY-MM-DD -> commit count
  const commitCounts = {};
  commits.forEach(c => {
    try {
      const dateStr = new Date(c.date).toISOString().split("T")[0];
      commitCounts[dateStr] = (commitCounts[dateStr] || 0) + 1;
    } catch (e) {}
  });

  // Generate cells
  for (let i = totalDays - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    const dateStr = targetDate.toISOString().split("T")[0];
    const count = commitCounts[dateStr] || 0;
    
    // Determine color level (0 to 4)
    let level = 0;
    if (count > 0 && count <= 1) level = 1;
    else if (count > 1 && count <= 3) level = 2;
    else if (count > 3 && count <= 5) level = 3;
    else if (count > 5) level = 4;
    
    cells.push({
      dateStr,
      count,
      level
    });
  }

  // Group cells into 7 rows (Sunday to Saturday)
  const rows = Array.from({ length: 7 }, () => []);
  cells.forEach((cell) => {
    const date = new Date(cell.dateStr);
    const day = date.getDay();
    rows[day].push(cell);
  });

  // Level background classes
  const getBgClass = (level) => {
    if (isLightMode) {
      switch (level) {
        case 1: return "bg-emerald-100 border-emerald-200";
        case 2: return "bg-emerald-250 border-emerald-300";
        case 3: return "bg-emerald-450 border-emerald-550";
        case 4: return "bg-emerald-600 border-emerald-700";
        default: return "bg-zinc-100 border-zinc-200";
      }
    } else {
      switch (level) {
        case 1: return "bg-[#003314] border-[#004d1f]";
        case 2: return "bg-[#006629] border-[#008033]";
        case 3: return "bg-[#00b347] border-[#00cc52]";
        case 4: return "bg-[#00ff66] border-[#33ff85]";
        default: return "bg-zinc-900 border-zinc-800";
      }
    }
  };

  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-zinc-800/80 bg-black/40">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Recent Activity Grid</span>
        <span className="text-[9px] font-mono text-zinc-500">Last 105 Days</span>
      </div>
      <div className="flex gap-1.5 select-none">
        {/* Row labels */}
        <div className="flex flex-col justify-between text-[8px] font-mono text-zinc-600 w-3.5 pr-0.5">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>
        {/* Grid grid */}
        <div className="flex-1 flex gap-1 justify-between overflow-x-auto pb-1 scrollbar-none">
          {Array.from({ length: gridCols }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1">
              {Array.from({ length: gridRows }).map((_, rowIdx) => {
                const cell = rows[rowIdx]?.[colIdx];
                if (!cell) return <div key={rowIdx} className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-800/50" />;
                return (
                  <div
                    key={rowIdx}
                    title={`${cell.dateStr}: ${cell.count} commits`}
                    className={`w-2.5 h-2.5 rounded-sm border transition-all duration-300 hover:scale-125 ${getBgClass(cell.level)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 text-[8px] font-mono text-zinc-500 mt-1">
        <span>Less</span>
        <div className={`w-2 h-2 rounded-sm border ${isLightMode ? "bg-zinc-100 border-zinc-200" : "bg-zinc-900 border-zinc-800"}`} />
        <div className={`w-2 h-2 rounded-sm border ${getBgClass(1)}`} />
        <div className={`w-2 h-2 rounded-sm border ${getBgClass(2)}`} />
        <div className={`w-2 h-2 rounded-sm border ${getBgClass(3)}`} />
        <div className={`w-2 h-2 rounded-sm border ${getBgClass(4)}`} />
        <span>More</span>
      </div>
    </div>
  );
};

export default function RepoStoryCard({ data, cardRef, isLightMode = false }) {
  if (!data) return null;

  const { repoDetails, languages } = data.githubData;
  const { archetype, commitPatterns, story, milestones, growthInsights } = data.storyData;

  // Compute total language lines of code bytes
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const languageList = Object.entries(languages)
    .slice(0, 4) // Show top 4 languages
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
    }));

  // Style properties based on light/dark mode
  const bgMain = isLightMode 
    ? "bg-white text-black border-zinc-300" 
    : "bg-black text-white border-zinc-800";
  
  const textMuted = isLightMode ? "text-zinc-600" : "text-zinc-400";
  const textSub = isLightMode ? "text-zinc-500" : "text-zinc-500";
  const bgSubCard = isLightMode 
    ? "bg-zinc-50 border-zinc-200" 
    : "bg-zinc-950/40 border-zinc-900";
  
  const highlightGreen = isLightMode 
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : "text-[#00ff66] bg-[#003314]/35 border-[#006629]";

  return (
    <div 
      ref={cardRef}
      id="repo-story-card"
      className={`w-full max-w-[650px] p-6 rounded-xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${bgMain}`}
    >
      {/* Decorative Matrix Scanline effect on card (only in dark mode) */}
      {!isLightMode && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00ff66_1px,transparent_1px)] [background-size:16px_16px]" />
      )}

      {/* Card HUD Corners */}
      <div className={`absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 ${isLightMode ? "border-zinc-300" : "border-zinc-800"}`} />
      <div className={`absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 ${isLightMode ? "border-zinc-300" : "border-zinc-800"}`} />
      <div className={`absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 ${isLightMode ? "border-zinc-300" : "border-zinc-800"}`} />
      <div className={`absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 ${isLightMode ? "border-zinc-300" : "border-zinc-800"}`} />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 mb-5 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          {/* Avatar without glow */}
          <img 
            src={repoDetails.owner.avatarUrl} 
            alt={repoDetails.owner.login}
            className={`w-12 h-12 rounded-full border-2 object-cover ${isLightMode ? "border-zinc-300" : "border-zinc-850"}`}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <a 
                href={repoDetails.owner.htmlUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs font-mono tracking-tight hover:underline ${textSub}`}
              >
                {repoDetails.owner.login}
              </a>
              <span className={`text-[10px] font-mono ${textSub}`}>/</span>
            </div>
            {/* Repository header changed to font-display (Plus Jakarta Sans) */}
            <h1 className="text-xl font-medium tracking-tight font-display flex items-center gap-1">
              {repoDetails.name}
              <span className={`text-xs font-normal border px-1.5 py-0.2 rounded font-sans ml-2 ${archetype.badgeColor}`}>
                {archetype.name}
              </span>
            </h1>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
            <span className="font-semibold">{repoDetails.stars.toLocaleString()}</span>
            <span className={`text-[10px] ${textSub}`}>stars</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4 text-zinc-500" />
            <span className="font-semibold">{repoDetails.forks.toLocaleString()}</span>
            <span className={`text-[10px] ${textSub}`}>forks</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Highlights left, Timeline & Stack right */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column: Story, Commit Grid, and Fun Facts (3/5 width) */}
        <div className="md:col-span-3 flex flex-col gap-4">
          
          {/* AI Story Section */}
          <div className={`p-4 rounded-lg border relative ${bgSubCard}`}>
            {/* Corner bracket accent */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isLightMode ? "border-emerald-500" : "border-[#00ff66]"}`} />
            <div className="flex items-center gap-2 mb-2">
              <ArchetypeIcon id={archetype.id} className={`w-4 h-4 ${isLightMode ? "text-emerald-600" : "text-[#00ff66]"}`} />
              <span className={`text-[10px] uppercase font-display tracking-wider font-semibold ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
                The Narrative
              </span>
            </div>
            <p className="text-xs font-mono leading-relaxed text-justify">
              {story}
            </p>
          </div>

          {/* Commit Grid Section */}
          <CommitGrid commits={data.githubData.commits} isLightMode={isLightMode} />

          {/* Fun Facts & Insights */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            
            <div className={`p-3 rounded-lg border flex flex-col justify-between ${bgSubCard}`}>
              <span className={`text-[9px] uppercase tracking-wider font-display ${textSub}`}>Developer Rhythm</span>
              <div className="my-1">
                <span className="font-medium text-sm block">{commitPatterns.timeOfDay}</span>
                <span className={`text-[9px] ${textSub}`}>{commitPatterns.nightOwlRatio}% Night Commits</span>
              </div>
              <div className="w-full bg-zinc-800/80 rounded-full h-1 mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isLightMode ? "bg-emerald-500" : "bg-[#00ff66]"}`} 
                  style={{ width: `${commitPatterns.nightOwlRatio}%` }}
                />
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex flex-col justify-between ${bgSubCard}`}>
              <span className={`text-[9px] uppercase tracking-wider font-display ${textSub}`}>Commit Habits</span>
              <div className="my-1">
                <span className="font-medium text-sm block">{commitPatterns.dayOfWeek}</span>
                <span className={`text-[9px] ${textSub}`}>{commitPatterns.weekendRatio}% Weekend Commits</span>
              </div>
              <div className="w-full bg-zinc-800/80 rounded-full h-1 mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isLightMode ? "bg-emerald-500" : "bg-[#00ff66]"}`} 
                  style={{ width: `${commitPatterns.weekendRatio}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Timeline & Languages (2/5 width) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          
          {/* Languages Stack */}
          <div className={`p-4 rounded-lg border ${bgSubCard}`}>
            <span className="text-[10px] uppercase font-display tracking-wider font-semibold text-zinc-500 block mb-3">
              Technology Stack
            </span>
            <div className="flex flex-col gap-2.5">
              {languageList.length > 0 ? (
                languageList.map((lang, index) => (
                  <div key={lang.name} className="text-xs font-mono">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold">{lang.name}</span>
                      <span className={textSub}>{lang.percentage}%</span>
                    </div>
                    {/* Retro Progress bar */}
                    <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isLightMode ? (
                            index === 0 ? "bg-emerald-600" :
                            index === 1 ? "bg-emerald-500" :
                            index === 2 ? "bg-emerald-400" : "bg-zinc-400"
                          ) : (
                            index === 0 ? "bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.4)]" :
                            index === 1 ? "bg-[#00cc52]" :
                            index === 2 ? "bg-[#00993d]" : "bg-zinc-700"
                          )
                        }`}
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-[10px] italic py-2 ${textMuted}`}>No languages detected</div>
              )}
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className={`p-4 rounded-lg border flex-1 ${bgSubCard}`}>
            <span className="text-[10px] uppercase font-display tracking-wider font-semibold text-zinc-500 block mb-4">
              Project Timeline
            </span>
            <div className="flex flex-col gap-4 relative pl-3 border-l border-zinc-800/80 ml-1">
              {milestones.slice(0, 3).map((item, index) => (
                <div key={index} className="relative group text-xs font-mono">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full border ${
                    index === 0 
                      ? (isLightMode ? "bg-emerald-500 border-emerald-400" : "bg-[#00ff66] border-[#33ff85] shadow-[0_0_8px_#00ff66]") 
                      : "bg-zinc-900 border-zinc-800"
                  }`} />
                  
                  <div className="flex justify-between items-center text-[10px] mb-0.5">
                    <span className={`font-semibold ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>{item.title}</span>
                    <span className={`text-[9px] ${textSub}`}>{item.date}</span>
                  </div>
                  <p className={`text-[10px] leading-tight ${textMuted}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer Branding inside exported card */}
      <div className={`flex justify-between items-center mt-5 pt-4 border-t ${isLightMode ? "border-zinc-200" : "border-zinc-800/80"} text-[11px] font-mono`}>
        <span className="flex items-center gap-2">
          <svg className={`w-5 h-5 ${isLightMode ? "text-emerald-600" : "text-[#00ff66]"}`} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Glowing neon outer square cursor box */}
            <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Inner solid square dot */}
            <rect x="13" y="13" width="6" height="6" fill="currentColor" />
          </svg>
          <span className={`font-semibold ${isLightMode ? "text-zinc-650" : "text-zinc-400"}`}>Made with RepoStory</span>
        </span>
      </div>
    </div>
  );
}

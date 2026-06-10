import { Trophy, Sparkles } from "lucide-react";

function buildAchievements({ repoDetails, storyData, contributorsCount, releasesCount }) {
  const achievements = [];
  const { archetype, commitPatterns } = storyData;

  achievements.push(`Archetype unlocked: ${archetype.name}`);

  if (repoDetails.stars >= 1000) achievements.push("Star magnet: crossed 1k stars");
  else if (repoDetails.stars >= 250) achievements.push("Momentum: crossed 250 stars");

  if (repoDetails.forks >= 100) achievements.push("Fork-friendly: 100+ forks");

  if (contributorsCount >= 10) achievements.push("Community engine: 10+ contributors");

  if (releasesCount > 0) achievements.push(`Release cadence: ${releasesCount} tracked releases`);

  if (commitPatterns.nightOwlRatio >= 35) achievements.push("Night shift builder");
  if (commitPatterns.weekendRatio >= 40) achievements.push("Weekend warrior mode");

  if (repoDetails.readmeSummary) achievements.push("README-powered project narrative");

  return achievements.slice(0, 6);
}

export default function Achievements({ repoDetails, storyData, contributorsCount, releasesCount, isLightMode }) {
  const achievements = buildAchievements({
    repoDetails,
    storyData,
    contributorsCount,
    releasesCount,
  });

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          // achievements
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-[#00ff66]/20"}`} />
      </div>

      <div
        className={`rounded-xl border p-3.5 ${
          isLightMode ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950/50 border-zinc-900/80"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {achievements.map((item) => (
            <div
              key={item}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${
                isLightMode ? "bg-white border-zinc-200" : "bg-black/40 border-zinc-800"
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${isLightMode ? "text-amber-500" : "text-[#00ff66]"}`} />
              <span className={`text-[10px] font-mono ${isLightMode ? "text-zinc-700" : "text-zinc-300"}`}>{item}</span>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>No achievements generated yet.</span>
          </div>
        )}
      </div>
    </div>
  );
}

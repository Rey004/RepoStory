import { Trophy, Sparkles, Crown, Users, GitBranch, Flame, ScrollText, BadgeCheck } from "lucide-react";

function buildAchievements({ repoDetails, storyData, contributorsCount, releasesCount }) {
  const achievements = [];
  const { archetype, commitPatterns } = storyData;
  achievements.push(archetype.name);
  if (repoDetails.stars >= 1000) achievements.push("1k+ stars");
  else if (repoDetails.stars >= 250) achievements.push("250+ stars");
  if (repoDetails.forks >= 100) achievements.push("100+ forks");
  if (contributorsCount >= 10) achievements.push("10+ people");
  if (releasesCount > 0) achievements.push(`${releasesCount} releases`);
  if (commitPatterns.nightOwlRatio >= 35) achievements.push("night mode");
  if (commitPatterns.weekendRatio >= 40) achievements.push("weekend mode");
  if (repoDetails.readmeSummary) achievements.push("README notes");
  return achievements.slice(0, 6);
}

function pickBadgeIcon(item, index) {
  if (item.includes("Archetype")) return Crown;
  if (item.includes("star")) return BadgeCheck;
  if (item.includes("fork")) return GitBranch;
  if (item.includes("contributors")) return Users;
  if (item.includes("release")) return ScrollText;
  if (item.includes("Night")) return Flame;
  return index % 2 === 0 ? Trophy : Sparkles;
}

export default function Achievements({ repoDetails, storyData, contributorsCount, releasesCount, isLightMode, isNested = false, themeColor = "#00ff66" }) {
  const achievements = buildAchievements({ repoDetails, storyData, contributorsCount, releasesCount });

  const content = (
    <div className="flex flex-col gap-0.5 w-full overflow-hidden">
      {isNested ? (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 w-full overflow-hidden p-1.5">
          {achievements.map((item, idx) => {
            const BadgeIcon = pickBadgeIcon(item, idx);
            return (
              <div key={item} className="flex items-start gap-1 min-w-0 text-[7.5px] font-mono leading-tight py-0.5">
                <BadgeIcon className="w-2.5 h-2.5 shrink-0 mt-[2.5px]" style={{ color: themeColor }} />
                <span className={`break-words ${isLightMode ? "text-zinc-900" : "text-white"}`}>{item}</span>
              </div>
            );
          })}
          {achievements.length === 0 && (
            <div className="col-span-2 flex items-center gap-1.5 text-[7.5px] font-mono text-zinc-500 py-1">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span>No badges yet.</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">earned</span>
            <span className={`text-[9px] font-mono px-2 py-1 rounded-full border ${isLightMode ? "bg-white border-zinc-200 text-zinc-500" : "bg-black/50 border-zinc-800 text-zinc-500"}`}>
              {achievements.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {achievements.map((item) => {
              const BadgeIcon = pickBadgeIcon(item, achievements.indexOf(item));
              return (
                <div key={item} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${isLightMode ? "bg-white border-zinc-200" : "bg-black/40 border-zinc-800"}`}>
                  <BadgeIcon className="w-3.5 h-3.5" style={{ color: themeColor }} />
                  <span className={`text-[10px] font-mono ${isLightMode ? "text-zinc-700" : "text-zinc-300"}`}>{item}</span>
                </div>
              );
            })}
          </div>

          {achievements.length === 0 && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>No badges yet.</span>
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider border"
              style={{ backgroundColor: `${themeColor}0d`, borderColor: `${themeColor}33`, color: themeColor }}
            >
              quests complete
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider border ${isLightMode ? "bg-white border-zinc-200 text-zinc-600" : "bg-black/50 border-zinc-800 text-zinc-400"}`}>
              lore updated
            </span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="relative z-10 w-full">
      {!isNested && (
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: themeColor }}>
            // badges
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${themeColor}33` }} />
        </div>
      )}
      {isNested ? content : (
        <div className={`rounded-xl border p-3.5 ${isLightMode ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950/50 border-zinc-900/80"}`}>
          {content}
        </div>
      )}
    </div>
  );
}

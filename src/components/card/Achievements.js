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

export default function Achievements({
  repoDetails,
  storyData,
  contributorsCount,
  releasesCount,
  isLightMode,
  isNested = false,
  themeColor = "#00ff66",
}) {
  const achievements = buildAchievements({ repoDetails, storyData, contributorsCount, releasesCount });

  // RepoStoryCard always uses Achievements with isNested={true} (via HeroStats),
  // so we only keep the nested (grid) UI.
  const nestedContent = (
    <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 w-full overflow-hidden p-1.5">
      {achievements.map((item, idx) => {
        const BadgeIcon = pickBadgeIcon(item, idx);
        return (
          <div key={item} className="flex items-start gap-1 min-w-0 text-[7.5px] font-mono leading-tight py-0.5">
            <BadgeIcon className="w-3 h-3 shrink-0 mt-[0px]" style={{ color: themeColor }} />
            <span className={`break-words ${isLightMode ? "text-zinc-900" : "text-white"} text-[9px]`}>{item}</span>
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
  );

  // Preserve wrapper used by nested mode
  return <div className="relative z-10 w-full">{nestedContent}</div>;
}

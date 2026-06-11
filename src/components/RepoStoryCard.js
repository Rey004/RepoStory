import { getLanguageList } from "@/lib/languageIcons";
import CardWatermark from "@/components/card/CardWatermark";
import CardHeader from "@/components/card/CardHeader";
import CardDescription from "@/components/card/CardDescription";
import TechStackPills from "@/components/card/TechStackPills";
import HeroStats from "@/components/card/HeroStats";
import CommitTimeline from "@/components/card/CommitTimeline";
import CommitGrid from "@/components/card/CommitGrid";
import CommitInsights from "@/components/card/CommitInsights";
import Achievements from "@/components/card/Achievements";
import CardFooter from "@/components/card/CardFooter";

export default function RepoStoryCard({ data, cardRef, isLightMode = false, themeColor = "#00ff66" }) {
  if (!data) return null;

  const { repoDetails, languages, commits, contributors, releases, totalCommits, totalContributors } = data.githubData;
  const { archetype, commitPatterns, milestones } = data.storyData;

  const languageList = getLanguageList(languages, 8);

  const bgMain = isLightMode
    ? "bg-white text-black border-zinc-300"
    : "bg-[#030805] text-white";
  const cardBorderStyle = !isLightMode ? { borderColor: `${themeColor}33` } : {};

  const textMuted = isLightMode ? "text-zinc-600" : "text-zinc-400";
  const textSub = isLightMode ? "text-zinc-500" : "text-zinc-500";
  const bgSubCard = isLightMode
    ? "bg-zinc-50 border-zinc-200"
    : "bg-zinc-950/50 border-zinc-900/80";

  // Inject scoped CSS so every Tailwind class inside the card picks up the custom color.
  // We target both the card and all its descendants (*) to override :root-defined variables.
  const mixBase = isLightMode ? "#ffffff" : "#000000";
  const themeCSS = `
    #repo-story-card, #repo-story-card * {
      --color-green-level-4: ${themeColor};
      --color-green-level-3: color-mix(in srgb, ${themeColor} 70%, ${mixBase});
      --color-green-level-2: color-mix(in srgb, ${themeColor} 40%, ${mixBase});
      --color-green-level-1: color-mix(in srgb, ${themeColor} 15%, ${mixBase});
      --color-green-level-0: ${isLightMode ? "#f4f4f5" : "#121614"};
      --accent-green: ${themeColor};
      --color-green-glow: color-mix(in srgb, ${themeColor} 15%, transparent);
      --accent-green-glow: color-mix(in srgb, ${themeColor} 25%, transparent);
      --grid-line: color-mix(in srgb, ${themeColor} 4%, transparent);
    }
  `;

  return (
    <div
      ref={cardRef}
      id="repo-story-card"
      className={`w-[800px] h-[960px] shrink-0 p-6 pb-7 rounded-xl border shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${bgMain}`}
      style={cardBorderStyle}
    >
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <CardWatermark isLightMode={isLightMode} themeColor={themeColor} />
      {!isLightMode && (
        <>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none grid-bg z-0" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-size-[16px_16px] z-0"
               style={{ backgroundImage: `radial-gradient(${themeColor} 1px, transparent 1px)` }} />
          <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-0"
               style={{ background: `linear-gradient(to bottom, ${themeColor}14, transparent)` }} />
        </>
      )}

      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 z-10"
           style={{ borderColor: isLightMode ? "#d4d4d8" : `${themeColor}66` }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 z-10"
           style={{ borderColor: isLightMode ? "#d4d4d8" : `${themeColor}66` }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 z-10"
           style={{ borderColor: isLightMode ? "#d4d4d8" : `${themeColor}66` }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 z-10"
           style={{ borderColor: isLightMode ? "#d4d4d8" : `${themeColor}66` }} />

      <CardHeader
        repoDetails={repoDetails}
        archetype={archetype}
        isLightMode={isLightMode}
        textSub={textSub}
        description={repoDetails.description}
        readmeSummary={repoDetails.readmeSummary}
        languageList={languageList}
        themeColor={themeColor}
      />

      <div className="relative z-10 flex flex-col gap-4 flex-1 justify-center my-2.5">
        {/* Hub (includes Stats, Tabs for Perks & Badges) */}
        <HeroStats
          repoDetails={repoDetails}
          contributorsCount={totalContributors || contributors.length}
          commitsCount={totalCommits || commits.length}
          isLightMode={isLightMode}
          storyData={data.storyData}
          releasesCount={releases.length}
          commitPatterns={commitPatterns}
          textSub={textSub}
          bgSubCard={bgSubCard}
          themeColor={themeColor}
        />

        {/* Bottom Section: Timeline & Commit Grid Side-by-Side */}
        <div className="grid grid-cols-[1.62fr_1fr] gap-4">
          {/* Left: Timeline Flowchart */}
          <div className={`p-4 rounded-xl border ${bgSubCard} flex flex-col justify-between h-[270px]`}>
            <CommitTimeline
              milestones={milestones}
              isLightMode={isLightMode}
              textMuted={textMuted}
              textSub={textSub}
              themeColor={themeColor}
            />
          </div>

          {/* Right: Commit Activity (CommitGrid) */}
          <div className={`p-4 rounded-xl border ${bgSubCard} flex flex-col justify-center h-[270px]`}>
            <CommitGrid commits={commits} isLightMode={isLightMode} themeColor={themeColor} />
          </div>
        </div>
      </div>

      <CardFooter isLightMode={isLightMode} themeColor={themeColor} />
    </div>
  );
}

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

export default function RepoStoryCard({ data, cardRef, isLightMode = false }) {
  if (!data) return null;

  const { repoDetails, languages, commits, contributors, releases } = data.githubData;
  const { archetype, commitPatterns, milestones } = data.storyData;

  const languageList = getLanguageList(languages, 8);

  const bgMain = isLightMode
    ? "bg-white text-black border-zinc-300"
    : "bg-[#030805] text-white border-[#00ff66]/20";

  const textMuted = isLightMode ? "text-zinc-600" : "text-zinc-400";
  const textSub = isLightMode ? "text-zinc-500" : "text-zinc-500";
  const bgSubCard = isLightMode
    ? "bg-zinc-50 border-zinc-200"
    : "bg-zinc-950/50 border-zinc-900/80";

  return (
    <div
      ref={cardRef}
      id="repo-story-card"
      className={`w-180 shrink-0 p-5 rounded-xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${bgMain}`}
    >
      {!isLightMode && (
        <>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none grid-bg z-0" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00ff66_1px,transparent_1px)] bg-size-[16px_16px] z-0" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-green-level-4/8 to-transparent pointer-events-none z-0" />
        </>
      )}

      <CardWatermark isLightMode={isLightMode} />

      <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 z-10 ${isLightMode ? "border-zinc-300" : "border-green-level-4/40"}`} />
      <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 z-10 ${isLightMode ? "border-zinc-300" : "border-green-level-4/40"}`} />
      <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 z-10 ${isLightMode ? "border-zinc-300" : "border-green-level-4/40"}`} />
      <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 z-10 ${isLightMode ? "border-zinc-300" : "border-green-level-4/40"}`} />

      <CardHeader
        repoDetails={repoDetails}
        archetype={archetype}
        isLightMode={isLightMode}
        textSub={textSub}
        description={repoDetails.description}
        readmeSummary={repoDetails.readmeSummary}
        languageList={languageList}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Hub (includes Stats, Tabs for Perks & Badges) */}
        <HeroStats
          repoDetails={repoDetails}
          contributorsCount={contributors.length}
          commitsCount={commits.length}
          isLightMode={isLightMode}
          storyData={data.storyData}
          releasesCount={releases.length}
          commitPatterns={commitPatterns}
          textSub={textSub}
          bgSubCard={bgSubCard}
        />

        {/* Timeline */}
        <div className={`p-3 rounded-xl border ${bgSubCard}`}>
          <CommitTimeline
            milestones={milestones}
            isLightMode={isLightMode}
            textMuted={textMuted}
            textSub={textSub}
          />
        </div>

        {/* Commit Grid (Full Width) */}
        <CommitGrid commits={commits} isLightMode={isLightMode} />
      </div>

      <CardFooter isLightMode={isLightMode} />
    </div>
  );
}

import React from "react";
import { Star, GitFork, Eye, AlertCircle, Users, GitCommit } from "lucide-react";
import RepoStoryLogo from "@/components/icons/RepoStoryLogo";
import CommitInsights from "./CommitInsights";
import Achievements from "./Achievements";

function OrbitStat({ icon: Icon, label, value, positionClass, isLightMode, themeColor }) {
  return (
    <div
      className={`absolute ${positionClass} w-28 rounded-xl border px-2 py-1.5 shadow-md backdrop-blur-sm z-30 ${
        isLightMode ? "bg-white/90 border-zinc-200" : "bg-zinc-950/80 border-zinc-800"
      }`}
    >
      <div className="flex items-center gap-1">
        <Icon className="w-3 h-3" style={{ color: themeColor }} />
        <span className={`text-[7.5px] uppercase tracking-wider font-mono ${isLightMode ? "text-zinc-555" : "text-zinc-500"}`}>
          {label}
        </span>
      </div>
      <p className="mt-0.5 text-xs font-semibold font-mono leading-none">{value}</p>
    </div>
  );
}

function AssetIcon({ themeColor }) {
  return (
    <div className="relative z-10 flex items-center justify-center">
      <RepoStoryLogo
        className="w-25 h-25 transition-all duration-300 hover:scale-105"
        style={{
          color: themeColor,
          filter: `drop-shadow(0 1px 3px ${themeColor}26)`,
        }}
      />
    </div>
  );
}

export default function HeroStats({
  repoDetails,
  contributorsCount,
  commitsCount,
  isLightMode,
  storyData,
  releasesCount,
  commitPatterns,
  textSub,
  bgSubCard,
  themeColor = "#00ff66",
}) {
  return (
    <div className={`relative z-10 w-full rounded-2xl border overflow-hidden p-3.5 sm:p-4 bg-linear-to-b from-transparent to-black/10 min-h-[360px] ${
      isLightMode ? "border-zinc-200 bg-zinc-50/50" : "border-zinc-800/80 bg-zinc-950/30"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[12px] uppercase font-mono tracking-widest font-bold" style={{ color: themeColor }}>
          {"// hub"}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: `${themeColor}33` }} />
      </div>

      <div className="relative grid place-items-center min-h-[300px] w-full">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: `radial-gradient(circle at center, ${themeColor}26, transparent 55%)` }}
        />

        {/* Outer Orbit / Grid Stats */}
        <OrbitStat icon={Star} label="Stars" value={repoDetails.stars.toLocaleString()} positionClass="left-4 sm:left-6 top-2" isLightMode={isLightMode} themeColor={themeColor} />
        <OrbitStat icon={GitFork} label="Forks" value={repoDetails.forks.toLocaleString()} positionClass="right-4 sm:right-6 top-2" isLightMode={isLightMode} themeColor={themeColor} />
        <OrbitStat icon={Users} label="Contributors" value={contributorsCount.toLocaleString()} positionClass="left-4 sm:left-6 bottom-2" isLightMode={isLightMode} themeColor={themeColor} />
        <OrbitStat icon={GitCommit} label="Commits" value={commitsCount.toLocaleString()} positionClass="right-4 sm:right-6 bottom-2" isLightMode={isLightMode} themeColor={themeColor} />

        {/* Central Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <AssetIcon themeColor={themeColor} />
        </div>

        {/* Left Floating Panel: Perks */}
        <div
          className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-[220px] h-auto z-20 p-3 rounded-xl border border-t-2 backdrop-blur-md shadow-lg flex flex-col gap-2 ${
            isLightMode ? "bg-white/95 border-zinc-200" : "bg-black/75 border-zinc-800"
          }`}
          style={{ borderTopColor: themeColor }}
        >
          <div className="flex items-center justify-between border-b border-zinc-800/10 dark:border-zinc-200/10 pb-1.5 shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold" style={{ color: themeColor }}>
              [ sys.perks ]
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
          </div>
          <div className="flex-1 mt-1">
            <CommitInsights commitPatterns={commitPatterns} isLightMode={isLightMode} bgSubCard="" textSub={textSub} isNested={true} themeColor={themeColor} />
          </div>
        </div>

        {/* Right Floating Panel: Badges */}
        <div
          className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-[220px] h-auto z-20 p-3 rounded-xl border border-t-2 backdrop-blur-md shadow-lg flex flex-col gap-2 ${
            isLightMode ? "bg-white/95 border-zinc-200" : "bg-black/75 border-zinc-800"
          }`}
          style={{ borderTopColor: themeColor }}
        >
          <div className="flex items-center justify-between border-b border-zinc-800/10 dark:border-zinc-200/10 pb-1.5 shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold" style={{ color: themeColor }}>
              [ sys.badges ]
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
          </div>
          <div className="flex-1 mt-1">
            <Achievements repoDetails={repoDetails} storyData={storyData} contributorsCount={contributorsCount} releasesCount={releasesCount} isLightMode={isLightMode} isNested={true} themeColor={themeColor} />
          </div>
        </div>

        <OrbitStat icon={Eye} label="Watchers" value={repoDetails.watchers.toLocaleString()} positionClass="left-1/2 -translate-x-1/2 top-2" isLightMode={isLightMode} themeColor={themeColor} />
        <OrbitStat icon={AlertCircle} label="Open Issues" value={repoDetails.openIssues.toLocaleString()} positionClass="left-1/2 -translate-x-1/2 bottom-2" isLightMode={isLightMode} themeColor={themeColor} />

        {/* Grid Background Lines */}
        <div className="absolute inset-x-4 sm:inset-x-6 top-1/2 -translate-y-1/2 h-px" style={{ backgroundColor: `${themeColor}1a` }} />
        <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px" style={{ backgroundColor: `${themeColor}1a` }} />
      </div>
    </div>
  );
}


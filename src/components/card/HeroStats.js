import React from "react";
import { Star, GitFork, Eye, AlertCircle, Users, GitCommit } from "lucide-react";
import RepoStoryLogo from "@/components/icons/RepoStoryLogo";
import CommitInsights from "./CommitInsights";
import Achievements from "./Achievements";

function OrbitStat({ icon: Icon, label, value, positionClass, isLightMode }) {
  return (
    <div
      className={`absolute ${positionClass} w-28 rounded-xl border px-2 py-1.5 shadow-md backdrop-blur-sm z-30 ${
        isLightMode ? "bg-white/90 border-zinc-200" : "bg-zinc-950/80 border-zinc-800"
      }`}
    >
      <div className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${isLightMode ? "text-emerald-600" : "text-green-level-4"}`} />
        <span className={`text-[7.5px] uppercase tracking-wider font-mono ${isLightMode ? "text-zinc-555" : "text-zinc-500"}`}>
          {label}
        </span>
      </div>
      <p className="mt-0.5 text-xs font-semibold font-mono leading-none">{value}</p>
    </div>
  );
}

function AssetIcon({ isLightMode }) {
  return (
    <div className="relative z-10 flex items-center justify-center">
      <RepoStoryLogo className={`w-25 h-25 transition-all duration-300 hover:scale-105 ${
        isLightMode
          ? "text-emerald-500 drop-shadow-[0_2px_5px_rgba(16,185,129,0.2)]"
          : "text-green-level-4 drop-shadow-[0_2px_5px_rgba(0,255,102,0.3)]"
      }`} />
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
}) {
  return (
    <div className={`relative z-10 w-full rounded-2xl border overflow-hidden p-3.5 sm:p-4 bg-linear-to-b from-transparent to-black/10 min-h-[360px] ${
      isLightMode ? "border-zinc-200 bg-zinc-50/50" : "border-zinc-800/80 bg-zinc-950/30"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-green-level-4"}`}>
          {"// hub"}
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-green-level-4/20"}`} />
      </div>

      <div className="relative grid place-items-center min-h-[300px] w-full">
        <div className={`absolute inset-0 rounded-2xl ${isLightMode ? "bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_65%)]" : "bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.10),transparent_65%)]"}`} />

        {/* Outer Orbit / Grid Stats */}
        <OrbitStat
          icon={Star}
          label="Stars"
          value={repoDetails.stars.toLocaleString()}
          positionClass="left-4 sm:left-6 top-2"
          isLightMode={isLightMode}
        />
        <OrbitStat
          icon={GitFork}
          label="Forks"
          value={repoDetails.forks.toLocaleString()}
          positionClass="right-4 sm:right-6 top-2"
          isLightMode={isLightMode}
        />
        <OrbitStat
          icon={Users}
          label="Contributors"
          value={contributorsCount.toLocaleString()}
          positionClass="left-4 sm:left-6 bottom-2"
          isLightMode={isLightMode}
        />
        <OrbitStat
          icon={GitCommit}
          label="Commits"
          value={commitsCount.toLocaleString()}
          positionClass="right-4 sm:right-6 bottom-2"
          isLightMode={isLightMode}
        />

        {/* Central Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <AssetIcon isLightMode={isLightMode} />
        </div>

        {/* Left Floating Panel: Perks */}
        <div className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-[220px] h-auto z-20 p-3 rounded-xl border border-t-2 backdrop-blur-md shadow-lg flex flex-col gap-2 ${
          isLightMode
            ? "bg-white/95 border-zinc-200 border-t-emerald-500"
            : "bg-black/75 border-zinc-800 border-t-green-level-4"
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800/10 dark:border-zinc-200/10 pb-1.5 shrink-0">
            <span className={`text-[8px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-green-level-4"}`}>
              [ sys.perks ]
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isLightMode ? "bg-emerald-500" : "bg-green-level-4"} animate-pulse`} />
          </div>
          <div className="flex-1 mt-1">
            <CommitInsights
              commitPatterns={commitPatterns}
              isLightMode={isLightMode}
              bgSubCard=""
              textSub={textSub}
              isNested={true}
            />
          </div>
        </div>

        {/* Right Floating Panel: Badges */}
        <div className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-[220px] h-auto z-20 p-3 rounded-xl border border-t-2 backdrop-blur-md shadow-lg flex flex-col gap-2 ${
          isLightMode
            ? "bg-white/95 border-zinc-200 border-t-emerald-500"
            : "bg-black/75 border-zinc-800 border-t-green-level-4"
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800/10 dark:border-zinc-200/10 pb-1.5 shrink-0">
            <span className={`text-[8px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-green-level-4"}`}>
              [ sys.badges ]
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isLightMode ? "bg-emerald-500" : "bg-green-level-4"} animate-pulse`} />
          </div>
          <div className="flex-1 mt-1">
            <Achievements
              repoDetails={repoDetails}
              storyData={storyData}
              contributorsCount={contributorsCount}
              releasesCount={releasesCount}
              isLightMode={isLightMode}
              isNested={true}
            />
          </div>
        </div>

        <OrbitStat
          icon={Eye}
          label="Watchers"
          value={repoDetails.watchers.toLocaleString()}
          positionClass="left-1/2 -translate-x-1/2 top-2"
          isLightMode={isLightMode}
        />
        <OrbitStat
          icon={AlertCircle}
          label="Open Issues"
          value={repoDetails.openIssues.toLocaleString()}
          positionClass="left-1/2 -translate-x-1/2 bottom-2"
          isLightMode={isLightMode}
        />

        {/* Grid Background Lines */}
        <div className={`absolute inset-x-4 sm:inset-x-6 top-1/2 -translate-y-1/2 h-px ${isLightMode ? "bg-emerald-100" : "bg-green-level-4/10"}`} />
        <div className={`absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px ${isLightMode ? "bg-emerald-100" : "bg-green-level-4/10"}`} />
      </div>
    </div>
  );
}

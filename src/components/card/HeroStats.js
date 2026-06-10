import { Star, GitFork, Eye, AlertCircle, Users, GitCommit } from "lucide-react";

function StatTile({ icon: Icon, label, value, isLightMode }) {
  return (
    <div
      className={`rounded-lg border p-2.5 ${
        isLightMode ? "bg-white border-zinc-200" : "bg-zinc-950/50 border-zinc-800"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${isLightMode ? "text-emerald-600" : "text-[#00ff66]"}`} />
        <span className={`text-[9px] uppercase tracking-wider font-mono ${isLightMode ? "text-zinc-500" : "text-zinc-500"}`}>
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold font-mono">{value}</p>
    </div>
  );
}

export default function HeroStats({ repoDetails, contributorsCount, commitsCount, isLightMode }) {
  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          // hero.stats
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-[#00ff66]/20"}`} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-left">
        <StatTile
          icon={Star}
          label="Stars"
          value={repoDetails.stars.toLocaleString()}
          isLightMode={isLightMode}
        />
        <StatTile
          icon={GitFork}
          label="Forks"
          value={repoDetails.forks.toLocaleString()}
          isLightMode={isLightMode}
        />
        <StatTile
          icon={Users}
          label="Contributors"
          value={contributorsCount.toLocaleString()}
          isLightMode={isLightMode}
        />
        <StatTile
          icon={GitCommit}
          label="Commits"
          value={commitsCount.toLocaleString()}
          isLightMode={isLightMode}
        />
        <StatTile
          icon={Eye}
          label="Watchers"
          value={repoDetails.watchers.toLocaleString()}
          isLightMode={isLightMode}
        />
        <StatTile
          icon={AlertCircle}
          label="Open Issues"
          value={repoDetails.openIssues.toLocaleString()}
          isLightMode={isLightMode}
        />
      </div>
    </div>
  );
}

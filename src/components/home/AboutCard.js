import { Terminal } from "lucide-react";

const FEATURE_TAGS = ["Milestones", "Developer Archetype", "Stack Insights"];

export default function AboutCard() {
  return (
    <div className="flex-1 border border-zinc-900/50 rounded-lg bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-zinc-800/80 p-3 sm:p-4.5 font-sans text-[10px] sm:text-xs text-zinc-400 flex flex-col justify-center text-left relative overflow-hidden shadow-sm transition-colors duration-300">
      <div className="space-y-2 sm:space-y-4 relative z-10">
        <h3 className="text-[10px] sm:text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-1 sm:gap-1.5 font-mono">
          <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00ff66]" />
          What is RepoStory?
        </h3>
        <p className="leading-relaxed text-zinc-300 text-[10px] sm:text-xs font-light">
          RepoStory compiles commits, technology stats, and milestone chronologies from any public GitHub repository into a beautifully styled, shareable visual card.
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
          {FEATURE_TAGS.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 sm:px-2.5 rounded-full border border-zinc-900 bg-zinc-950/60 text-[9px] sm:text-[10px] text-zinc-400 font-sans tracking-wide"
            >
              ✦ {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

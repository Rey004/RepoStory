const PIPELINE_FEATURES = ["DNA_DECODER", "MILESTONES", "TECH_STACKS", "SOCIAL_CARDS"];

export default function PipelineCard() {
  return (
    <div className="flex-1 border border-zinc-900/50 rounded-lg bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-zinc-800/80 p-3 sm:p-4.5 font-mono text-[9px] sm:text-[11px] text-zinc-400 text-left relative overflow-hidden shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 sm:pb-2.5 sm:mb-3 border-b border-zinc-900/60">
          <div className="flex gap-1 sm:gap-1.5">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ff5f56]" />
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-zinc-650">analysis_pipeline.sh</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between">
          <div className="flex-1 sm:min-w-[180px]">
            <p className="text-[#00ff66]/90">
              <span className="text-zinc-700">&gt;</span> repository.analyze()
            </p>
            <p className="pl-2.5 sm:pl-3.5 text-zinc-300 leading-snug sm:leading-normal font-light mt-0.5 sm:mt-1">
              &quot;Your repository is more than its commits.&quot;
            </p>
          </div>
          <div className="flex-1 sm:min-w-[200px]">
            <p className="text-[#00ff66]/90">
              <span className="text-zinc-700">&gt;</span> social_cards.compile()
            </p>
            <div className="pl-2.5 sm:pl-3.5 flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-1.5">
              {PIPELINE_FEATURES.map((feature) => (
                <span
                  key={feature}
                  className="px-1.5 py-0.5 sm:px-2 rounded border border-zinc-850 bg-zinc-900/40 text-[8px] sm:text-[9px] text-zinc-550 font-mono tracking-wide"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

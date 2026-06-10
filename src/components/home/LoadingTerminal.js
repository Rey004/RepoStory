import { Terminal } from "lucide-react";
import { LOADING_STEPS } from "@/constants/loadingSteps";

export default function LoadingTerminal({ repoUrl, loadingStepIndex }) {
  return (
    <div className="w-full max-w-xl p-5 rounded-lg border border-[#00ff66]/20 bg-[#040705] shadow-2xl relative font-mono text-xs">
      <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4 text-zinc-550">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="text-[10px]">repo-analyzer.sh</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
        </div>
      </div>

      <div className="flex gap-1.5 mb-3 text-zinc-400">
        <span className="text-[#00ff66]">$</span>
        <span>./repo-story --target={repoUrl || "analyzing..."}</span>
      </div>

      <div className="flex flex-col gap-2 min-h-[160px] max-h-[260px] overflow-y-auto pr-2">
        {LOADING_STEPS.slice(0, loadingStepIndex + 1).map((step, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              idx === loadingStepIndex ? "text-[#00ff66]" : "text-zinc-550"
            }`}
          >
            <span className="select-none">✓</span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-650">
        <span>ANALYZER ACTIVE</span>
        <span className="w-2 h-4 bg-[#00ff66] animate-pulse" />
      </div>
    </div>
  );
}

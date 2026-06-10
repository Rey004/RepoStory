import { Sparkles } from "lucide-react";

export default function HeroTagline() {
  return (
    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[#00ff66] text-xs w-fit mx-auto animate-fade-in">
      <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
      <span>Transform Repos into Social Story Cards</span>
    </div>
  );
}

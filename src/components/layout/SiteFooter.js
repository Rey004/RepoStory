import { Heart } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-6 mt-auto shrink-0 text-xs font-mono text-zinc-400 relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 RepoStory.</p>
        <p className="flex items-center gap-1.5 text-zinc-400">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-[#00ff66] fill-[#00ff66] animate-pulse" />
          <span>by</span>
          <a
            href="https://revanshu-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#00ff66] transition-colors underline decoration-zinc-800 hover:decoration-[#00ff66] underline-offset-4"
          >
            Revanshu
          </a>
        </p>
      </div>
    </footer>
  );
}

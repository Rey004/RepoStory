import GithubIcon from "@/components/icons/GithubIcon";
import RepoStoryLogo from "@/components/icons/RepoStoryLogo";

export default function SiteHeader({ onLogoClick }) {
  return (
    <header className="bg-transparent relative z-50 w-full animate-slide-down">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 text-white"
        >
          <div className="w-10 h-10 flex items-center justify-center text-[#00ff66] transition-transform duration-300 hover:scale-110 hover:rotate-12">
            <RepoStoryLogo />
          </div>
          <span className="font-display text-lg font-light tracking-wider">
            RepoStory<span className="text-[#00ff66]">.</span>
          </span>
        </button>

        <a
          href="https://github.com/Rey004/RepoStory"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 bg-black transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          <span>Star on GitHub</span>
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </a>
      </div>
    </header>
  );
}

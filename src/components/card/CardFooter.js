import GithubIcon from "@/components/icons/GithubIcon";

export default function CardFooter({ isLightMode, themeColor = "#00ff66" }) {
  return (
    <div
      className="relative z-10 flex justify-between items-center mt-5 pt-4 border-t text-[11px] font-mono"
      style={{ borderTopColor: `${themeColor}1a` }}
    >
      {/* Left: RepoStory branding logo */}
      <span className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ color: themeColor }}
        >
          <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <rect x="13" y="13" width="6" height="6" fill="currentColor" />
        </svg>
        <span className={`font-semibold ${isLightMode ? "text-zinc-650" : "text-zinc-400"}`}>
          Made with RepoStory
        </span>
      </span>

      {/* Right: GitHub link */}
      <a
        href="https://github.com/Rey004/RepoStory"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[12px] font-mono tracking-wide transition-colors text-zinc-400"
        onMouseEnter={(e) => { e.currentTarget.style.color = themeColor; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = ""; }}
      >
        <GithubIcon className="w-4 h-4 shrink-0" />
        <span>github.com/Rey004/RepoStory</span>
      </a>
    </div>
  );
}

export default function HeroTitleMorph({ isCut, showPixels, transitionPixels }) {
  return (
    <div className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-display text-center tracking-tight select-none animate-fade-in-delay-100">
      <span className="relative inline-grid grid-cols-1 grid-rows-1 justify-items-center items-center px-4 py-1">
        <span
          className={`col-start-1 row-start-1 inline-block transition-opacity duration-300 text-zinc-500 font-light ${
            isCut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          Repository
        </span>
        <span
          className={`col-start-1 row-start-1 font-medium text-white transition-opacity duration-300 ${
            isCut ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          RepoStory<span className="text-[#00ff66]">.</span>
        </span>
        {showPixels && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {transitionPixels.map((p) => (
              <div
                key={p.id}
                className={`absolute animate-trans-pixel ${
                  p.isGreen ? "bg-[#00ff66]" : "bg-[#0a0a0c]"
                }`}
                style={{
                  left: `${p.col * 2.5}%`,
                  top: `${p.row * 10}%`,
                  width: "2.5%",
                  height: "10%",
                }}
              />
            ))}
          </div>
        )}
      </span>
    </div>
  );
}

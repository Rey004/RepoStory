export default function CardHeader({ repoDetails, archetype, isLightMode, textSub }) {
  return (
    <div
      className={`relative z-10 flex justify-between items-start gap-4 pb-5 mb-5 border-b ${
        isLightMode ? "border-zinc-200" : "border-[#00ff66]/15"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`relative shrink-0 p-0.5 rounded-full ${isLightMode ? "bg-zinc-100" : "bg-[#00ff66]/10"}`}>
          <img
            src={repoDetails.owner.avatarUrl}
            alt={repoDetails.owner.login}
            className={`w-12 h-12 rounded-full border-2 object-cover ${
              isLightMode ? "border-white" : "border-black"
            }`}
          />
        </div>
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <a
              href={repoDetails.owner.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline ${textSub}`}
            >
              {repoDetails.owner.login}
            </a>
            <span className={textSub}>/</span>
            <span className={isLightMode ? "text-zinc-700" : "text-zinc-300"}>{repoDetails.name}</span>
          </div>
          <h1 className="text-xl font-medium tracking-tight font-display truncate mt-0.5">
            {repoDetails.name}
          </h1>
          <span
            className={`inline-block mt-1.5 text-[10px] font-mono uppercase tracking-wider border px-2 py-0.5 rounded-full ${archetype.badgeColor}`}
          >
            {archetype.name}
          </span>
        </div>
      </div>

    </div>
  );
}

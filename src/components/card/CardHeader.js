import CardDescription from "@/components/card/CardDescription";
import TechStackPills from "@/components/card/TechStackPills";

export default function CardHeader({ repoDetails, archetype, isLightMode, textSub, description, readmeSummary, languageList, themeColor = "#00ff66" }) {
  return (
    <div
      className={`relative z-10 flex flex-col gap-4 pb-4 mb-4 border-b ${isLightMode ? "border-zinc-200" : ""}`}
      style={!isLightMode ? { borderBottomColor: `${themeColor}26` } : {}}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`relative shrink-0 p-0.5 rounded-full ${isLightMode ? "bg-zinc-100" : ""}`}
            style={!isLightMode ? { backgroundColor: `${themeColor}1a` } : {}}
          >
            <img
              src={repoDetails.owner.avatarUrl}
              alt={repoDetails.owner.login}
              className={`w-12 h-12 rounded-full border-2 object-cover ${isLightMode ? "border-white" : "border-black"}`}
            />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <a href={repoDetails.owner.htmlUrl} target="_blank" rel="noopener noreferrer" className={`hover:underline ${textSub}`}>
                {repoDetails.owner.login}
              </a>
              <span className={textSub}>/</span>
              <span className={isLightMode ? "text-zinc-700" : "text-zinc-300"}>{repoDetails.name}</span>
            </div>
            <h1 className="text-xl font-medium tracking-tight font-display truncate mt-0.5">
              {repoDetails.name}
            </h1>
            <span className={`inline-block mt-1.5 text-[10px] font-mono uppercase tracking-wider border px-2 py-0.5 rounded-full ${archetype.badgeColor}`}>
              {archetype.name}
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-105 min-w-0">
          <div className="flex flex-col gap-2 items-start lg:items-end">
            <CardDescription
              description={description}
              readmeSummary={readmeSummary}
              isLightMode={isLightMode}
              showLabel={false}
              themeColor={themeColor}
            />
            <TechStackPills
              languageList={languageList || []}
              isLightMode={isLightMode}
              showLabel={false}
              themeColor={themeColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import RepoStoryCard from "@/components/RepoStoryCard";
import ExportControls from "@/components/ExportControls";
import CardWrapper from "@/components/home/CardWrapper";

export default function StoryWorkstation({
  storyData,
  isLightMode,
  setIsLightMode,
  onReset,
}) {
  const cardRef = useRef(null);
  const [themeColor, setThemeColor] = useState("#00ff66");
  const { repoDetails } = storyData.githubData;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-950 pb-4">
        <button
          id="back-to-input-btn"
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-full border border-zinc-850 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Analyze Another Repo</span>
        </button>
        <div className="text-xs font-mono text-zinc-500">
          Story for:{" "}
          <span className="text-zinc-350 font-medium">{repoDetails.fullName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex justify-center py-2 relative w-full overflow-hidden">
          <CardWrapper cardRef={cardRef} cardWidth={800}>
            <RepoStoryCard
              data={storyData}
              cardRef={cardRef}
              isLightMode={isLightMode}
              themeColor={themeColor}
            />
          </CardWrapper>
        </div>

        <div className="lg:col-span-1">
          <ExportControls
            cardRef={cardRef}
            isLightMode={isLightMode}
            setIsLightMode={setIsLightMode}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
          />
        </div>
      </div>
    </div>
  );
}

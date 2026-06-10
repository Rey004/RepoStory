"use client";

import { useState } from "react";
import { Code2 } from "lucide-react";
import { getLanguageIconUrl } from "@/lib/languageIcons";

function LanguageIcon({ name, isLightMode }) {
  const [failed, setFailed] = useState(false);
  const iconUrl = getLanguageIconUrl(name);

  if (failed) {
    return (
      <Code2
        className={`w-3.5 h-3.5 shrink-0 ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}
      />
    );
  }

  return (
    <img
      src={iconUrl}
      alt=""
      className="w-3.5 h-3.5 shrink-0 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function TechStackPills({ languageList, isLightMode }) {
  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-emerald-700" : "text-[#00ff66]"}`}>
          // tech.stack
        </span>
        <div className={`flex-1 h-px ${isLightMode ? "bg-zinc-200" : "bg-[#00ff66]/20"}`} />
      </div>

      {languageList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {languageList.map((lang) => (
            <span
              key={lang.name}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono transition-colors ${
                isLightMode
                  ? "bg-white border-zinc-200 text-zinc-700 hover:border-emerald-300"
                  : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-[#00ff66]/40"
              }`}
            >
              <LanguageIcon name={lang.name} isLightMode={isLightMode} />
              <span>{lang.name}</span>
              <span className={isLightMode ? "text-emerald-600" : "text-[#00ff66]/80"}>
                {lang.percentage}%
              </span>
            </span>
          ))}
        </div>
      ) : (
        <p className={`text-[10px] font-mono italic ${isLightMode ? "text-zinc-500" : "text-zinc-500"}`}>
          No languages detected
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Code2 } from "lucide-react";
import { getLanguageIconUrl } from "@/lib/languageIcons";

function LanguageIcon({ name, themeColor }) {
  const [failed, setFailed] = useState(false);
  const iconUrl = getLanguageIconUrl(name);

  if (failed) {
    return <Code2 className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />;
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

export default function TechStackPills({ languageList, isLightMode, showLabel = true, themeColor = "#00ff66" }) {
  return (
    <div className="relative z-10">
      {showLabel && (
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: themeColor }}>
            // tech.stack
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${themeColor}33` }} />
        </div>
      )}

      {languageList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {languageList.map((lang) => (
            <span
              key={lang.name}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono transition-colors ${
                isLightMode
                  ? "bg-white border-zinc-200 text-zinc-700"
                  : "bg-zinc-950/80 border-zinc-800 text-zinc-300"
              }`}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${themeColor}66`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; }}
            >
              <LanguageIcon name={lang.name} themeColor={themeColor} />
              <span>{lang.name}</span>
              <span style={{ color: `${themeColor}cc` }}>{lang.percentage}%</span>
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

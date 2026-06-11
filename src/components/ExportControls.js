import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Download, Sun, Moon } from "lucide-react";
import CustomColorPicker from "@/components/CustomColorPicker";

export default function ExportControls({
  cardRef,
  isLightMode,
  setIsLightMode,
  themeColor,
  setThemeColor,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 200));

      const filter = (node) => {
        // Prevent copying control elements in the export if any
        return node.tagName !== "BUTTON";
      };

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Retina scale for crisp images
        backgroundColor: isLightMode ? "#f6f8fa" : "#000000",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          margin: "0",
        },
        filter
      });

      const link = document.createElement("a");
      link.download = "repostory-card.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("Failed to export card as image. Some browser extensions or loaded images might restrict local exports.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-lg border border-zinc-800 bg-zinc-950/40 w-full font-mono">
      <h2 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Card Customizer</h2>

      {/* Theme Toggle Button */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
        <span className="text-xs text-zinc-400">Layout Theme</span>
        <button
          id="toggle-theme-btn"
          onClick={() => setIsLightMode(!isLightMode)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full border border-zinc-850 hover:border-zinc-750 bg-black hover:bg-zinc-900 transition-colors"
        >
          {isLightMode ? (
            <>
              <Moon className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-yellow-500" />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Theme Color Picker Section */}
      <div className="flex flex-col gap-2 pb-3 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Accent Color</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500">{themeColor.toUpperCase()}</span>
            <CustomColorPicker value={themeColor} onChange={setThemeColor} />
          </div>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-2">
        <button
          id="download-png-btn"
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-full bg-[#00ff66] text-black hover:bg-[#00e655] transition-all duration-300 cursor-pointer font-display shadow-none"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? "Generating PNG..." : "Download RepoStory"}</span>
        </button>
      </div>

    </div>
  );
}

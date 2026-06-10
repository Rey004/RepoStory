import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Check, Sun, Moon, Copy } from "lucide-react";

// Custom Twitter/X Icon SVG Component
const TwitterIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function ExportControls({ cardRef, isLightMode, setIsLightMode, repoName, ownerName }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
      link.download = `repostory-${ownerName}-${repoName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("Failed to export card as image. Some browser extensions or loaded images might restrict local exports.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareText = `Check out the development story of ${ownerName}/${repoName}! Built with RepoStory.`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}`;

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
              <Moon className="w-3.5 h-3.5 text-[#00ff66]" />
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

      {/* Export Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-2">
        <button
          id="download-png-btn"
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-full bg-[#00ff66] text-black hover:bg-[#00e655] transition-all duration-300 cursor-pointer font-display shadow-none"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? "Generating PNG..." : "Download PNG Card"}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="copy-link-btn"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs rounded-full border border-zinc-850 bg-black hover:bg-zinc-900 hover:border-zinc-750 text-zinc-300 transition-colors cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            id="share-twitter-btn"
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs rounded-full border border-zinc-850 bg-black hover:bg-zinc-900 hover:border-zinc-750 text-zinc-300 transition-colors"
          >
            <TwitterIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Share card</span>
          </a>
        </div>
      </div>

      <div className="text-[10px] text-zinc-600 leading-normal mt-2 border-t border-zinc-900 pt-3">
        💡 <span className="font-semibold text-zinc-500">Pro-tip:</span> Downloads are generated locally at double density, making them crisp for Twitter/X, LinkedIn, and GitHub readmes.
      </div>
    </div>
  );
}

import React, { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Sun, Moon, Share2, Link2, Check } from "lucide-react";
import CustomColorPicker from "@/components/CustomColorPicker";

// --- Social Icons (inline SVGs for platform logos) ---

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

// --- Helper: generate card image as Blob ---

async function generateCardBlob(cardRef, isLightMode) {
  if (!cardRef.current) return null;
  await new Promise((r) => setTimeout(r, 200));

  const filter = (node) => node.tagName !== "BUTTON";

  const dataUrl = await toPng(cardRef.current, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: isLightMode ? "#f6f8fa" : "#000000",
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
      margin: "0",
    },
    filter,
  });

  const res = await fetch(dataUrl);
  return await res.blob();
}

function getShareUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

// --- Social Share Button ---

function SocialButton({ icon, label, onClick, busy, id }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={busy}
      className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950/60 hover:bg-zinc-900/80 transition-all duration-200 cursor-pointer group"
    >
      <div className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-[9px] uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300 font-mono transition-colors">
        {busy ? "..." : label}
      </span>
    </button>
  );
}

// --- Main Component ---

export default function ExportControls({
  cardRef,
  isLightMode,
  setIsLightMode,
  themeColor,
  setThemeColor,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [sharingPlatform, setSharingPlatform] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const blob = await generateCardBlob(cardRef, isLightMode);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "repostory-card.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("Failed to export card as image.");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Share Handlers ---

  const handleXShare = useCallback(async () => {
    setSharingPlatform("x");
    try {
      const blob = await generateCardBlob(cardRef, isLightMode);
      const file = blob ? new File([blob], "repostory-card.png", { type: "image/png" }) : null;
      const shareUrl = getShareUrl();
      const text = `Check out this RepoStory card! 🚀\n${shareUrl}`;

      // Try Web Share API with file first
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text, files: [file] });
      } else {
        // Fallback: open X intent (auto-download image for manual attach)
        if (file) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.download = "repostory-card.png";
          a.href = url;
          a.click();
          URL.revokeObjectURL(url);
        }
        window.open(
          `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out this RepoStory card! 🚀`)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("X share failed:", err);
    } finally {
      setSharingPlatform(null);
    }
  }, [cardRef, isLightMode]);

  const handleLinkedInShare = useCallback(async () => {
    setSharingPlatform("linkedin");
    try {
      const blob = await generateCardBlob(cardRef, isLightMode);
      const file = blob ? new File([blob], "repostory-card.png", { type: "image/png" }) : null;
      const shareUrl = getShareUrl();
      const text = `Check out this RepoStory card! 🚀\n${shareUrl}`;

      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text, files: [file] });
      } else {
        if (file) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.download = "repostory-card.png";
          a.href = url;
          a.click();
          URL.revokeObjectURL(url);
        }
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("LinkedIn share failed:", err);
    } finally {
      setSharingPlatform(null);
    }
  }, [cardRef, isLightMode]);

  const handleInstagramShare = useCallback(async () => {
    setSharingPlatform("instagram");
    try {
      const blob = await generateCardBlob(cardRef, isLightMode);
      if (!blob) return;

      const file = new File([blob], "repostory-card.png", { type: "image/png" });

      // Try Web Share API (mobile may suggest Instagram)
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        // Fallback: download the image for manual posting
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = "repostory-card.png";
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Instagram share failed:", err);
    } finally {
      setSharingPlatform(null);
    }
  }, [cardRef, isLightMode]);

  const handleCommonShare = useCallback(async () => {
    setSharingPlatform("share");
    try {
      const blob = await generateCardBlob(cardRef, isLightMode);
      const file = blob ? new File([blob], "repostory-card.png", { type: "image/png" }) : null;
      const shareUrl = getShareUrl();
      const shareData = {
        title: "RepoStory Card",
        text: "Check out this RepoStory card! 🚀",
        url: shareUrl,
      };

      if (file && navigator.canShare?.({ files: [file] })) {
        shareData.files = [file];
      }

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Share failed:", err);
    } finally {
      setSharingPlatform(null);
    }
  }, [cardRef, isLightMode]);

  const handleCopyLink = useCallback(async () => {
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, []);

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

      {/* Share Section */}
      <div className="flex flex-col gap-3 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Share</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <SocialButton
            id="share-x-btn"
            icon={<XIcon className="w-full h-full" />}
            label="X Post"
            onClick={handleXShare}
            busy={sharingPlatform === "x"}
          />
          <SocialButton
            id="share-linkedin-btn"
            icon={<LinkedInIcon className="w-full h-full" />}
            label="LinkedIn"
            onClick={handleLinkedInShare}
            busy={sharingPlatform === "linkedin"}
          />
          <SocialButton
            id="share-instagram-btn"
            icon={<InstagramIcon className="w-full h-full" />}
            label="Story"
            onClick={handleInstagramShare}
            busy={sharingPlatform === "instagram"}
          />
          <SocialButton
            id="share-common-btn"
            icon={<Share2 className="w-full h-full" />}
            label="Share"
            onClick={handleCommonShare}
            busy={sharingPlatform === "share"}
          />
        </div>

        {/* Copy Link Button */}
        <button
          id="copy-link-btn"
          type="button"
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 text-[10px] rounded-full border border-zinc-800 hover:border-zinc-600 bg-zinc-950/60 hover:bg-zinc-900/80 text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
        >
          {linkCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" />
              <span>Copy Shareable Link</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Zap, 
  ArrowLeft, 
  Terminal, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Heart
} from "lucide-react";
import RepoStoryCard from "@/components/RepoStoryCard";
import ExportControls from "@/components/ExportControls";
import GenerateButton from "@/components/GenerateButton";

// Custom Github Icon SVG Component
const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// Demo options for quick testing
const DEMO_REPOS = [
  { name: "React", url: "https://github.com/facebook/react" },
  { name: "Next.js", url: "https://github.com/vercel/next.js" },
  { name: "zx", url: "https://github.com/google/zx" },
  { name: "Tailwind CSS", url: "https://github.com/tailwindlabs/tailwindcss" },
];

// Steps to simulate in the terminal loading view
const LOADING_STEPS = [
  "Establishing secure connection to api.github.com...",
  "Cloning repository metadata & headers...",
  "Parsing lines of code and language statistics...",
  "Aggregating contributor commits profiles...",
  "Analyzing commit timestamps & weekly patterns...",
  "Determining developer archetype classification...",
  "Assembling timeline milestones & release notes...",
  "Executing story narrative heuristic compilation...",
  "Finalizing visual story card assembly...",
  "Story compiled successfully!"
];
// Pre-defined 8x8 random grid layout pattern for the hover-activated pixel squares (values 1, 2, 3 correspond to animation types, 0 is empty)
const HOVER_GRID_PATTERN = [
  0, 1, 0, 0, 3, 0, 0, 2,
  2, 0, 1, 0, 0, 3, 0, 0,
  0, 0, 0, 2, 0, 0, 1, 0,
  3, 0, 2, 0, 0, 1, 0, 3,
  0, 1, 0, 0, 3, 0, 0, 0,
  0, 0, 2, 0, 0, 1, 0, 2,
  1, 0, 0, 3, 0, 0, 2, 0,
  0, 3, 0, 0, 1, 0, 0, 3
];

const PixelGlowBackground = ({ trail = [], randomPixels = [] }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* 1. Faint ambient background grid */}
    <div className="absolute inset-0 grid-bg opacity-20 z-0" />

    {/* 2. Interactive Spotlight Glow following the cursor */}
    <div 
      className="absolute inset-0 pointer-events-none z-10 opacity-80"
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 102, 0.1) 0%, rgba(0, 255, 102, 0.02) 50%, transparent 100%)`
      }}
    />

    {/* 3. Interactive Neon Grid Hover Highlight */}
    <div 
      className="absolute inset-0 grid-bg pointer-events-none z-10 opacity-80"
      style={{
        WebkitMaskImage: `radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 10%, transparent 100%)`,
        maskImage: `radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 10%, transparent 100%)`,
        filter: "drop-shadow(0 0 6px rgba(0, 255, 102, 0.4))",
        backgroundImage: `
          linear-gradient(to right, rgba(0, 255, 102, 0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 255, 102, 0.15) 1px, transparent 1px)
        `
      }}
    />
    
    {/* 4. Fine Digital Pixel Grid Mask for CRT/terminal texture */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.9)_3px,transparent_3px),linear-gradient(to_bottom,rgba(0,0,0,0.9)_3px,transparent_3px)] bg-[size:6px_6px] opacity-30 z-20" />
    
    {/* Glowing scattered ambient random active pixel groups to cover side empty spaces */}
    <div className="absolute inset-0 pointer-events-none">
      {randomPixels.map((group) => (
        <div 
          key={group.id}
          className="absolute pointer-events-none select-none"
          style={{
            top: group.top,
            left: group.left,
            opacity: group.opacity,
          }}
        >
          <div className="grid grid-cols-3 gap-1">
            {group.pixels.map((p, idx) => (
              <div 
                key={idx}
                className={`w-3 h-3 bg-[#00ff66] shadow-[0_0_10px_#00ff66] animate-pixel-${p.animType} transition-opacity duration-300 ${p.visible ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Fading interactive trail: renders single pixel sparks following cursor */}
      {trail.map((p) => (
        <div 
          key={p.id}
          className={`absolute pointer-events-none select-none z-10 animate-trail-fade w-2 h-2 bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pixel-${p.animType}`}
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
          }}
        />
      ))}
    </div>
  </div>
);

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [showPixels, setShowPixels] = useState(false);
  const [trail, setTrail] = useState([]); // State to track pixel trail
  const [transitionPixels, setTransitionPixels] = useState([]); // State for random text morph transition pixels
  const [randomPixels, setRandomPixels] = useState([]); // State for scattered ambient background pixels
  const [isHovering, setIsHovering] = useState(false);

  const cardRef = useRef(null);

  // Generate random background pixel groups on mount
  useEffect(() => {
    const groups = Array.from({ length: 16 }).map((_, idx) => {
      // Alternate between left and right sides of the page
      const isLeft = idx % 2 === 0;
      const leftVal = isLeft 
        ? Math.random() * 16 + 2  // 2% to 18%
        : Math.random() * 16 + 82; // 82% to 98%
        
      // Generate a 3x3 pixel cluster layout (each group has some cells visible)
      const pixels = Array.from({ length: 9 }).map(() => ({
        visible: Math.random() > 0.55, // ~45% chance of cell being active
        animType: Math.floor(Math.random() * 3) + 1,
      }));

      return {
        id: Math.random().toString(),
        top: `${Math.random() * 90 + 5}%`,
        left: `${leftVal}%`,
        opacity: Math.random() * 0.05 + 0.10, // balanced opacity (10% to 15%)
        pixels,
      };
    });
    setRandomPixels(groups);
  }, []);

  // Cleanup hook for the interactive hover trail
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => {
        const filtered = prev.filter((p) => now - p.createdAt < 800);
        if (filtered.length === prev.length) return prev;
        return filtered;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid cells for neon grid highlights
    const gridX = Math.floor(x / 24) * 24 + 12;
    const gridY = Math.floor(y / 24) * 24 + 12;
    
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
    e.currentTarget.style.setProperty("--mouse-grid-x", `${gridX}px`);
    e.currentTarget.style.setProperty("--mouse-grid-y", `${gridY}px`);

    // Detect if mouse is hovering over interactive elements
    const target = e.target;
    const isInteractive = target && (
      target.closest("a") || 
      target.closest("button") || 
      target.closest("[role='button']") || 
      target.closest(".cursor-pointer") ||
      target.closest("input") ||
      target.closest("select")
    );
    setIsHovering(!!isInteractive);

    // Add trail coordinate if mouse has moved at least 20px from the last saved coordinate
    setTrail((prev) => {
      const last = prev[prev.length - 1];
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          return prev;
        }
      }
      
      const newPixel = {
        id: Math.random().toString(),
        x, // Smooth un-snapped coordinates for fluid trail path
        y,
        createdAt: Date.now(),
        animType: Math.floor(Math.random() * 3) + 1,
      };

      // Keep up to 12 trail nodes for performance
      return [...prev.slice(-11), newPixel];
    });
  };

  // One-time text-morph pixelated transition animation on mount using random trail logic
  useEffect(() => {
    let spawnInterval;
    let cleanupInterval;
    
    // Start spawning random pixels after 400ms
    const startSpawningTimeout = setTimeout(() => {
      setShowPixels(true);
      spawnInterval = setInterval(() => {
        setTransitionPixels((prev) => {
          const now = Date.now();
          const newPixels = Array.from({ length: 8 }).map(() => ({
            id: Math.random().toString(),
            col: Math.floor(Math.random() * 40),
            row: Math.floor(Math.random() * 10),
            isGreen: Math.random() > 0.45, // 55% green, 45% dark gray
            createdAt: now,
          }));
          return [...prev.filter((p) => now - p.createdAt < 300), ...newPixels];
        });
      }, 10);
    }, 400);

    // Swap text at 700ms (when pixel density is highest)
    const textTimeout = setTimeout(() => {
      setIsCut(true);
    }, 700);

    // Stop spawning new pixels at 1000ms and cleanup remaining trail
    const stopSpawningTimeout = setTimeout(() => {
      clearInterval(spawnInterval);
      
      cleanupInterval = setInterval(() => {
        const now = Date.now();
        setTransitionPixels((prev) => {
          const filtered = prev.filter((p) => now - p.createdAt < 300);
          if (filtered.length === 0) {
            clearInterval(cleanupInterval);
            setShowPixels(false);
          }
          return filtered;
        });
      }, 15);
    }, 1000);

    return () => {
      clearTimeout(startSpawningTimeout);
      clearTimeout(textTimeout);
      clearTimeout(stopSpawningTimeout);
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  // Cycle through loading steps during fetch
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => {
          if (prev < LOADING_STEPS.length - 2) {
            return prev + 1;
          }
          return prev;
        });
      }, 900);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchRepoStory = async (urlToFetch) => {
    const targetUrl = urlToFetch || repoUrl;
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);
    setStoryData(null);

    try {
      const response = await fetch(`/api/repo?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch repository story.");
      }

      // Ensure last loading steps display before rendering
      setLoadingStepIndex(LOADING_STEPS.length - 1);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRepoStory();
  };

  const handleDemoClick = (url) => {
    setRepoUrl(url);
    fetchRepoStory(url);
  };

  const handleReset = () => {
    setStoryData(null);
    setRepoUrl("");
    setError(null);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
      className="flex-1 flex flex-col min-h-screen bg-black text-white relative font-sans select-none overflow-y-auto lg:cursor-none"
    >
      {/* Custom High-Tech Cursor (Dot or Arrow + Lagging Outlined Box) */}
      <div 
        className="hidden lg:block absolute pointer-events-none z-[9999]"
        style={{
          left: 'var(--mouse-x, 0px)',
          top: 'var(--mouse-y, 0px)',
          transform: isHovering ? 'translate(0px, 0px)' : 'translate(-50%, -50%)',
        }}
      >
        <div className="transition-all duration-200 ease-out">
          {isHovering ? (
            <svg 
              className="w-[18px] h-[18px] text-[#00ff66]" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{ filter: "drop-shadow(0 0 5px rgba(0, 255, 102, 0.7))" }}
            >
              <path d="M0 0v16l4.5-4.5 3.5 7 2.5-1.5-3.5-7H12Z" />
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
          )}
        </div>
      </div>
      <div 
        className="hidden lg:block absolute pointer-events-none z-[9999] w-6 h-6 border transition-[left,top,transform,opacity] duration-[90ms,90ms,200ms,200ms] ease-out"
        style={{
          left: 'var(--mouse-x, 0px)',
          top: 'var(--mouse-y, 0px)',
          transform: `translate(-50%, -50%) scale(${isHovering ? 0 : 1})`,
          opacity: isHovering ? 0 : 1,
          borderColor: 'rgba(0, 255, 102, 0.35)',
        }}
      />
      {/* Pixelated Green Grid Background */}
      <PixelGlowBackground trail={trail} randomPixels={randomPixels} />

      {/* Viewport-Aligned Sidebar Decorators (Landing page only) */}
      {!storyData && (
        <>
          {/* Viewport Side Ambient Green Glow Auras (Permanently Visible, subtle at the extreme edges) */}
          <div className="absolute left-0 top-1/6 bottom-1/6 w-32 md:w-72 bg-gradient-to-r from-[#00ff66]/22 via-[#00ff66]/5 to-transparent blur-[70px] md:blur-[90px] pointer-events-none z-0" id="left-ambient-glow" />
          <div className="absolute right-0 top-1/6 bottom-1/6 w-32 md:w-72 bg-gradient-to-l from-[#00ff66]/22 via-[#00ff66]/5 to-transparent blur-[70px] md:blur-[90px] pointer-events-none z-0" id="right-ambient-glow" />

          {/* Top Conical Spotlight Beam (Shining down from the ceiling) */}
          {/* Ceiling source light flare */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-16 bg-white/10 blur-[25px] rounded-full pointer-events-none z-10" />
          
          {/* Volumetric spotlight cone */}
          <div 
            className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1400px] h-[750px] pointer-events-none z-0"
            style={{
              background: `conic-gradient(from 140deg at 50% 0%, transparent 0deg, rgba(0, 255, 102, 0.08) 20deg, rgba(0, 255, 102, 0.08) 60deg, transparent 80deg)`,
              filter: 'blur(60px)',
              maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 45%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 45%, transparent 100%)'
            }}
          />
          
          {/* Soft ambient background glow behind the beam */}
          <div className="absolute -top-[250px] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-[#00ff66]/5 blur-[130px] rounded-full pointer-events-none z-0" />
          <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[750px] h-[480px] bg-white/2.5 blur-[110px] rounded-full pointer-events-none z-0" />


        </>
      )}

      {/* Header Branding (Transparent) */}
      <header className="bg-transparent relative z-50 w-full animate-slide-down">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            {/* Header logo: custom vector-based square cursor logo */}
            <div className="w-10 h-10 flex items-center justify-center bg-transparent rounded-none border-none shadow-none text-[#00ff66] transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glowing neon outer square cursor box */}
                <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" stroke-width="2.5" fill="none" style={{ filter: "drop-shadow(0 0 5px rgba(0, 255, 102, 0.5))" }} />
                {/* Inner solid square dot */}
                <rect x="13" y="13" width="6" height="6" fill="currentColor" />
              </svg>
            </div>
            <span className="font-display text-lg font-light tracking-wider">
              RepoStory<span className="text-[#00ff66]">.</span>
            </span>
          </div>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 bg-black transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-10 px-6 py-12 max-w-6xl w-full mx-auto">
        
        {/* State 1: Search Form & Intro */}
        {!isLoading && !storyData && (
          <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6 py-8 relative z-10">


            <div className="flex flex-col items-center gap-4 w-full">
              
              {/* Brand tagline pill (Glassmorphism, minimal border, no glow) */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-[#00ff66] text-xs w-fit mx-auto animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>Transform Repos into Social Story Cards</span>
              </div>

              {/* Slicing Brand Text Morph (Repository -> RepoStory) - Minimal, less weight, no glow */}
              <div className="text-6xl md:text-7xl lg:text-8xl font-light font-display text-center tracking-tight select-none animate-fade-in-delay-100">
                <span className="relative inline-grid grid-cols-1 grid-rows-1 justify-items-center items-center px-4 py-1">
                  {/* Repository text */}
                  <span 
                    className={`col-start-1 row-start-1 inline-block transition-opacity duration-300 text-zinc-500 font-light ${
                      isCut ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    Repository
                  </span>
                  {/* morphing RepoStory text */}
                  <span 
                    className={`col-start-1 row-start-1 font-medium text-white transition-opacity duration-300 ${
                      isCut ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    RepoStory<span className="text-[#00ff66]">.</span>
                  </span>
                  {/* Pixelated Transition Overlay Grid (Dynamic Random Trail) */}
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

              {/* URL Input Form (Rounded Full, no glow shadow) */}
              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto my-2 animate-fade-in-delay-200">
                <div className="relative group rounded-full bg-zinc-950 border border-zinc-850 focus-within:border-[#00ff66] transition-all p-1 flex items-center gap-2 pl-4 pr-1 shadow-none w-full">
                  <div className="flex-1 flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-zinc-550 shrink-0" />
                    <input
                      id="repo-url-input"
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="Paste GitHub Repository URL (e.g. facebook/react)"
                      className="flex-1 bg-transparent text-xs focus:outline-none placeholder-zinc-650 py-2 text-white"
                      required
                    />
                  </div>
                  <GenerateButton
                    id="generate-btn"
                    isGenerating={isLoading}
                    className="shrink-0 scale-95"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 mt-4 p-3 rounded-full border border-red-900 bg-red-950/30 text-red-400 text-xs font-mono text-left px-5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </form>

              {/* Description & Pipeline Layout Split */}
              <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch mt-2 animate-fade-in-delay-300">
                {/* Description of what the tool does */}
                <div className="flex-1 border border-zinc-900/50 rounded-lg bg-zinc-950/5 backdrop-blur-sm hover:bg-zinc-950/40 hover:backdrop-blur-xl hover:border-zinc-800/80 p-4.5 font-sans text-xs text-zinc-400 flex flex-col justify-center text-left relative overflow-hidden shadow-sm transition-all duration-500 ease-out">
                  {/* Subtle decorative glow */}
                  <div className="absolute -left-16 -top-16 w-32 h-32 bg-[#00ff66]/5 blur-2xl rounded-full pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                      What is RepoStory?
                    </h3>
                    <p className="leading-relaxed text-zinc-300 text-xs font-light">
                      RepoStory compiles commits, technology stats, and milestone chronologies from any public GitHub repository into a beautifully styled, shareable visual card.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Milestones', 'Developer Archetype', 'Stack Insights'].map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full border border-zinc-900 bg-zinc-950/60 text-[10px] text-zinc-400 font-sans tracking-wide">
                          ✦ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Unique Techy Hero Status Layout */}
                <div className="flex-1 border border-zinc-900/50 rounded-lg bg-zinc-950/5 backdrop-blur-sm hover:bg-zinc-950/40 hover:backdrop-blur-xl hover:border-zinc-800/80 p-4.5 font-mono text-[11px] text-zinc-400 text-left relative overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-500 ease-out">
                  <div>
                    {/* Console header */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-900/60">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]"></span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-650">analysis_pipeline.sh</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-between">
                      <div className="flex-1 min-w-[180px]">
                        <p className="text-[#00ff66]/90"><span className="text-zinc-700">&gt;</span> repository.analyze()</p>
                        <p className="pl-3.5 text-zinc-300 leading-normal font-light mt-1">"Your repository is more than its commits."</p>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-[#00ff66]/90"><span className="text-zinc-700">&gt;</span> social_cards.compile()</p>
                        <div className="pl-3.5 flex flex-wrap gap-1.5 pt-1.5">
                          {['DNA_DECODER', 'MILESTONES', 'TECH_STACKS', 'SOCIAL_CARDS'].map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded border border-zinc-850 bg-zinc-900/40 text-[9px] text-zinc-550 font-mono tracking-wide">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Repositories (Rounded-Full Buttons) */}
            <div className="flex flex-col gap-3.5 w-full pt-4 animate-fade-in-delay-400">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-600 font-bold">
                Or pick a classic repository:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {DEMO_REPOS.map((demo) => (
                  <button
                    key={demo.name}
                    id={`demo-btn-${demo.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    onClick={() => handleDemoClick(demo.url)}
                    className="px-4 py-2 rounded-full border border-zinc-850 text-xs font-mono bg-zinc-950 text-zinc-400 hover:text-white hover:border-[#00ff66]/50 hover:bg-[#00ff66]/5 transition-all cursor-pointer"
                  >
                    {demo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Terminal Loading State */}
        {isLoading && (
          <div className="w-full max-w-xl p-5 rounded-lg border border-[#00ff66]/20 bg-[#040705] shadow-2xl relative font-mono text-xs">
            {/* Window bar */}
            <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4 text-zinc-550">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                <span className="text-[10px]">repo-analyzer.sh</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
              </div>
            </div>

            {/* Command line */}
            <div className="flex gap-1.5 mb-3 text-zinc-400">
              <span className="text-[#00ff66]">$</span>
              <span>./repo-story --target={repoUrl || "analyzing..."}</span>
            </div>

            {/* Simulated log outputs */}
            <div className="flex flex-col gap-2 min-h-[160px] max-h-[260px] overflow-y-auto pr-2">
              {LOADING_STEPS.slice(0, loadingStepIndex + 1).map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 ${
                    idx === loadingStepIndex ? "text-[#00ff66]" : "text-zinc-550"
                  }`}
                >
                  <span className="select-none">✓</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            
            {/* Blinking cursor */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-650">
              <span>ANALYZER ACTIVE</span>
              <span className="w-2 h-4 bg-[#00ff66] animate-pulse" />
            </div>
          </div>
        )}

        {/* State 3: Active Card Workstation */}
        {!isLoading && storyData && (
          <div className="w-full flex flex-col gap-6 animate-fade-in">
            {/* Back action */}
            <div className="flex justify-between items-center border-b border-zinc-950 pb-4">
              <button
                id="back-to-input-btn"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-full border border-zinc-850 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Analyze Another Repo</span>
              </button>
              <div className="text-xs font-mono text-zinc-500">
                Story for: <span className="text-zinc-350 font-medium">{storyData.githubData.repoDetails.fullName}</span>
              </div>
            </div>

            {/* Customizer / Story layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Card Workspace (Takes 2 columns on large screens) */}
              <div className="lg:col-span-2 flex justify-center py-2 relative">
                <RepoStoryCard 
                  data={storyData} 
                  cardRef={cardRef} 
                  isLightMode={isLightMode} 
                />
              </div>

              {/* Customize & Actions panel */}
              <div className="lg:col-span-1">
                <ExportControls
                  cardRef={cardRef}
                  isLightMode={isLightMode}
                  setIsLightMode={setIsLightMode}
                  repoName={storyData.githubData.repoDetails.name}
                  ownerName={storyData.githubData.repoDetails.owner.login}
                />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black/40 py-6 mt-auto text-xs font-mono text-zinc-400 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RepoStory.</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#00ff66] fill-[#00ff66] animate-pulse" />
            <span>by</span>
            <a 
              href="https://revanshu-portfolio.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-[#00ff66] transition-colors underline decoration-zinc-800 hover:decoration-[#00ff66] underline-offset-4"
            >
              Revanshu
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
